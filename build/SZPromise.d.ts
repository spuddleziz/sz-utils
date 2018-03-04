/// <reference path="../src/@types/BluebirdShim.d.ts" />
/// <reference path="../src/@types/BluebirdStaticShim.d.ts" />
/// <reference types="bluebird" />
import { AnySchema } from "./SZValidator";
import * as Promise from "bluebird";
import BluebirdShim = require("./@types/BluebirdShim");
export declare const BBPromiseShim: any;
export declare const CPPromise: any;
export declare class SZPromiseWhileTimeoutError extends Error {
    constructor();
}
export declare class SZPromiseWhileRetryCountExceededError extends Error {
    constructor();
}
export interface SZPromiseWhileOptions {
    waitTimeoutMS?: number;
    retryCount?: number;
    fullTimeout?: number;
}
export interface ISZCPPromise<R> extends BluebirdShim<R> {
    chainFlowEachCallThis: <U>(fnArray: Array<Function>) => ISZCPPromise<U>;
    stringifyJSON: <U>(fnArray: Array<Function>) => ISZCPPromise<U>;
    validateData: <U>(schema: AnySchema) => ISZCPPromise<U>;
    validateJSON: <U>(schema: AnySchema) => ISZCPPromise<U>;
    parseJSON: <U>() => ISZCPPromise<U>;
    isArray: <U>(allowEmpty?: boolean) => ISZCPPromise<U>;
    isNotFalsey: <U>() => ISZCPPromise<U>;
    isNotFalse: <U>() => ISZCPPromise<U>;
    isNotUndefined: <U>() => ISZCPPromise<U>;
    isNotNull: <U>() => ISZCPPromise<U>;
    promiseWhile: <U>(condition: Function, action: Function) => ISZCPPromise<U>;
    promiseWhileLimit: <U>(options: SZPromiseWhileOptions, condition: Function, action: Function) => ISZCPPromise<U>;
}
export declare const P: {
    resolve: typeof Promise.resolve;
    reject: typeof Promise.reject;
    defer: typeof Promise.defer;
    all: typeof Promise.all;
    each: typeof Promise.each;
    join: typeof Promise.join;
    try: typeof Promise.try;
    method: typeof Promise.method;
    props: typeof Promise.props;
    any: typeof Promise.any;
    some: typeof Promise.some;
    map: typeof Promise.map;
    reduce: typeof Promise.reduce;
    filter: typeof Promise.filter;
    mapSeries: typeof Promise.mapSeries;
    race: typeof Promise.race;
    using: typeof Promise.using;
    promisify: typeof Promise.promisify;
    promisifyAll: typeof Promise.promisifyAll;
    fromCallback: typeof Promise.fromCallback;
    begin: <R>(inData?: any) => ISZCPPromise<R>;
    create: <R>(callback: (resolve: (thenableOrResult?: R | PromiseLike<R>) => void, reject: (error?: any) => void, onCancel?: (callback: () => void) => void) => void) => ISZCPPromise<R>;
};
