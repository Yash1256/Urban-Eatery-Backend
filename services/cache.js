const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const client = redis.createClient({
    socket: {
        host: 'myapp-redis',
        port: 6379
    }
});

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('::> Redis Client Connected'));
client.on('error', (err) => console.log('<:: Redis Client Error', err));
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    console.log(key)

    // See if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    // If we do, return that
    if (cacheValue) {
        console.log('Coming from Redis')
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    console.log('Coming from MongoDB')
    const result = await exec.apply(this, arguments);

    client.set(key, JSON.stringify(result), 'EX', 10);

    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
