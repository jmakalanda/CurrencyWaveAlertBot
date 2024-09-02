const axios = require('axios');
const schedule = require('node-schedule');
const { insertAlert } = require('./db');
const config = require('./config');

let lastPrices = {};

// Function to fetch current price for a specific currency pair
async function fetchCurrentPrice(pair) {
    try {
        const response = await axios.get(`${config.apiBase}/${config.apiVersion}/${config.endpoint}/${pair}`);
        return parseFloat(response.data.ask);
    } catch (error) {
        console.error(`Error fetching current price for ${pair}:`, error);
        return null;
    }
}

// Function to check for price oscillation and trigger alert
// Note that 'lastPrices' and 'alertThreshold' parameterised for the funtion testable.
async function checkPrice(pair,lastPrices, alertThreshold) {
    const currentPrice = await fetchCurrentPrice(pair);
    if (currentPrice && lastPrices[pair] !== undefined) {
        const priceChange = Math.abs((currentPrice - lastPrices[pair]) / lastPrices[pair]);
        if (priceChange >= alertThreshold) {
            if (process.env.NODE_ENV !== 'test') {
                const alert = {
                    currency_pair: pair,
                    previous_rate: lastPrices[pair],
                    current_rate: currentPrice,
                    percentage_change: (priceChange * 100).toFixed(2),
                    threshold: config.alertThreshold,
                    config: JSON.stringify(config), // Store the config as JSON
                };
                await insertAlert(alert);
            }
            console.log(`Price alert! ${pair} has changed by ${(priceChange * 100).toFixed(2)}%`);
            return true;
        }
    }
    lastPrices[pair] = currentPrice;
    return false;
}

// Function to initialize the last prices for each pair
async function initializePrices() {
    for (const pair of config.currencyPairs) {
        lastPrices[pair] = await fetchCurrentPrice(pair);
        console.log(`Initial price for ${pair}: $${lastPrices[pair]}`);
    }
}

// Schedule the check to run at the specified interval for each currency pair
function startScheduledJob(){
    schedule.scheduleJob(`*/${config.pollInterval / 1000} * * * * *`, () => {
        config.currencyPairs.forEach(pair => {
            checkPrice(pair,lastPrices,config.alertThreshold);
        });
    });
}

module.exports = {
    initializePrices,
    fetchCurrentPrice,
    checkPrice,
    startScheduledJob,
};
