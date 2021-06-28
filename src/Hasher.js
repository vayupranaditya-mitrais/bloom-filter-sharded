const crypto = require('crypto');
const murmurhash = require('murmurhash');

class Hasher {
    constructor(count=null) {
        const allHash = [
            Hasher.murmurV3,
            Hasher.sha256
        ];

        if (!count) count = allHash.length;

        this.hashCount = count;
        this.hashes = allHash.slice(0, count);
    }

    getHashes() {
        return this.hashes;
    }

    static murmurV3(value) {
        return murmurhash.v3(value);
    }

    static sha256(value) {
        let hex = crypto.createHash('sha256')
            .update(value)
            .digest('hex');
        return parseInt(`0x${hex}`);
    }
}

module.exports = Hasher;
