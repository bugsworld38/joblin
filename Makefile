setup:
	cd apps/api && npm i
	cd apps/frontend && npm i
	cd apps/db && npm i
	cd apps/extension && npm i

network:
	docker network create "joblin_network" 2>/dev/null || true

dev:
	docker compose up

build:
	docker compose build

clean:
	docker compose down -v

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

extension-dev:
	cd apps/extension && npm run dev

extension-build:
	cd apps/extension && npm run build
