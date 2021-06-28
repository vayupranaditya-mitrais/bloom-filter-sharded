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
        this.#writeFile(content);

        return content;
    }

    async get(idx) {
        let content = await this.#readFile();
        return content[idx];
    }

    async set(idx) {
        let content = await this.#readFile();
        if (idx >= this.size) return null;
        content[idx] = 1;
        this.#writeFile(content);

        return content;
    }

    #writeFile(content) {
        fs.writeFile(this.path, JSON.stringify(content), function (err) {
            if (err) throw err;
        });
    }

    async #readFile() {
        try {
            var content = await fs.readFileSync(this.path);
        } catch (err) {
            throw err;
        }
        return JSON.parse(content);
    }
}

module.exports = BitArray;
