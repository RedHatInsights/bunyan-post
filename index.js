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

    if (options.name) {
        this.name = options.name;
    }
}

BunyanPOST.prototype.write = function (record) {
    const self = this;

    let headers = {};
    if (self.headers) {
        headers = self.headers;
        headers['Content-Type'] = 'application/json';
    } else {
        headers = {'Content-Type': 'application/json'};
    }

    return requestP({
        uri: self.host,
        method: 'POST',
        headers: headers,
        json: true,
        body: {
            message: JSON.stringify(record),
            host: self.host,
            name: self.name
        }
    }).catch((error) => {
        console.log(error);
    });
};

module.exports = BunyanPOST;
