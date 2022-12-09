package main

import (
	"github.com/go-playground/validator/v10"
	"os"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"net/http"
)

type User struct {
	gorm.Model

	Name     string
	Email    string
	Password string
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

// note if we make a utils file we should probably move this to there
func open_db() (*gorm.DB, error) {
	DATABASE_USERNAME := os.Getenv("MYSQL_USERNAME")
	DATABASE_PASSWORD := os.Getenv("MYSQL_PASSWORD")
	DATABASE_NAME := os.Getenv("MYSQL_NAME")

	return gorm.Open(mysql.Open(DATABASE_USERNAME+":"+DATABASE_PASSWORD+"@tcp(127.0.0.1:3306)/"+DATABASE_NAME), &gorm.Config{})
}

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	db, err := open_db()
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
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		if err = c.Validate(signup); err != nil {
			return err
		}

		return c.JSON(http.StatusOK, signup)
	})

	e.Logger.Fatal(e.Start(":1323"))
}
