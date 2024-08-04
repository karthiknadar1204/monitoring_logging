const client = require('prom-client');
const { requestCounter } = require('./requestCount');
const { httpRequestDurationMicroseconds } = require('./requestTime');
const { activeRequestsGauge } =require("./activeRequests");


const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();

    res.on('finish', function() {
        const endTime = Date.now();
        const duration = endTime - startTime;

        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });

        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);
        activeRequestsGauge.dec();
    });

    next();
};

module.exports = { metricsMiddleware };
