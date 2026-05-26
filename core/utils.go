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

func MapFunc[T, U any](array []T, function func(elem T) U) []U {
	var result = make([]U, len(array))
	for k, v := range array {
		result[k] = function(v)
	}
	return result
}

func Filter[T any](array []T, function func(elem T) bool) []T {
	var result = []T{}
	for _, v := range array {
		if function(v) {
			result = append(result, v)
		}
	}
	return result
}

func Reduce[T, U any](array []T, function func(accumulator U, elem T) U, accumulator U) U {
	for _, v := range array {
		accumulator = function(accumulator, v)
	}
	return accumulator
}
