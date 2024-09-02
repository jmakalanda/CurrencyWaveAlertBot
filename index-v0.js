require('dotenv').config();
const axios = require('axios');
const schedule = require('node-schedule');

const API_BASE = process.env.API_BASE;
const API_VERSION = process.env.API_VERSION;
const ENDPOINT = process.env.ENDPOINT;
const CURRENCY_PAIRS = process.env.CURRENCY_PAIRS.split(',');
const ALERT_THRESHOLD = parseFloat(process.env.ALERT_THRESHOLD);
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL, 10);

let lastPrices = {};

// Function to fetch current price for a specific currency pair
async function fetchCurrentPrice(pair) {
    try {
        const response = await axios.get(`${API_BASE}/${API_VERSION}/${ENDPOINT}/${pair}`);
        return parseFloat(response.data.ask);
    } catch (error) {
        console.error(`Error fetching current price for ${pair}:`, error);
        return null;
    }
}

// Function to check for price oscillation for a specific currency pair
async function checkPrice(pair, lastPrices, threshold) {
    const currentPrice = await fetchCurrentPrice(pair);
    if (currentPrice && lastPrices[pair] !== undefined) {
        const priceChange = Math.abs((currentPrice - lastPrices[pair]) / lastPrices[pair]);
        if (priceChange >= threshold) {
            console.log(`Price alert! ${pair} has changed by ${(priceChange * 100).toFixed(2)}%`);
            return true;
        }
    }
    lastPrices[pair] = currentPrice;
    return false;
}

// Schedule the check to run at the specified interval for each currency pair
function startScheduledJob() {
    const job = schedule.scheduleJob(`*/${POLL_INTERVAL / 1000} * * * * *`, () => {
        CURRENCY_PAIRS.forEach(pair => {
            checkPrice(pair, lastPrices, ALERT_THRESHOLD);
        });
    });
    return job;
}

// Prevents job from starting during tests
if (process.env.NODE_ENV !== 'test') {
    startScheduledJob();
  }

// Initial price fetch for all currency pairs
(async () => {
    for (const pair of CURRENCY_PAIRS) {
        lastPrices[pair] = await fetchCurrentPrice(pair);
        console.log(`Initial price for ${pair}: $${lastPrices[pair]}`);
    }
})();


module.exports = { fetchCurrentPrice, checkPrice };