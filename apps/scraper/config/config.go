package config

import (
	"log"
	"os"
	"strings"
)

type Config struct {
	Keywords []string
	DB       DBConfig
}

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

func Load() Config {
	return Config{
		Keywords: loadKeywords(),
		DB:       loadDB(),
	}
}

func loadKeywords() []string {
	raw := mustEnv("SCRAPER_KEYWORDS")
	return strings.Split(raw, ",")
}

func loadDB() DBConfig {
	return DBConfig{
		Host:     mustEnv("POSTGRES_HOST"),
		Port:     mustEnv("POSTGRES_PORT"),
		User:     mustEnv("POSTGRES_USER"),
		Password: mustEnv("POSTGRES_PASSWORD"),
		Name:     mustEnv("POSTGRES_NAME"),
		SSLMode:  getEnv("POSTGRES_SSLMODE", "disable"),
	}
}

func getEnv(key string, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

func mustEnv(key string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	log.Fatalf("missing required env: %s", key)
	return ""
}
