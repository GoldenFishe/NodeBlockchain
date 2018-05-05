const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const BlockChain = require('./Blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet/Wallet');

const config = require('../config');
const app = express();
const blockchain = new BlockChain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/blocks', (req, res) => {
    res.send(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const data = req.body.data;
    blockchain.addBlock(data);
    p2pServer.syncChains();
    console.log('New block added.');
    res.redirect('/blocks');
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(config.HTTP_PORT, () => {
    console.log(`Listening ${config.HTTP_PORT} port.`)
});

p2pServer.listen();

