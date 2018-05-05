const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('./Blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet/Wallet');
console.log(new Wallet());
const config = require('../config');

const app = express();
const blockchain = new BlockChain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
    const data = req.body.data;
    blockchain.addBlock(data);
    p2pServer.syncChains();
    console.log('New block added.');
    res.redirect('/blocks');
});

app.listen(config.HTTP_PORT, () => {
    console.log(`Listening ${config.HTTP_PORT} port.`)
});

p2pServer.listen();

