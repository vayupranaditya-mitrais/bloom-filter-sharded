const {when} = require('jest-when');

const BloomFilter = require('../BloomFilter');
const Hasher = require('../Hasher');
const ArraySharder = require('../ArraySharder');

jest.mock('../../src/Hasher');

describe('Bloom filter test', () => {
    /**
     * Values are calculated using
     */
    it('should be able to measure false positivity rate', () => {

        let maxData = 100000;
        let storageSize = 1000000;
        let hashCount = 3;
        let expected = 0.01741060889171107;
        expect(BloomFilter.calcFalsePositivity(maxData, storageSize, hashCount))
            .toBe(expected);
    });

    it('should be able to measure storage size', () => {
        let maxData = 100000;
        let hashCount = 3;
        let expected = 100000000;
        expect(BloomFilter.calcStorageSize(maxData, hashCount))
            .toBe(expected);
    })

    it('should be able to assign correct values', () => {
        let maxData = 100000;
        let bloomFilter = new BloomFilter(maxData)
        let storageSize = 100000000;
        let falsePositivity = 2.687880401118201e-8;
        expect(bloomFilter.storageSize).toBe(storageSize);
        expect(bloomFilter.falsePositivity).toBe(falsePositivity);
        expect(bloomFilter.content.totalSize).toBe(storageSize);
    })

    it('should be able to calculate required indexes for reading and writing', async () => {
        bloomFilter = new BloomFilter(100000);
        let mockMurmur = jest.fn();
        when(mockMurmur).calledWith('testdata').mockReturnValue(3);
        let mockSha256 = jest.fn();
        when(mockSha256).calledWith('testdata').mockReturnValue(20);
        
        mockGet = jest.fn();
        mockGet.mockReturnValue(0);
        when(mockGet).calledWith(3).mockReturnValue(1);
        when(mockGet).calledWith(20).mockReturnValue(1);
        ArraySharder.prototype.get = mockGet;

        mockHashes = jest.fn();
        mockHashes.mockReturnValue([
            mockMurmur,
            mockSha256
        ]);
        Hasher.prototype.getHashes = mockHashes;
        result = await bloomFilter.check('testdata');
        expect(result).toBe(true);
    })
});