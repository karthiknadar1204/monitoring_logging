const express = require('express');
const { doSomeHeavyTask } = require('./util');
const client = require('prom-client');
const { metricsMiddleware } = require('./metrics');

const app = express();
const PORT = 8000;

app.use(metricsMiddleware);

app.get('/', (req, res) => {
    return res.json({ message: "Hello from express server." });
});

app.get('/slow', async (req, res) => {
    try {
        const timeTaken = await doSomeHeavyTask();
        return res.json({
            status: "success",
            message: `Heavy Task completed in ${timeTaken}ms`
        });
    } catch (error) {
        return res.status(500).json({ status: "Error", error: error.message });
    }
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
});

app.listen(PORT, () => {
    console.log(`express server is running on port ${PORT}`);
});
