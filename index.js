'use strict';

const request = require('request');

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

    return request({
        uri: self.host,
        method: 'POST',
        headers: self.headers || {},
        json: {
            message: record,
            host: self.host,
            env: self.env
        }
    });
};

module.exports = BunyanPOST;
