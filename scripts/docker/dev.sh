#!/bin/bash

# Start development environment
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Show running containers
docker compose ps

# Show logs
docker compose logs -f