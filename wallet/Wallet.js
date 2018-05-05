const config = require('../config');
const Utils = require("../Utils");

class Wallet {
    constructor() {
        this.balance = config.INITIAL_BALANCE;
        this.keyPair = Utils.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    static sign(dataHash) {
        return this.keyPair.sign(dataHash);
    }
}

module.exports = Wallet;