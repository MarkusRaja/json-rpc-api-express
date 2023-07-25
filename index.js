const express = require('express');
const https = require('http');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post('*', (req, res) => {
	const options = {
        hostname: '[RPC_HOSTNAME]',
        port: 9650,
        path: req.originalUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    const rpcReq = https.request(options, (rpcRes) => {
        let data = '';
        rpcRes.on('data', (chunk) => {
            data += chunk;
        });
        rpcRes.on('end', () => {
	    res.setHeader('Content-Type', 'application/json');
            res.send(data);
        });
    });

    rpcReq.on('error', (error) => {
        console.error(error);
        res.send('Error: ' + error);
    });

    rpcReq.write(JSON.stringify(req.body));
    rpcReq.end();
});

app.listen(3600, () => {
    console.log('Server started on port 3600');
});
