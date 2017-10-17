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

    if (options.interval) {
        this.interval = options.interval;
    }

    this.queuedLogs = [];
    this.interval = options.interval || 0;
    const logEveryInterval = this._logEveryInterval.bind(this);
    logEveryInterval();
}

BunyanPOST.prototype._logEveryInterval = function () {
    const writeLogsBound = this._writeLogs.bind(this);
    setTimeout(() => {
        this.timerSet = true;
        if (this.queuedLogs.length > 0) {
            writeLogsBound();
        }
    }, this.interval);
};

function joinLogs(logs) {
    let joinedLogs = '';
    logs.forEach((log) => {
        const stringLog = JSON.stringify(log);
        joinedLogs += stringLog + '\n';
    });

    return joinedLogs;
}

BunyanPOST.prototype._writeLogs = function () {
    let headers = {};
    if (this.headers) {
        headers = this.headers;
        headers['Content-Type'] = 'application/json';
    } else {
        headers = {'Content-Type': 'application/json'};
    }

    return requestP({
        uri: this.host,
        method: 'POST',
        headers: headers,
        json: true,
        body: {
            message: joinLogs(this.queuedLogs),
            host: this.host,
            name: this.name
        }
    })
    .then(() => {
        this.queuedLogs = [];
    })
    .catch((error) => {
        console.log(error);
    });
};

BunyanPOST.prototype.write = function (record) {
    this.queuedLogs.push(record);
};

module.exports = BunyanPOST;
