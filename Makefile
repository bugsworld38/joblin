setup:
	cd apps/api && npm i
	cd apps/frontend && npm i

dev:
	podman compose up
