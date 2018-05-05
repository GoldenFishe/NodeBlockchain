const Util = require('../Utils');
const Block = require("../blockchain/Block");

class Transaction {
    constructor() {
        this.id = Util.id();
        this.input = null;
        this.outputs = [];
    }

    static newTransaction(senderWallet, recipient, amount) {
        const transaction = new this();

        if (amount > senderWallet.balance) {
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        transaction.outputs.push(...[
            {amount: senderWallet.balance - amount, address: senderWallet.publicKey},
            {amount, address: recipient}
        ]);

        Transaction.signTransaction(transaction, senderWallet);

        return transaction;
    }

    static signTransaction(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(Block.calculateHash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return Util.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            Util.hash(transaction.outputs)
        )
    }
}

module.exports = Transaction;