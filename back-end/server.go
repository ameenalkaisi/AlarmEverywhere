package main

import (
	"AlarmEverywhere/utils"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name             string `gorm:"not null"`
	Email            string `gorm:"not null;unique"`
	Password         string `gorm:"not null"`
	Role             string `gorm:"type:varchar(255);not null"`
	Verified         bool   `gorm:"not null;default:0"`
	VerificationCode string
}

type UserSignupRequest struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`

	Password string `json:"password" validate:"required"`
}

type UserLoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UserMeResponse struct {
	Name     string
	Email    string
	Role     string
	Verified bool
}

// seems like we can use this validator for typed struct we make
type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return nil
}

func GetUser(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		var token string
		cookie, err := c.Cookie("token")

		authorizationHeader := c.Request().Header.Get("Authorization")
		fields := strings.Fields(authorizationHeader)

		if len(fields) != 0 && fields[0] == "Bearer" {
			token = fields[1]
		} else if err == nil {
			token = cookie.Value
		}

		if token == "" {
			return c.JSON(http.StatusBadRequest, "not signed in")
		}

		sub, err := utils.ValidateToken(token, os.Getenv("TOKEN_SECRET"))
		if err != nil {
			return c.JSON(http.StatusForbidden, "invalid token")
		}

		db, err := utils.OpenDB()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, "could not open database")
		}

		var user User

		result := db.First(&user, "id = ?", fmt.Sprint(sub))
		if result.Error != nil {
			return c.JSON(http.StatusForbidden, "user no longer exists")
		}

		c.Set("currentUser", user)
		return next(c)
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())

	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	db, err := utils.OpenDB()
	if err != nil {
		panic(err)
	}
	err = db.AutoMigrate(&User{})
	if err != nil {
		panic(err)
	}

	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	e.POST("/users/create", func(c echo.Context) (err error) {
		signup := new(UserSignupRequest)

		if err = c.Bind(signup); err != nil {
			fmt.Println(err)
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		if err = c.Validate(signup); err != nil {
			fmt.Println(err)
			return err
		}

		//todo
		// create random code for the user to make
		// just make a random 6 digit string, padded with 0s
		randomCode := fmt.Sprintf("%09d", rand.Intn(1000000000))
		encodedRandomCode := utils.Encode(randomCode)

		hashedPassword, err := utils.HashPassword(signup.Password)

		if err != nil {
			return err
		}

		newUser := User{
			Name:             signup.Name,
			Email:            strings.ToLower(signup.Email),
			Password:         hashedPassword,
			Role:             "user",
			Verified:         false,
			VerificationCode: encodedRandomCode,
		}
		result := db.Create(&newUser)
		if result.Error != nil {
			return c.JSON(http.StatusBadRequest, result.Error.Error())
		}

		if err := utils.SendCode(newUser.Email, randomCode); err != nil {
			return c.JSON(http.StatusInternalServerError, "could not send e-mail")
		}

		return c.JSON(http.StatusOK, "user created")
	})

	e.GET("/verify-email/:verificationCode", func(c echo.Context) error {
		code := utils.Encode(c.Param("verificationCode"))

		var updatedUser User
		result := db.First(&updatedUser, "verification_code = ?", code)

		if result.Error != nil {
			return c.JSON(http.StatusBadRequest, result.Error.Error())
		}

		updatedUser.VerificationCode = ""
		updatedUser.Verified = true
		if result := db.Save(updatedUser); result.Error != nil {
			return c.JSON(http.StatusInternalServerError, "could not update to a verified account")
		}

		return c.JSON(http.StatusOK, "account verified")
	})

	e.GET("/resend-code:email", func(c echo.Context) error {
		email := c.Param("email")

		var userToUpdate User
		result := db.First(&userToUpdate, "email = ?", email)
		if result.Error != nil {
			return c.JSON(http.StatusBadRequest, "email never registered under an account")
		}

		if userToUpdate.Verified == true {
			return c.JSON(http.StatusBadRequest, "account already verified")
		}

		randomCode := fmt.Sprintf("%09d", rand.Intn(1000000000))
		encodedRandomCode := utils.Encode(randomCode)

		userToUpdate.VerificationCode = encodedRandomCode
		result = db.Save(userToUpdate)
		if result.Error != nil {
			return c.JSON(http.StatusInternalServerError, "could not update the verification code, please try again later")
		}

		if err := utils.SendCode(userToUpdate.Email, encodedRandomCode); err != nil {
			return c.JSON(http.StatusInternalServerError, "could not send code to the e-mail, please try again later")
		}

		return c.JSON(http.StatusOK, "verification code changed and successfully sent to e-mail")
	})

	e.POST("/login", func(c echo.Context) error {
		userLogin := new(UserLoginRequest)

		if err := c.Bind(userLogin); err != nil {
			return c.JSON(http.StatusBadRequest, "incorrect email format or either email or password not entered")
		}

		// find user and password from the database
		var foundUser User
		if result := db.First(&foundUser, "email = ?", strings.ToLower(userLogin.Email)); result.Error != nil {
			fmt.Println(result.Error.Error())
			return c.JSON(http.StatusBadRequest, result.Error.Error())
		}

		if err := utils.VerifyPassword(foundUser.Password, userLogin.Password); err != nil {
			return c.JSON(http.StatusBadRequest, "incorrect password provided")
		}

		if !foundUser.Verified {
			return c.JSON(http.StatusForbidden, "Please verify your email")
		}

		expiredIn, err := time.ParseDuration(os.Getenv("TOKEN_EXPIRED_IN"))
		if err != nil {
			return err
		}

		token, err := utils.GenerateToken(expiredIn, foundUser.ID, os.Getenv("TOKEN_SECRET"))
		if err != nil {
			return err
		}

		maxAge, err := strconv.Atoi(os.Getenv("TOKEN_MAX_AGE"))
		if err != nil {
			return err
		}

		cookie := http.Cookie{
			Name:     "token",
			Value:    token,
			MaxAge:   maxAge,
			Secure:   false,
			HttpOnly: true,
		}
		c.SetCookie(&cookie)

		return c.JSON(http.StatusOK, "login successful")
	})

	e.GET("/logout", func(c echo.Context) error {
		c.SetCookie(&http.Cookie{
			Name:     "token",
			Value:    "",
			MaxAge:   -1,
			Secure:   false,
			HttpOnly: true,
		})
		return c.JSON(http.StatusOK, "logout successfull")
	})

	e.GET("/me", func(c echo.Context) error {
		user := c.Get("currentUser").(User)

		returnedUser := UserMeResponse{
			Name:     user.Name,
			Email:    user.Email,
			Role:     user.Role,
			Verified: user.Verified,
		}

		return c.JSON(http.StatusOK, returnedUser)
	}, GetUser)

	e.Logger.Fatal(e.Start(":1323"))
}
