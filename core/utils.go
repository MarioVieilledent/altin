package core

import "encoding/json"

func ToJson(v any) []byte {
	json, err := json.Marshal(v)
	if err != nil {
		return []byte("Error while Marshalling JSON")
	}
	return json
}

func ToJsonString(v any) string {
	json, err := json.Marshal(v)
	if err != nil {
		return "Error while Marshalling JSON"
	}
	return string(json)
}
