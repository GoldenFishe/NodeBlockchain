const EC = require('elliptic').ec;
const crypto = require('crypto');
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

class Utils {
    static genKeyPair() {
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }

    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
    static hash(data) {
        const hash = crypto.createHash('sha256');
        hash.update(data.toString());
        return hash.digest('hex');
    }
}

module.exports = Utils;