const axios = {
    get: jest.fn(() => Promise.resolve({ data: { ask: '123.45' } })),
};
module.exports = axios;