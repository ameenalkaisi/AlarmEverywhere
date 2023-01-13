package utils

import (
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func OpenDB() (*gorm.DB, error) {
	DATABASE_USERNAME := os.Getenv("MYSQL_USERNAME")
	DATABASE_PASSWORD := os.Getenv("MYSQL_PASSWORD")
	DATABASE_NAME := os.Getenv("MYSQL_NAME")

	return gorm.Open(mysql.Open(DATABASE_USERNAME+":"+DATABASE_PASSWORD+"@tcp(127.0.0.1:3306)/"+DATABASE_NAME+"?parseTime=true"), &gorm.Config{})
}
