const crypto = require('crypto');

const config = require('./config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this._timestamp = timestamp;
        this._lastHash = lastHash;
        this._hash = hash;
        this._data = data;
        this._nonce = nonce;
        this._difficulty = difficulty || config.DIFFICULTY;
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let timestamp = Date.now();
        let nonce = 0;
        let {difficulty} = lastBlock;
        let hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
            nonce++;
        }
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let {difficulty} = lastBlock;
        return lastBlock.timestamp + config.MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        const hash = crypto.createHash('sha256');
        hash.update(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`);
        return hash.digest('hex');
    }

    static checkHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static genesisBlock() {
        return new Block(Date.now(), '000', '001', 'Genesis Block', 0, config.DIFFICULTY);
    }

    get hash() {
        return this._hash;
    }

    get lastHash() {
        return this._lastHash;
    }

    get difficulty() {
        return this._difficulty;
    }
}

module.exports = Block;