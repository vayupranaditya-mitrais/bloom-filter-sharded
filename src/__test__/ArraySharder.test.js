const fs = require('fs');
const ArraySharder = require('../../src/ArraySharder');
const BitArray = require('../../src/BitArray');

jest.mock('fs');

describe('Array sharder test', () => {
    var totalSize = 3500;
    var arrayCount = 4;
    var arraySharder;

    beforeEach(() => {
        arraySharder = new ArraySharder(totalSize);
    })

    it('should count number of BitArrays', () => {
        // Positive test
        expect(arraySharder.bitArrays.length).toBe(arrayCount);

        // Error handling test
        expect(() => {
            new ArraySharder(-1)
        }).toThrow(new Error('totalSize must be greater than 0'));
    });

    it('should be able to create directory', async () => {
        // Positive test
        fs.mkdirSync.mockReturnValue(true);
        expect(async () => {
            await arraySharder.create();
        }).not.toThrow();

        // Error handling test
        let err = new Error();
        err.code = 'EEXIST';
        fs.mkdirSync.mockRejectedValueOnce(err);
        expect(async () => {
            await arraySharder.create();
        }).not.toThrow();
    })

    it('should set the correct array element', async () => {
        let index = 1590;
        fs.writeFile.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(new Array(1000));
        let result = await arraySharder.set(index)
        expect(result).toStrictEqual({chunkNumber: 1, elementIdx: 589});
    })
})