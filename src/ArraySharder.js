const fs = require('fs');
const BitArray = require('./BitArray');

const maxChunkSize = 1000;
const dataDir = 'bloomfilter_data';

class ArraySharder {
    constructor(totalSize) {
        this.totalSize = totalSize;
        this.maxChunkSize = maxChunkSize;
        this.arrayCount = Math.ceil(totalSize / maxChunkSize);
        if (this.arrayCount < 1) throw new Error('totalSize must be greater than 0');
        this.dir = dataDir;

        this.bitArrays = ArraySharder.constructAll(
            this.arrayCount,
            this.maxChunkSize
        );
    }

    async create() {
        try {
            fs.mkdirSync(this.dir)
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        await this.#createAll();
    }

    async get(index) {
        let fileNumber = Math.floor(index / this.maxChunkSize);
        let contentIndex = (index % this.maxChunkSize) - 1
        return await this.bitArrays[fileNumber].get(contentIndex);
    }

    async set(index) {
        let fileNumber = Math.floor(index / this.maxChunkSize);
        let contentIndex = (index % this.maxChunkSize) - 1
        this.bitArrays[fileNumber].set(contentIndex);
        return {chunkNumber: fileNumber, elementIdx: contentIndex};
    }

    #createAll() {
        return Promise.all(this.bitArrays.map(function(bitArray) {
            bitArray.create();
        }))
    }

    static constructAll(arrayCount, maxChunkSize) {
        let bitArrays = new Array(arrayCount);
        for (let index = 0; index < bitArrays.length; index++) {
            bitArrays[index] = new BitArray(index, maxChunkSize, dataDir);
        }
        return bitArrays;
    }
}

module.exports = ArraySharder;
