package main

import (
	"AlarmEverywhere/utils"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name     string `gorm:"not null"`
	Email    string `gorm:"not null;unique"`
	Password string `gorm:"not null"`
}

type UserSignupRequest struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`

	// todo, make sure this is a hashed value later
	Password string `json:"password" validate:"required"`
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

func main() {
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

		newUser := User{Name: signup.Name, Email: signup.Email, Password: signup.Password}
		result := db.Create(&newUser)

		var response string
		if result.Error != nil {
			response = result.Error.Error()
		} else {
			response = "user created"
		}

		return c.JSON(http.StatusOK, response)
	})

	/*
		TODO, set up e-mail verification
		e.GET("/verify-email/:verification_code", func(c echo.Context) error {
		})
	*/

	e.Logger.Fatal(e.Start(":1323"))
}
