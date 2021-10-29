package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Client struct {
	Name    string  `json:"name"`
	CPF     string  `json:"cpf"`
	Address Address `json:"address"`
}

type Address struct {
	Street string `json:"street"`
	Number int    `json:"number"`
	City   string `json:"city"`
	State  string `json:"state"`
}

var clientListMap map[string]Client = map[string]Client{}

func main() {
	fmt.Println("Starting server...")
	e := echo.New()

	e.HideBanner = true
	e.GET("/", handlerGet)
	e.POST("/", handlerPost)
	e.DELETE("/", handlerDelete)
	e.DELETE("/:name/", handlerDelete)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	fmt.Println("Server started at http://localhost:1323")
	fmt.Println("Use Ctrl+C to stop the server")
	e.Logger.Fatal(e.Start(":1323"))
}

func handlerGet(ctx echo.Context) (err error) {
	clientList := make([]Client, 0)
	name := ctx.QueryParam("name")
	for _, client := range clientListMap {
		if name != "" {
			if client.Name == name {
				clientList = append(clientList, client)
			}
			continue
		}
		clientList = append(clientList, client)
	}

	return ctx.JSON(200, clientList)
}

func handlerPost(ctx echo.Context) (err error) {
	var client Client
	err = ctx.Bind(&client)
	if err != nil {
		return err
	}
	if client.Name == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "name is required")
	}
	clientListMap[client.Name] = client

	return ctx.JSON(200, client)
}

func handlerDelete(ctx echo.Context) (err error) {
	name := ctx.Param("name")
	if _, ok := clientListMap[name]; ok {
		delete(clientListMap, name)
	} else {
		return echo.NewHTTPError(http.StatusBadRequest, "name not found")
	}

	return ctx.JSON(204, "")
}
