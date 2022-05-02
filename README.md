# Start docker:



**Run this command for dev**\
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
**Run this command for dev after install some deps**\
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
**Stop this command for dev**\
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

**Run this command for prod**\
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
**Run this command for dev after install some deps**\
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
**Stop this command for prod**\
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml down