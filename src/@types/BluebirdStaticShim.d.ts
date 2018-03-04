/// <reference path="../@types/BluebirdShim.d.ts" />
import * as Promise from "bluebird";
import BluebirdShim = require("../@types/BluebirdShim");


declare class BluebirdStaticShim<R> {

  static try<R>(fn: () => R | PromiseLike<R>): BluebirdShim<R>;
  static attempt<R>(fn: () => R | PromiseLike<R>): BluebirdShim<R>;

  static method<R, A1>(fn: (arg1: A1) => R | PromiseLike<R>): (arg1: A1) => BluebirdShim<R>;
  static method<R, A1, A2>(fn: (arg1: A1, arg2: A2) => R | PromiseLike<R>): (arg1: A1, arg2: A2) => BluebirdShim<R>;
  static method<R, A1, A2, A3>(fn: (arg1: A1, arg2: A2, arg3: A3) => R | PromiseLike<R>): (arg1: A1, arg2: A2, arg3: A3) => BluebirdShim<R>;
  static method<R, A1, A2, A3, A4>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R | PromiseLike<R>): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => BluebirdShim<R>;
  static method<R, A1, A2, A3, A4, A5>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => R | PromiseLike<R>): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => BluebirdShim<R>;
  static method<R>(fn: (...args: any[]) => R | PromiseLike<R>): (...args: any[]) => BluebirdShim<R>;

  static resolve(): BluebirdShim<void>;
  static resolve<R>(value: R | PromiseLike<R>): BluebirdShim<R>;

  static reject(reason: any): BluebirdShim<never>;

  static defer<R>(): Promise.Resolver<R>;

  static cast<R>(value: R | PromiseLike<R>): BluebirdShim<R>;

  static bind(thisArg: any): BluebirdShim<void>;

  static is(value: any): boolean;

  static longStackTraces(): void;

  static delay<R>(ms: number, value: R | PromiseLike<R>): BluebirdShim<R>;
  static delay(ms: number): BluebirdShim<void>;

  static promisify<T>(
    func: (callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): () => BluebirdShim<T>;
  static promisify<T, A1>(
    func: (arg1: A1, callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): (arg1: A1) => BluebirdShim<T>;
  static promisify<T, A1, A2>(
    func: (arg1: A1, arg2: A2, callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): (arg1: A1, arg2: A2) => BluebirdShim<T>;
  static promisify<T, A1, A2, A3>(
    func: (arg1: A1, arg2: A2, arg3: A3, callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): (arg1: A1, arg2: A2, arg3: A3) => BluebirdShim<T>;
  static promisify<T, A1, A2, A3, A4>(
    func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => BluebirdShim<T>;
  static promisify<T, A1, A2, A3, A4, A5>(
    func: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: (err: any, result?: T) => void) => void,
    options?: Promise.PromisifyOptions
  ): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => BluebirdShim<T>;
  static promisify(nodeFunction: (...args: any[]) => void, options?: Promise.PromisifyOptions): (...args: any[]) => BluebirdShim<any>;

  static promisifyAll<T extends object>(target: T, options?: Promise.PromisifyAllOptions<T>): T;

  static fromNode(resolver: (callback: (err: any, result?: any) => void) => void, options?: Promise.FromNodeOptions): BluebirdShim<any>;
  static fromNode<T>(resolver: (callback: (err: any, result?: T) => void) => void, options?: Promise.FromNodeOptions): BluebirdShim<T>;
  static fromCallback(resolver: (callback: (err: any, result?: any) => void) => void, options?: Promise.FromNodeOptions): BluebirdShim<any>;
  static fromCallback<T>(resolver: (callback: (err: any, result?: T) => void) => void, options?: Promise.FromNodeOptions): BluebirdShim<T>;

  static coroutine<T>(
    generatorFunction: () => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): () => BluebirdShim<T>;
  static coroutine<T, A1>(
    generatorFunction: (a1: A1) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1) => BluebirdShim<T>;
  static coroutine<T, A1, A2>(
    generatorFunction: (a1: A1, a2: A2) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3>(
    generatorFunction: (a1: A1, a2: A2, a3: A3) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3, A4>(
    generatorFunction: (a1: A1, a2: A2, a3: A3, a4: A4) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3, a4: A4) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3, A4, A5>(
    generatorFunction: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3, A4, A5, A6>(
    generatorFunction: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3, A4, A5, A6, A7>(
    generatorFunction: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => BluebirdShim<T>;
  static coroutine<T, A1, A2, A3, A4, A5, A6, A7, A8>(
    generatorFunction: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => IterableIterator<any>,
    options?: Promise.CoroutineOptions
  ): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => BluebirdShim<T>;

  static onPossiblyUnhandledRejection(handler: (reason: any) => any): void;

  static onPossiblyUnhandledRejection(handler?: (error: Error, promise: BluebirdShim<any>) => void): void;

  static all<T1, T2, T3, T4, T5>(values: [PromiseLike<T1> | T1, PromiseLike<T2> | T2, PromiseLike<T3> | T3, PromiseLike<T4> | T4, PromiseLike<T5> | T5]): BluebirdShim<[T1, T2, T3, T4, T5]>;
  static all<T1, T2, T3, T4>(values: [PromiseLike<T1> | T1, PromiseLike<T2> | T2, PromiseLike<T3> | T3, PromiseLike<T4> | T4]): BluebirdShim<[T1, T2, T3, T4]>;
  static all<T1, T2, T3>(values: [PromiseLike<T1> | T1, PromiseLike<T2> | T2, PromiseLike<T3> | T3]): BluebirdShim<[T1, T2, T3]>;
  static all<T1, T2>(values: [PromiseLike<T1> | T1, PromiseLike<T2> | T2]): BluebirdShim<[T1, T2]>;
  static all<T1>(values: [PromiseLike<T1> | T1]): BluebirdShim<[T1]>;
  // array with values
  static all<R>(values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>): BluebirdShim<R[]>;

  static props<K, V>(map: PromiseLike<Map<K, PromiseLike<V> | V>> | Map<K, PromiseLike<V> | V>): BluebirdShim<Map<K, V>>;
  // trusted promise for object
  static props<T>(object: PromiseLike<Promise.ResolvableProps<T>>): BluebirdShim<T>; // tslint:disable-line:unified-signatures
  // object
  static props<T>(object: Promise.ResolvableProps<T>): BluebirdShim<T>; // tslint:disable-line:unified-signatures

  static any<R>(values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>): BluebirdShim<R>;

  static race<R>(values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>): BluebirdShim<R>;

  static some<R>(values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>, count: number): BluebirdShim<R[]>;

  static join<R, A1>(
    arg1: A1 | PromiseLike<A1>,
    handler: (arg1: A1) => R | PromiseLike<R>
  ): BluebirdShim<R>;
  static join<R, A1, A2>(
    arg1: A1 | PromiseLike<A1>,
    arg2: A2 | PromiseLike<A2>,
    handler: (arg1: A1, arg2: A2) => R | PromiseLike<R>
  ): BluebirdShim<R>;
  static join<R, A1, A2, A3>(
    arg1: A1 | PromiseLike<A1>,
    arg2: A2 | PromiseLike<A2>,
    arg3: A3 | PromiseLike<A3>,
    handler: (arg1: A1, arg2: A2, arg3: A3) => R | PromiseLike<R>
  ): BluebirdShim<R>;
  static join<R, A1, A2, A3, A4>(
    arg1: A1 | PromiseLike<A1>,
    arg2: A2 | PromiseLike<A2>,
    arg3: A3 | PromiseLike<A3>,
    arg4: A4 | PromiseLike<A4>,
    handler: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => R | PromiseLike<R>
  ): BluebirdShim<R>;
  static join<R, A1, A2, A3, A4, A5>(
    arg1: A1 | PromiseLike<A1>,
    arg2: A2 | PromiseLike<A2>,
    arg3: A3 | PromiseLike<A3>,
    arg4: A4 | PromiseLike<A4>,
    arg5: A5 | PromiseLike<A5>,
    handler: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => R | PromiseLike<R>
  ): BluebirdShim<R>;

  // variadic array
  /** @deprecated use .all instead */
  static join<R>(...values: Array<R | PromiseLike<R>>): BluebirdShim<R[]>;

  static map<R, U>(
    values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>,
    mapper: (item: R, index: number, arrayLength: number) => U | PromiseLike<U>,
    options?: Promise.ConcurrencyOption
  ): BluebirdShim<U[]>;

  static reduce<R, U>(
    values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>,
    reducer: (total: U, current: R, index: number, arrayLength: number) => U | PromiseLike<U>,
    initialValue?: U
  ): BluebirdShim<U>;

  static filter<R>(
    values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>,
    filterer: (item: R, index: number, arrayLength: number) => boolean | PromiseLike<boolean>,
    option?: Promise.ConcurrencyOption
  ): BluebirdShim<R[]>;

  static each<R, U>(
    values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>,
    iterator: (item: R, index: number, arrayLength: number) => U | PromiseLike<U>
  ): BluebirdShim<R[]>;

  static mapSeries<R, U>(
    values: PromiseLike<Iterable<PromiseLike<R> | R>> | Iterable<PromiseLike<R> | R>,
    iterator: (item: R, index: number, arrayLength: number) => U | PromiseLike<U>
  ): BluebirdShim<U[]>;

  static using<R, T>(
    disposer: Promise.Disposer<R>,
    executor: (transaction: R) => PromiseLike<T>
  ): BluebirdShim<T>;
  static using<R1, R2, T>(
    disposer: Promise.Disposer<R1>,
    disposer2: Promise.Disposer<R2>,
    executor: (transaction1: R1, transaction2: R2
    ) => PromiseLike<T>): BluebirdShim<T>;
  static using<R1, R2, R3, T>(
    disposer: Promise.Disposer<R1>,
    disposer2: Promise.Disposer<R2>,
    disposer3: Promise.Disposer<R3>,
    executor: (transaction1: R1, transaction2: R2, transaction3: R3) => PromiseLike<T>
  ): BluebirdShim<T>;


}

export = BluebirdStaticShim;
