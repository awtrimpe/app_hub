package main

import (
	_ "embed"
	"encoding/base64"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
)

type Page struct {
	Title      string
	Categories []AppCategory
}

type AppCategory struct {
	Category string
	Apps     []App
}

type App struct {
	Acronym      string
	Name         string
	Icon         string
	Link         string
	Environments []AppEnvironment
}

type AppEnvironment struct {
	Name string
	Link string
}

//go:embed main.js
var scriptJs string

//go:embed style.css
var styleCss string

//go:embed logo.svg
var faviconSvg []byte

//go:embed index.html
var template0 string

func loadFile() ([]byte, error) {
	var file_name = "apps.json"
	// Open File
	body, err := os.ReadFile(file_name)
	if err != nil {
		log.Fatalf("Did not find file %s", file_name)
		return nil, err
	}
	// Ensure JSON meets type definition
	var data Page
	jsonErr := json.Unmarshal(body, &data)
	if jsonErr != nil {
		log.Fatalf("Unable to marshal JSON due to %s", err)
		return nil, jsonErr
	}
	return body, nil
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// fill in template
		var template1 = strings.Replace(template0, "INJECT_CSS", styleCss, 1)
		var template2 = strings.Replace(template1, "INJECT_JS", scriptJs, 1)
		var template3 = strings.Replace(template2, "INJECT_FAVICON", base64.StdEncoding.EncodeToString(faviconSvg), 2)
		json, err := loadFile()
		if err != nil {
			log.Fatalf("An error returned from file loader")
		}
		var template4 = strings.Replace(template3, "INJECT_JSON", string(json), 1)

		// Replace commented out items to replace
		var template5 = strings.Replace(template4, "<!-- ", "", -1)
		var template6 = strings.Replace(template5, " -->", "", -1)
		var templateParsed, _ = template.New("").Parse(template6)
		templateParsed.Execute(w, nil)
	})
	log.Println("Application started at http://localhost:5003")
	log.Fatal(http.ListenAndServe(":5003", nil))
}
