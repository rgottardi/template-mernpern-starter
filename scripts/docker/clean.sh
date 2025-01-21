#!/bin/bash

# Stop all containers
docker compose down

# Remove all volumes
docker compose down -v

# Remove all unused containers, networks, and images
docker system prune -f

echo "Docker environment cleaned successfully!"