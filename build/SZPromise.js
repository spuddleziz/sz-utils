"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./@types/BluebirdShim.d.ts" />
/// <reference path="./@types/BluebirdStaticShim.d.ts" />
const lodash_1 = require("lodash");
const Promise = require("bluebird");
exports.BBPromiseShim = require("bluebird/js/release/promise");
exports.CPPromise = exports.BBPromiseShim();
exports.CPPromise.prototype.chain = function (nextFunction, useBoundThis) {
    return this.then((result) => {
        return nextFunction(result);
    });
};
exports.CPPromise.prototype.chainBindArgs = function (thisArg, nextFunction, ...args) {
    return this.then(nextFunction.bind(thisArg, args));
};
exports.CPPromise.prototype.chainEachCall = function (thisArg, fnArray) {
    if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {
        return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));
    }
    let resultStack = [];
    return Promise.each(fnArray, (fnToCall, index) => {
        if (index === 0) {
            return fnToCall.call(thisArg).then((response) => {
                resultStack.push(response);
                return response;
            });
        }
        else {
            return fnToCall.call(thisArg, resultStack[index - 1]).then((response) => {
                resultStack.push(response);
                return response;
            });
        }
    }).then(() => {
        return resultStack;
    });
};
exports.CPPromise.prototype.chainEachCallThis = function (fnArray) {
    if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {
        return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));
    }
    let resultStack = [];
    return Promise.each(fnArray, (fnToCall, index) => {
        if (index === 0) {
            return fnToCall.call(this).then((response) => {
                resultStack.push(response);
                return response;
            });
        }
        else {
            return fnToCall.call(this, resultStack[index - 1]).then((response) => {
                resultStack.push(response);
                return response;
            });
        }
    }).then(() => {
        return resultStack;
    });
};
exports.CPPromise.prototype.chainFlowEachCallThis = function (fnArray) {
    if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {
        return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));
    }
    let pResult = null;
    return exports.CPPromise.each(fnArray, (fnToCall, index) => {
        return fnToCall.call(this).then((response) => {
            pResult = response;
            return response;
        });
    }).then(() => {
        return pResult;
    });
};
exports.CPPromise.prototype.isNotNull = function () {
    return this.then((response) => {
        if (response === null) {
            return exports.CPPromise.reject(new Error(`Response is null`));
        }
        return response;
    });
};
exports.CPPromise.prototype.isNotUndefined = function () {
    return this.then((response) => {
        if (response === undefined) {
            return exports.CPPromise.reject(new Error(`Response is undefined`));
        }
        return response;
    });
};
exports.CPPromise.prototype.isNotFalse = function () {
    return this.then((response) => {
        if (response === false) {
            return exports.CPPromise.reject(new Error(`Response is false`));
        }
        return response;
    });
};
exports.CPPromise.prototype.isNotFalsey = function () {
    return this.chainFlowEachCallThis([
        this.isNotNull,
        this.isNotUndefined,
        this.isNotFalse
    ]);
};
exports.CPPromise.prototype.isArray = function (allowEmpty) {
    return this.isNotFalsey().then((response) => {
        if (!Array.isArray(response) || (!allowEmpty && response.length === 0)) {
            return exports.CPPromise.reject(new Error(`Missing or Empty Array`));
        }
        return response;
    });
};
exports.CPPromise.prototype.parseJSON = function () {
    return this.chainFlowEachCallThis([
        this.isNotNull,
        this.isNotUndefined
    ]).then((response) => {
        return JSON.parse(response);
    });
};
exports.CPPromise.prototype.validateJSON = function (schema) {
    return this.parseJSON().then((response) => {
        return schema.validate(response);
    });
};
exports.CPPromise.prototype.validateData = function (schema) {
    return this.chainFlowEachCallThis([
        this.isNotNull,
        this.isNotUndefined
    ]).then((response) => {
        return schema.validate(response);
    });
};
exports.CPPromise.prototype.stringifyJSON = function (pretty) {
    return this.chainFlowEachCallThis([
        this.isNotNull,
        this.isNotUndefined
    ]).then((response) => {
        if (pretty === true) {
            return JSON.stringify(response, null, "  ");
        }
        return JSON.stringify(response);
    });
};
class SZPromiseWhileTimeoutError extends Error {
    constructor() {
        super(`Timed out waiting for the promise while loop to complete.`);
    }
}
exports.SZPromiseWhileTimeoutError = SZPromiseWhileTimeoutError;
class SZPromiseWhileRetryCountExceededError extends Error {
    constructor() {
        super(`The retry count limit was exceeded waiting for the promise while loop to compelte.`);
    }
}
exports.SZPromiseWhileRetryCountExceededError = SZPromiseWhileRetryCountExceededError;
exports.CPPromise.prototype.promiseWhileLimit = function (options, condition, action) {
    options = lodash_1.defaults(options || {}, DEFAULT_PROMISE_WHILE_LIMIT_OPTIONS);
    if (options.waitTimeoutMS <= 100)
        options.waitTimeoutMS = DEFAULT_PROMISE_WHILE_TIMEOUT;
    let doRetryCount = (options.retryCount > 0);
    let retryCount = 0;
    let doFullTimeout = (options.fullTimeout > 0);
    let startTime = new Date().getTime();
    let resolver = exports.CPPromise.defer();
    let loop = function (resp) {
        if (!condition(resp))
            return resolver.resolve(resp);
        if (doRetryCount && ++retryCount > options.retryCount)
            return resolver.reject(new SZPromiseWhileRetryCountExceededError());
        if (doFullTimeout && startTime + options.fullTimeout > new Date().getTime())
            return resolver.reject(new SZPromiseWhileTimeoutError());
        return exports.CPPromise.delay(options.waitTimeoutMS)
            .then(action)
            .then(loop)
            .catch(resolver.reject);
    };
    action().then(loop);
    return resolver.promise.then((resp) => {
        return resp;
    });
};
const DEFAULT_PROMISE_WHILE_TIMEOUT = 500;
const DEFAULT_PROMISE_WHILE_LIMIT_OPTIONS = {
    waitTimeoutMS: DEFAULT_PROMISE_WHILE_TIMEOUT,
    retryCount: 0,
    fullTimeout: 0
};
exports.CPPromise.prototype.promiseWhile = function (condition, action) {
    return this.promiseWhileLimit({ waitTimeoutMS: DEFAULT_PROMISE_WHILE_TIMEOUT }, condition, action);
};
class SZPromise extends Promise {
    static begin(inData) {
        return exports.CPPromise.resolve(inData);
    }
    static create(callback) {
        return new exports.CPPromise(callback);
    }
}
SZPromise.resolve = exports.CPPromise.resolve;
SZPromise.reject = exports.CPPromise.resolve;
SZPromise.defer = exports.CPPromise.defer;
SZPromise.all = exports.CPPromise.all;
SZPromise.each = exports.CPPromise.each;
SZPromise.join = exports.CPPromise.join;
SZPromise.try = exports.CPPromise.try;
SZPromise.method = exports.CPPromise.method;
SZPromise.props = exports.CPPromise.props;
SZPromise.any = exports.CPPromise.any;
SZPromise.some = exports.CPPromise.some;
SZPromise.map = exports.CPPromise.map;
SZPromise.reduce = exports.CPPromise.reduce;
SZPromise.filter = exports.CPPromise.filter;
SZPromise.mapSeries = exports.CPPromise.mapSeries;
SZPromise.race = exports.CPPromise.race;
SZPromise.using = exports.CPPromise.using;
SZPromise.promisify = exports.CPPromise.promisify;
SZPromise.promisifyAll = exports.CPPromise.promisifyAll;
SZPromise.fromCallback = exports.CPPromise.fromCallback;
exports.P = {
    resolve: SZPromise.resolve,
    reject: SZPromise.reject,
    defer: SZPromise.defer,
    all: SZPromise.all,
    each: SZPromise.each,
    join: SZPromise.join,
    try: SZPromise.try,
    method: SZPromise.method,
    props: SZPromise.props,
    any: SZPromise.any,
    some: SZPromise.some,
    map: SZPromise.map,
    reduce: SZPromise.reduce,
    filter: SZPromise.filter,
    mapSeries: SZPromise.mapSeries,
    race: SZPromise.race,
    using: SZPromise.using,
    promisify: SZPromise.promisify,
    promisifyAll: SZPromise.promisifyAll,
    fromCallback: SZPromise.fromCallback,
    begin: SZPromise.begin,
    create: SZPromise.create
};
//# sourceMappingURL=SZPromise.js.map