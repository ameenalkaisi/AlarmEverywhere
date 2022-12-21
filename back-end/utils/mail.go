package utils

import (
	"crypto/tls"
	"fmt"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"
)

func SendCode(toEmail string, code string) error {
	verificationLink := fmt.Sprintf("%s/verify-email/%s", os.Getenv("URL"), code)

	message := gomail.NewMessage()
	message.SetHeader("From", "from@test.com")
	message.SetHeader("To", toEmail)
	message.SetHeader("Subject", "Verify Your Email for AlarmEverywhere!")
	message.SetHeader("Content-Type", "text/html; charset=utf-8")

	// todo, change into a formatted e-mail message
	message.SetBody("text/html",
		fmt.Sprintf("Your code is: <b>%s</b> <br /><a href=%s>Click here to verify your account</a>",
			code, verificationLink))

	smtp_port, err := strconv.Atoi(os.Getenv("SMTP_PORT"))
	if err != nil {
		return err
	}

	dialer := gomail.NewDialer(os.Getenv("SMTP_HOST"), smtp_port, os.Getenv("SMTP_USERNAME"), os.Getenv("SMTP_PASSWORD"))
	dialer.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	if err := dialer.DialAndSend(message); err != nil {
		return err
	}

	return nil
}
