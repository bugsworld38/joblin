container_name = joblin-dev-api
container_command = podman container exec -it -u $(shell id -u) $(container_name)

dev:
	podman compose up

db-migrate:
	@echo "Running migrations..."
	$(container_command) npm run migrate:latest

db-rollback:
	@echo 'Rolling back...'
	$(container_command) npm run migrate:rollback

db-create:
	$(container_command) npm run migrate:make $(name)

