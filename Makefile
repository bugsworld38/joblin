setup:
	cd apps/api && npm i
	cd apps/frontend && npm i
	cd apps/db && npm i

dev:
	podman compose up

db-up:
	$(MAKE) -C apps/db up

db-down:
	$(MAKE) -C apps/db down

db-new:
	$(MAKE) -C apps/db new name=$(name)

db-status:
	$(MAKE) -C apps/db status
