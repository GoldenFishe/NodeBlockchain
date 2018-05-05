const Block = require('./Block');

class Blockchain {
    constructor() {
        this._chain = [Block.genesisBlock()];
    }

    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, data);

        this.chain.push(block);
    }

    isValidChain(chain) {
        if (JSON.stringify(Block.genesisBlock()) !== this.chain[0]) return false;
        for (let i = 0; i < this.chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash ||
                block.hash !== Block.checkHash(block)) {
                return false
            }
        }
        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.log('Received chain is not longer than current chain.');
            return;
        } else if (!this.isValidChain(chain)) {
            console.log('Received chain is not valid.');
            return;
        }
        console.log('Replacing chain with the new chain.');
        this.chain = chain;
    }

    get chain() {
        return this._chain;
    }

    set chain(chain) {
        this._chain = chain;
    }
}

module.exports = Blockchain;