# Dockerized Currency Bot Application with Node.js and PostgreSQL
This repository contains a Node.js bot application Dockerized alongside a PostgreSQL database using Docker Compose. The bot fetches price data for specified currency pairs and stores alerts in the PostgreSQL database.

## Overview
- **Bot**: Fetches and monitors currency prices, and triggers alerts based on configured thresholds.
- **PostgreSQL**: Stores alert data and supports initial setup via SQL scripts.

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup
### 1. Clone the Repository
```bash
git clone https://github.com/jmakalanda/CurrencyWaveAlertBot.git
cd your-repo
```
### 2. Configure Environment Variables
Create/modify the `.env` file in the root of the project with the following content (This file will be utilised by both the Bot Node.js application and the docker-compose.yml):
```env
NODE_ENV=production # 'test' or 'production' (The 'test' flag would by pass certain logic during testing. For example the sheduler to poll the API)
API_BASE=https://api.domain.com
API_VERSION=v0
ENDPOINT=ticker

CURRENCY_PAIRS=BTC-USD,ETH-USD,LTC-USD  # Add multiple pairs here
ALERT_THRESHOLD=0.0001  # 0.01% change (This will determine at what threshold the alerts are generated)
POLL_INTERVAL=5000   # Check every 5 seconds (5000 miliseconds)

DATABASE=botdatabase
DB_USER=dbuser
DB_PASSWORD=thedbuserpassword
DB_HOST=servicename # Remember to use the service name, the container name or the container ip)
DB_PORT=5432
DATABASE_URL=postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DATABASE} # postgres://dbuser:thedbuserpassword@servicename:5432/botdatabase 
```
### 3. Initialize Docker Compose
Ensure that the `Dockerfile.bot` and `init.sql` files are in place:
- **Dockerfile.bot**: Defines the build and run configuration for the Node.js bot.
- **init.sql**: SQL script for initializing the PostgreSQL database schema.

### 4. Build and Start the Containers
```bash
docker-compose up --build
```
This command will:
- Build the Docker images for the bot and PostgreSQL services.
- Start the containers and set up networking between the bot and PostgreSQL services.
### 5. Verify the Services
- **Bot**: The bot will run in the background, fetching and monitoring currency prices.
- **PostgreSQL**: Accessible on port `5432` on your host machine.
## Stopping and Removing Containers
To stop and remove the containers, run:
```bash
docker-compose down
```
This command will stop the containers and remove them along with the associated networks.
## Accessing Logs
To view the logs for the bot service:
```bash
docker-compose logs -f bot
```
To view the logs for PostgreSQL:
```bash
docker-compose logs -f postgres
```
## Development
### Structure of the application code is as follows:
01. index.js: Triggers the initialise the prices. Which will act as a bench mark for the next calculation/oscillation. And trigger the schedule.
02. alert.js: This represent the bussiness layer which houses the meat of the bot logic.
03. config.js: This represents the config layer. Which loads the configs from the .env file.
04. db.js: This represent the backend integration layer. Integrating the application logic with the backend database.
### If you need to make changes to the bot code or the PostgreSQL setup:
1. **Modify the Code**: Edit the bot code in `index.js`, `alert.js`, etc. 
2. **Update Dockerfiles**: If needed, update `Dockerfile.bot` to include new dependencies.
3. **Rebuild Images**: After making changes, rebuild the Docker images:
   ```bash
   docker-compose build
   ```
4. **Restart Services**: Restart the services to apply changes:
   ```bash
   docker-compose up -d
   ```
## SQL Initialization
The `init.sql` file is used to initialize the PostgreSQL database schema. Make sure this file contains all necessary SQL commands for setting up tables and other database objects.
## Troubleshooting
- **Container Not Starting**: Check the logs for errors using `docker-compose logs`.
- **Database Connection Issues**: Ensure the `DATABASE_URL` in `.env` is correctly configured and that the PostgreSQL container is running.
