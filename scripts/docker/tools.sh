#!/bin/bash

# Start development tools
docker compose -f docker-compose.yml -f docker-compose.tools.yml up -d

# Show running containers
docker compose ps

echo "
Development tools are ready:
- Mailhog UI: http://localhost:8025
- Mongo Express: http://localhost:8081
- Redis: localhost:6379
"