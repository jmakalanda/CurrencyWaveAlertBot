const { Pool } = require('pg');
const config = require('./config');

// Create a new pool of connections
const pool = new Pool({
    connectionString: config.dbUrl,
});

// Function to insert an alert into the database
async function insertAlert(alert) {
    const query = `
        INSERT INTO ALERTS (currency_pair, previous_rate, current_rate, percentage_change, threshold, config)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [
        alert.currency_pair,
        alert.previous_rate,
        alert.current_rate,
        alert.percentage_change,
        alert.threshold,
        alert.config,
    ];

    try {
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Error inserting alert:', err);
        console.error('Connection string is: '+ config.dbUrl);
        throw err;
    }
}

module.exports = {
    insertAlert,
};