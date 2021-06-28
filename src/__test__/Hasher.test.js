const Hasher = require('../../src/Hasher');

describe('Hasher test', () => {
    it('should not has more hashes attribute than it already had', () => {
        // Positive test
        let hasher = new Hasher(1);
        expect(hasher.hashes.length).toBe(1);

        // Negative test
        hasher = new Hasher(10);
        expect(hasher.hashes.length).toBe(2);
    })

    it('should be able to do Murmur V3 hash and return as int', () => {
        expect(typeof(Hasher.murmurV3(''))).toBe('number');
    })

    it('should be able to do SHA-256 hash and return as int', () => {
        expect(typeof(Hasher.sha256(''))).toBe('number');
    })
})