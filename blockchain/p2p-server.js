const Websocket = require('ws');
const config = require('./config');

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pServer {
    constructor(blockchain) {
        this._blockchain = blockchain;
        this._sockets = [];
    }

    listen() {
        const server = new Websocket.Server({port: config.P2P_PORT});
        server.on('connection', socket => {
            this.connectSocket(socket);
        });
        this.connectToPeers();
        console.log(`Listening for P2P connection on ${config.P2P_PORT} port.`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', () => {
                this.connectSocket(socket);
            })
        })
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.');

        this.messageHandler(socket);

        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            this.blockchain.replaceChain(data);
        })
    }

    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChains() {
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        })
    }

    get blockchain() {
        return this._blockchain;
    }

    get sockets() {
        return this._sockets;
    }
}

module.exports = P2pServer;