# Blockchain Price Service - Blockchain Nest.js_241007

 Blockchain Price Service provides a mechanism to fetch cryptocurrency prices for ethereum and polygon chains over specified timeframes. The service allows users to set price alerts and retrieves prices from the last 24 hours.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

## Features

- Retrieve cryptocurrency prices for the last 24 hours.
- Set price alerts for specified percentage increases.
- Group prices by cryptocurrency chains (e.g., Ethereum, Polygon).
- Filter hourly prices to maintain one entry per hour for each chain.
- Swap rate (ETH to BTC) with fees calculation.

## Technologies Used

- **Programming Language:** TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Testing Framework:** Jest
- **Container:** Docker

## Installation

Follow these steps to set up the project locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/chickenpie347/blockchain-price-tracker.git
    ```
2. Navigate to the project directory:
    ```bash
    cd blockchain-price-tracker
    ```
3. Install the dependencies:
    ```bash
    npm install
    # or 
    yarn install
    # or
    docker-compose up --build
    ```
4. Create a `.env` file in the root directory and add your environment variables (database connection, etc.).

## Usage

1. Configure the .env based on the .env.sample, and add in Moralis and CoinMarketCap API Keys.

2. Additionally, configure email for the alerts.

3. Start the application by running:

```bash
npm run start
#or
docker-compose up --build
```

## API Endpoints

You can use tools like Postman or cURL to interact with the API endpoints once the service is running.
The API is available at localhost:3000 and the Swagger Documentation can be found at `localhost:3000/api-docs`

## Testing & Linting

Run tests with:
```
npm run test
#or
npm run test -fix
```

Lint with ESLint:
```
npm run lint
```