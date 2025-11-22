IMAGE_NAME = doorkaz/api-gateway:local
PORT = 8000

# Construir la imagen
build:
	docker build -t $(IMAGE_NAME) .

# Ejecutar la imagen
run:
	docker run -p $(PORT):$(PORT) $(IMAGE_NAME)