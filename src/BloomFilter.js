const ArraySharder = require('./ArraySharder');
const Hasher = require('./Hasher');

const hashCount = 3;

class BloomFilter {
    constructor(maxData, storageSize=null) {
        this.maxData = maxData;
        this.hashCount = hashCount;

        if (!storageSize) {
            storageSize = BloomFilter.calcStorageSize(maxData, this.hashCount);
        }
        this.storageSize = storageSize;
        this.falsePositivity = BloomFilter.calcFalsePositivity(maxData, storageSize, this.hashCount);

        this.content = new ArraySharder(storageSize);
    }

    static calcStorageSize(maxData, hashCount) {
        let currSize = maxData;
        let falsePositivity = this.calcFalsePositivity(maxData, currSize, hashCount);
        let falsePositivityRatio = 1 / falsePositivity;

        while (falsePositivityRatio < maxData) {
            currSize *= 10;
            falsePositivity = this.calcFalsePositivity(maxData, currSize, hashCount);
            falsePositivityRatio = 1 / falsePositivity;
        }
    
        return currSize;
    }

    /**
     * False positivity is measured mathematically as on the link below
     * https://www.geeksforgeeks.org/bloom-filters-introduction-and-python-implementation/
     */
    static calcFalsePositivity(maxData, storageSize, hashCount) {
        let n = maxData;
        let m = storageSize;
        let k = hashCount;
        return (1 - ((1 - (1 / m)) ** (k * n))) ** k;
    }

    create() {
        this.content.create();
    }

    async check(value) {
        let indexes = await this.#getIndexes(value);
        let setStatuses = await Promise.all(indexes.map(function(index) {
            return this.content.get(index);
        }, this));
        return await setStatuses.every(status => status);
    }

    async add(value) {
        let indexes = await this.#getIndexes(value);
        return Promise.all(indexes.map(function(index) {
            return this.content.set(index);
        }, this));
    }

    async #getIndexes(value) {
        const hasher = new Hasher(this.hashCount);
        return await Promise.all(hasher.hashes.map(function(hash) {
            return hash(value) % this.storageSize;
        }, this));
    }
}

module.exports = BloomFilter;
