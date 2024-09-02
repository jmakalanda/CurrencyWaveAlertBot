const { startScheduledJob, initializePrices } = require('./alert');
const config = require('./config');

async function startBot() {
    await initializePrices();
    startScheduledJob();
}
startBot();