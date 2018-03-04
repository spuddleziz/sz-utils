/// <reference path="./@types/BluebirdShim.d.ts" />
/// <reference path="./@types/BluebirdStaticShim.d.ts" />
import {isArray, defaults} from "lodash";
import {AnySchema} from "./SZValidator";
import * as Promise from "bluebird";
import BluebirdShim = require("./@types/BluebirdShim");
export const BBPromiseShim = require("bluebird/js/release/promise");

export const CPPromise = BBPromiseShim();

CPPromise.prototype.chain = function(nextFunction:Function, useBoundThis?:boolean) {

  return this.then((result) => {

    return nextFunction(result);

  });

};

CPPromise.prototype.chainBindArgs = function(thisArg:any, nextFunction:Function, ...args:Array<any>) {

  return this.then(nextFunction.bind(thisArg, args));

};

CPPromise.prototype.chainEachCall = function(thisArg:object, fnArray:Array<Function>) {

  if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {

    return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));

  }

  let resultStack = [];

  return Promise.each(fnArray, (fnToCall:Function, index) => {

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

CPPromise.prototype.chainEachCallThis = function(fnArray:Array<Function>) {

  if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {

    return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));

  }

  let resultStack = [];

  return Promise.each(fnArray, (fnToCall:Function, index) => {

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

CPPromise.prototype.chainFlowEachCallThis = function(fnArray:Array<Function>) {

  if (!fnArray || !Array.isArray(fnArray) || fnArray.length === 0) {

    return Promise.reject(new Error(`Cannot chain promises as an array of functions to execute was no supplied`));

  }

  let pResult = null;

  return CPPromise.each(fnArray, (fnToCall:Function, index) => {

    return fnToCall.call(this).then((response) => {

      pResult = response;

      return response;

    });

  }).then(() => {

    return pResult;

  });

};

CPPromise.prototype.isNotNull = function() {

  return this.then((response) => {

    if (response === null) {

      return CPPromise.reject(new Error(`Response is null`));

    }

    return response;

  });

};

CPPromise.prototype.isNotUndefined = function() {

  return this.then((response) => {

    if (response === undefined) {

      return CPPromise.reject(new Error(`Response is undefined`));

    }

    return response;

  });



};

CPPromise.prototype.isNotFalse = function() {

  return this.then((response) => {

    if (<any>response === false) {

      return CPPromise.reject(new Error(`Response is false`));

    }

    return response;

  });

};

CPPromise.prototype.isNotFalsey = function() {

  return this.chainFlowEachCallThis([

    this.isNotNull,
    this.isNotUndefined,
    this.isNotFalse

  ]);

};

CPPromise.prototype.isArray = function(allowEmpty?:boolean) {

  return this.isNotFalsey().then((response) => {

    if (!Array.isArray(response) || (!allowEmpty && response.length === 0)) {

      return CPPromise.reject(new Error(`Missing or Empty Array`));

    }

    return response;

  });

};

CPPromise.prototype.parseJSON = function() {

  return this.chainFlowEachCallThis([

    this.isNotNull,
    this.isNotUndefined

  ]).then((response) => {

    return JSON.parse(response);

  });

};

CPPromise.prototype.validateJSON = function(schema:AnySchema) {

  return this.parseJSON().then((response) => {

    return schema.validate(response);

  });

};

CPPromise.prototype.validateData = function(schema:AnySchema) {

  return this.chainFlowEachCallThis([

    this.isNotNull,
    this.isNotUndefined

  ]).then((response) => {

    return schema.validate(response);

  });

};

CPPromise.prototype.stringifyJSON = function(pretty?:boolean) {

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

export class SZPromiseWhileTimeoutError extends Error {

  constructor() {

    super(`Timed out waiting for the promise while loop to complete.`);

  }

}

export class SZPromiseWhileRetryCountExceededError extends Error {

  constructor() {

    super(`The retry count limit was exceeded waiting for the promise while loop to compelte.`);

  }

}

CPPromise.prototype.promiseWhileLimit = function<T>(options: SZPromiseWhileOptions, condition:Function, action:Function):ISZCPPromise<T> {
  options = defaults(options || {}, DEFAULT_PROMISE_WHILE_LIMIT_OPTIONS);

  if (options.waitTimeoutMS <= 100) options.waitTimeoutMS = DEFAULT_PROMISE_WHILE_TIMEOUT;

  let doRetryCount = (options.retryCount > 0);
  let retryCount = 0;
  let doFullTimeout = (options.fullTimeout > 0);
  let startTime = new Date().getTime();

  let resolver = CPPromise.defer();
  let loop = function(resp) {
    if (!condition(resp)) return resolver.resolve(resp);
    if (doRetryCount && ++retryCount > options.retryCount) return resolver.reject(new SZPromiseWhileRetryCountExceededError());
    if (doFullTimeout && startTime + options.fullTimeout > new Date().getTime()) return resolver.reject(new SZPromiseWhileTimeoutError());
    return CPPromise.delay(options.waitTimeoutMS)
      .then(<any>action)
      .then(loop)
      .catch(resolver.reject);
  };
  action().then(loop);
  return resolver.promise.then((resp:T) => {

    return resp;

  });
};

const DEFAULT_PROMISE_WHILE_TIMEOUT:number = 500;

const DEFAULT_PROMISE_WHILE_LIMIT_OPTIONS:SZPromiseWhileOptions = {

  waitTimeoutMS : DEFAULT_PROMISE_WHILE_TIMEOUT,
  retryCount : 0,
  fullTimeout : 0

};

CPPromise.prototype.promiseWhile = function<T>(condition:Function, action:Function):ISZCPPromise<T> {

  return this.promiseWhileLimit({ waitTimeoutMS : DEFAULT_PROMISE_WHILE_TIMEOUT }, condition, action);

};


export interface SZPromiseWhileOptions {

  waitTimeoutMS?:number;
  retryCount?:number;
  fullTimeout?:number;

}


export interface ISZCPPromise<R> extends BluebirdShim<R> {

  chainFlowEachCallThis : <U>(fnArray:Array<Function>) => ISZCPPromise<U>;
  stringifyJSON         : <U>(fnArray:Array<Function>) => ISZCPPromise<U>;
  validateData          : <U>(schema:AnySchema) => ISZCPPromise<U>;
  validateJSON          : <U>(schema:AnySchema) => ISZCPPromise<U>;
  parseJSON             : <U>() => ISZCPPromise<U>;
  isArray               : <U>(allowEmpty?:boolean) => ISZCPPromise<U>;
  isNotFalsey           : <U>() => ISZCPPromise<U>;
  isNotFalse            : <U>() => ISZCPPromise<U>;
  isNotUndefined        : <U>() => ISZCPPromise<U>;
  isNotNull             : <U>() => ISZCPPromise<U>;
  promiseWhile          : <U>(condition:Function, action:Function) => ISZCPPromise<U>;
  promiseWhileLimit     : <U>(options:SZPromiseWhileOptions, condition:Function, action:Function) => ISZCPPromise<U>;

}



class SZPromise<R> extends Promise<R> {

  public static begin<R>(inData?:any):ISZCPPromise<R> {

    return CPPromise.resolve(inData);

  }

  public static create<R>(callback: (resolve: (thenableOrResult?: R | PromiseLike<R>) => void, reject: (error?: any) => void, onCancel?: (callback: () => void) => void) => void):ISZCPPromise<R> {

    return new CPPromise(callback);

  }

}

SZPromise.resolve = CPPromise.resolve;
SZPromise.reject = CPPromise.resolve;
SZPromise.defer = CPPromise.defer;
SZPromise.all = CPPromise.all;
SZPromise.each = CPPromise.each;
SZPromise.join = CPPromise.join;
SZPromise.try = CPPromise.try;
SZPromise.method = CPPromise.method;
SZPromise.props = CPPromise.props;
SZPromise.any = CPPromise.any;
SZPromise.some = CPPromise.some;
SZPromise.map = CPPromise.map;
SZPromise.reduce = CPPromise.reduce;
SZPromise.filter = CPPromise.filter;
SZPromise.mapSeries = CPPromise.mapSeries;
SZPromise.race = CPPromise.race;
SZPromise.using = CPPromise.using;
SZPromise.promisify = CPPromise.promisify;
SZPromise.promisifyAll = CPPromise.promisifyAll;
SZPromise.fromCallback = CPPromise.fromCallback;

export const P = {

  resolve : SZPromise.resolve,
  reject : SZPromise.reject,
  defer : SZPromise.defer,
  all : SZPromise.all,
  each : SZPromise.each,
  join : SZPromise.join,
  try : SZPromise.try,
  method : SZPromise.method,
  props : SZPromise.props,
  any : SZPromise.any,
  some : SZPromise.some,
  map : SZPromise.map,
  reduce : SZPromise.reduce,
  filter : SZPromise.filter,
  mapSeries : SZPromise.mapSeries,
  race : SZPromise.race,
  using : SZPromise.using,
  promisify : SZPromise.promisify,
  promisifyAll : SZPromise.promisifyAll,
  fromCallback : SZPromise.fromCallback,
  begin : SZPromise.begin,
  create : SZPromise.create

};
