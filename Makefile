setup:
	cd apps/api && npm i
	cd apps/frontend && npm i
	cd apps/db && npm i

network:
	podman network create "joblin_network" 2>/dev/null || true

dev:
	podman compose up

build:
	podman compose build

clean:
	podman compose down -v

db-up:
	cd apps/db && POSTGRES_HOST=localhost npm run up

db-down:
	cd apps/db && POSTGRES_HOST=localhost npm run down

db-new:
	cd apps/db && POSTGRES_HOST=localhost npm run new $(name)

db-status:
	cd apps/db && POSTGRES_HOST=localhost npm run status

api-generate:
	cd apps/api && npm run generate:types

api-test:
	cd apps/api && npm run test
