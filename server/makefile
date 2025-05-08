# Default target that runs the application
all:run

# Install dependencies
tidy:
	@echo "Running go mod tidy..."
	go mod tidy

# Run the application directly without building a binary
run:
	go run cmd/main.go

# Build the application binary
build:
	@if ! ls ./static/dependencies/tailwind*.js 1> /dev/null 2>&1; then \
		echo "No 'tailwind*.js' found in ./static/dependencies folder."; \
		echo "Downloading tailwind..."; \
		if [ ! -d "./bin" ]; then \
			mkdir -p ./bin; \
		fi; \
		curl -sSfL https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.5/dist/index.global.js -o ./static/dependencies/tailwind4.js; \
	fi
	go build -o bin/main cmd/main.go

# Build and then start the application
start:
	go build -o bin/main cmd/main.go # Build the binary
	./bin/main                       # Execute the binary

# Remove build
clean:
	rm -rf bin

# Start development server with hot reload using air
watch:
	@if command -v ./bin/air > /dev/null; then \
	    ./bin/air -c .air.toml -- -h; \
	    echo "Watching...";\
	else \
	    read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
	    if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
	        curl -sSfL https://raw.githubusercontent.com/air-verse/air/master/install.sh | sh -s -- -b ./bin; \
	        ./bin/air -c .air.toml -- -h; \
	        echo "Watching...";\
	    else \
	        echo "You chose not to install air. Exiting..."; \
	        exit 1; \
	    fi; \
	fi

# start the database container. Mention the container name in the variable DB_CONTAINER_NAME
start-db:
	@DB_CONTAINER_NAME="cloud-metric-postgres"; \
	if ! [ -x "$$(command -v docker)" ]; then \
		echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"; \
		exit 1; \
	fi; \
	if ! docker info > /dev/null 2>&1; then \
		echo "Docker daemon is not running. Please start Docker and try again."; \
		exit 1; \
	fi; \
	if [ "$$(docker ps -q -f name=$$DB_CONTAINER_NAME)" ]; then \
		echo "Database container '$$DB_CONTAINER_NAME' already running"; \
		exit 0; \
	fi; \
	if [ "$$(docker ps -q -a -f name=$$DB_CONTAINER_NAME)" ]; then \
		docker start "$$DB_CONTAINER_NAME"; \
		echo "Existing database container '$$DB_CONTAINER_NAME' started"; \
		exit 0; \
	fi; \
	set -a; \
	source .env; \
	DB_PASSWORD=$$(echo "$$DATABASE_URL" | awk -F':' '{print $$3}' | awk -F'@' '{print $$1}'); \
	DB_PORT=$$(echo "$$DATABASE_URL" | awk -F':' '{print $$4}' | awk -F'/' '{print $$1}'); \
	\
	if [ "$$DB_PASSWORD" = "password" ]; then \
		echo "You are using the default database password"; \
		read -p "Should we generate a random password for you? [y/N]: " -r REPLY; \
		if ! [[ $$REPLY =~ ^[Yy]$$ ]]; then \
			echo "Please change the default password in the .env file and try again"; \
			exit 1; \
		fi; \
		DB_PASSWORD=$$(openssl rand -base64 12 | tr '+/' '-_'); \
		sed -i -e "s#:password@#:$$DB_PASSWORD@#" .env; \
	fi; \
	\
	docker run -d \
		--name $$DB_CONTAINER_NAME \
		-e POSTGRES_USER="postgres" \
		-e POSTGRES_PASSWORD="$$DB_PASSWORD" \
		-e POSTGRES_DB=d__repository_sown \
		-p "$$DB_PORT":5432 \
		docker.io/postgres && echo "Database container '$$DB_CONTAINER_NAME' was successfully created"

generate:
	@if ! ls ./bin/sqlc*.wasm 1> /dev/null 2>&1; then \
		echo "No 'sqlc*.wasm' found in ./bin/ folder."; \
		echo "Downloading sqlc..."; \
		if [ ! -d "./bin" ]; then \
			mkdir -p ./bin; \
		fi; \
		curl -sSfL https://github.com/sqlc-dev/sqlc-gen-go/releases/download/v1.4.0/sqlc-gen-go_1.4.0.wasm -o ./bin/sqlc-1.4.0.wasm; \
	fi
	@if ! [ -x "$$(command -v sqlc)" ]; then \
		echo "SQLC is not installed. Please install SQLC and try again."; \
		exit 1; \
	fi
	@echo "Generating db with SQLC..."
	sqlc generate
	@echo "Code generation complete."

watch-css:
	npx tailwindcss -i ./static/css/global.css -o ./static/css/global.out.css --watch