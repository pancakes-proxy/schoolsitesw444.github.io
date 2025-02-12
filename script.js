const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    secure: false
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/browse', (req, res) => {
    const targetUrl = req.body.url;
    const options = {
        target: targetUrl,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        }
    };
    console.log(`Proxying request to: ${targetUrl}`);
    proxy.web(req, res, options, (err) => {
        console.error(`Error occurred while proxying request: ${err}`);
        res.status(500).send('Error occurred while proxying request');
    });
});

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});
