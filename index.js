'use strict';

const requestP = require('request-promise');

function BunyanPOST(options, error) {
    options = options || {};
    this.error = error || function () {};

    if (options.host) {
        this.host = options.host;
    }

    if (options.headers) {
        this.headers = options.headers;
    }

    if (options.env) {
        this.env = options.env;
    }
}

BunyanPOST.prototype.write = function (record) {
    const self = this;

    return requestP({
        uri: self.host,
        method: 'POST',
        headers: self.headers || {},
        json: {
            message: record,
            host: self.host,
            env: self.env
        }
    }).catch((error) => {
        console.log(error);
    });
};

module.exports = BunyanPOST;
