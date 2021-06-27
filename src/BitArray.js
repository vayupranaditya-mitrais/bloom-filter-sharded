const fs = require('fs');

class BitArray {
    constructor(chunkNumber, size, dir) {
        let fileName = `${chunkNumber}.json`;
        this.path = `${dir}/${fileName}`;
        this.size = size;
    }

    create() {
        let content = new Array(this.size);
        content.fill(0);
        fs.writeFile(this.path, JSON.stringify(content), function (err) {
            if (err) throw err;
        });
    }

    async get(idx) {
        try {
            var file = await fs.readFileSync(this.path);
        } catch (err) {
            throw err;
        }

        return JSON.parse(file)[idx];
    }

    async set(idx) {
        try {
            var file = await fs.readFileSync(this.path);
        } catch (err) {
            throw err;
        }

        let content = JSON.parse(file);
        content[idx] = 1;
        fs.writeFile(this.path, JSON.stringify(content), function(err) {
            if (err) throw err;
        });
    }
}

module.exports = BitArray;
