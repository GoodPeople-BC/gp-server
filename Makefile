dbuild:
	docker build -t gp-server:latest .

drun:
	docker run -d -it --name gp-server -p 8080:8080 gp-server:latest

drm:
	docker rm -f gp-server

run:
	yarn dev