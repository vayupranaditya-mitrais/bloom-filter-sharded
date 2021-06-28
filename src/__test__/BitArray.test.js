const fs = require('fs');
const BitArray = require('../../src/BitArray');

jest.mock('fs');

describe('BitArray test', () => {
    var dir = '__testdir';
    var size = 100;
    var chunkNumber = 0;
    var bitArray = new BitArray(chunkNumber, size, dir);
    var zeros;

    beforeEach(() => {
        zeros = new Array(size);
        zeros.fill(0);
    });

    it('should assign all required attributes', () => {
        expect([
            bitArray.path,
            bitArray.size
        ]).toStrictEqual([
            '__testdir/0.json',
            100
        ]);
    });
    
    it('should create array of 0 with the specified length', () => {
        let expectedResult = new Array(size);
        expectedResult.fill(0);

        expect(bitArray.create()).toStrictEqual(expectedResult);
    });

    it('should set element in the index to 1', async () => {
        // Positive test
        let idx = 90;
        zeros[idx] = 1;
        fs.readFileSync.mockReturnValue(JSON.stringify(zeros));
        let result = await bitArray.set(idx);
        expect(result).toStrictEqual(zeros);

        // Negative test
        zeros[idx] = 0;
        bitArray.create();
        idx = size + 1;
        result = await bitArray.set(idx);
        expect(result).toBeNull();
    })

    it('should get element in the index', async () => {
        let zeros = new Array(size);
        zeros.fill(0);

        idx = 90;
        zeros[90] = 1;

        // Positive test
        fs.readFileSync.mockReturnValue(JSON.stringify(zeros));
        result = await bitArray.get(idx);
        expect(result).toBe(1);

        // Negative test
        zeros[90] = 0;
        fs.readFileSync.mockReturnValue(JSON.stringify(zeros));
        idx = size + 1;
        result = await bitArray.get(idx);
        expect(result).not.toBeDefined();
    })

    afterAll(() => {
        fs.rmdirSync.mockClear();
    })
})
