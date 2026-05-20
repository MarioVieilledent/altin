package main

import "encoding/json"

func toJson(v any) []byte {
	json, err := json.Marshal(v)
	if err != nil {
		return []byte("Error while Marshalling JSON")
	}
	return json
}

func toJsonString(v any) string {
	json, err := json.Marshal(v)
	if err != nil {
		return "Error while Marshalling JSON"
	}
	return string(json)
}
