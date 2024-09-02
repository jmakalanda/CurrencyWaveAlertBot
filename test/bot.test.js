const { fetchCurrentPrice, checkPrice } = require('../alert');
const axios = require('axios');
jest.mock('axios');
jest.mock('../alert.js', () => ({
    ...jest.requireActual('../alert.js'),
    insertAlert: jest.fn(),
  }));

describe('Bot Functionality Tests', () => {

    beforeEach(() => {
        // Clear mock history before each test
        axios.get.mockClear();
    });

    test('fetchCurrentPrice should fetch and return the correct price', async () => {
        const pair = 'BTC-USD';
        axios.get.mockResolvedValueOnce({ data: { ask: '123.45' } });

        const price = await fetchCurrentPrice(pair);
        expect(price).toBe(123.45);
        expect(axios.get).toHaveBeenCalledWith(`https://api.uphold.com/v0/ticker/${pair}`);
    });

    test('checkPrice should detect price oscillation correctly', async () => {
        const pair = 'BTC-USD';
        const lastPrices = { 'BTC-USD': 120.00 };
        axios.get.mockResolvedValueOnce({ data: { ask: '120.037' } }); // 0.01% is 0.012 

        const priceChangeDetected = await checkPrice(pair, lastPrices, 0.0003); // 0.03% threshold == 0.036
        expect(priceChangeDetected).toBe(true);
    });

    test('checkPrice should not detect oscillation when change is below threshold', async () => {
        const pair = 'BTC-USD';
        const lastPrices = { 'BTC-USD': 120.00 };
        axios.get.mockResolvedValueOnce({ data: { ask: '120.011' } }); 

        const priceChangeDetected = await checkPrice(pair, lastPrices, 0.0001); // 0.01% threshold
        expect(priceChangeDetected).toBe(false);
    });
});
