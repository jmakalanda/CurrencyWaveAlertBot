require('dotenv').config();

const config = {
    apiBase: process.env.API_BASE,
    apiVersion: process.env.API_VERSION,
    endpoint: process.env.ENDPOINT,
    currencyPairs: process.env.CURRENCY_PAIRS.split(','),
    alertThreshold: parseFloat(process.env.ALERT_THRESHOLD),
    pollInterval: parseInt(process.env.POLL_INTERVAL, 10),
    dbUrl: process.env.DATABASE_URL,
};

module.exports = config;