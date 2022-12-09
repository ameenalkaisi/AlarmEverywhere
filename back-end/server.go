package main

import (
	"database/sql"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"net/http"
	"os"
)

type UserSignup struct {
	Name  string `json:"name" validate:"required"`
	Email string `json:"email" validate:"required,email"`

	// todo, make sure this is a hashed value later
	Password string `json:"password" validate:"required"`
}

// seems like w can use this validator for typed struct we make
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
func open_db() (*sql.DB, error) {
	DATABASE_USERNAME := os.Getenv("AA_DB_USERNAME")
	DATABASE_PASSWORD := os.Getenv("AA_DB_PASSWORD")
	DATABASE_NAME := os.Getenv("AA_DB_NAME")

	return sql.Open("sql", DATABASE_USERNAME+":"+DATABASE_PASSWORD+"@tcp(127.0.0.1:3306)/"+DATABASE_NAME)
}

func main() {
	e := echo.New()
	e.Validator = &CustomValidator{validator: validator.New()}
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.POST("/users/add", func(c echo.Context) (err error) {
		signup := new(UserSignup)

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
