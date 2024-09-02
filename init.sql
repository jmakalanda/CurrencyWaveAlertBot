CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    currency_pair VARCHAR(10) NOT NULL,
    previous_rate DECIMAL(15, 8) NOT NULL,
    current_rate DECIMAL(15, 8) NOT NULL,
    percentage_change DECIMAL(5, 2) NOT NULL,
    threshold DECIMAL(5, 2) NOT NULL,
    alert_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    config JSONB NOT NULL
);