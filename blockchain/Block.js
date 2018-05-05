const crypto = require('crypto'); // lib for create hashes
const config = require('./config'); // config file

/*
    timestamp:string - time when created block (1525528586561)
    lashHash:string - calculateHash of previous block (00d45c8602108751930efa1ebbecbbd815bb1b726ce0feeb458b8a8870aa6f60)
    calculateHash:string - calculateHash of current block (01c7bc656bea4889d4cb324e8c43f613c3c69a093b1a677c60bb125fdcecb1c4)
    data:object - data stored in block ({data: 'Hello World'})
    nonce:int - non important value for calculate calculateHash of new block (1)
    difficulty:int - coefficient for calculate time of new block (2)
 */

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || config.DIFFICULTY;
    }

    static mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;
        let nonce = 0;
        let timestamp = Date.now();
        let {difficulty} = lastBlock;
        let hash = Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
        while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
            nonce++;
        }
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTime) {
        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + config.MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }

    static calculateHash(timestamp, lastHash, data, nonce, difficulty) {
        const hash = crypto.createHash('sha256');
        hash.update(`${timestamp}${lastHash}${JSON.stringify(data)}${nonce}${difficulty}`);
        return hash.digest('hex');
    }

    static checkHash(block) {
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        return Block.calculateHash(timestamp, lastHash, data, nonce, difficulty);
    }

    static genesisBlock() {
        return new Block(Date.now(), '000', '001', 'Genesis Block', 0, config.DIFFICULTY);
    }
}

module.exports = Block;