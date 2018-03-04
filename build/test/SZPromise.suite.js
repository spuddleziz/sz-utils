"use strict";
// Reference mocha-typescript's global definitions:
/// <reference path="../../node_modules/mocha-typescript/globals.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
let colors = require('mocha/lib/reporters/base').colors;
colors['diff gutter'] = 92;
colors['diff added'] = 32;
colors['diff removed'] = 31;
colors['error stack'] = 92;
colors.progress = 92;
colors.runway = 92;
colors.fast = 92;
colors.pass = 92;
const SZPromise_1 = require("../SZPromise");
const SZValidator_1 = require("../SZValidator");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
before(() => {
    chai.use(chaiAsPromised);
    chai.should();
});
let SZPromiseTestSuite = class SZPromiseTestSuite {
    "SZPromise: isNotNull failure"() {
        return SZPromise_1.P.begin(null)
            .isNotNull()
            .should.eventually.be.rejected;
    }
    "SZPromise: isNotUndefined failure"() {
        return SZPromise_1.P.begin(undefined)
            .isNotUndefined()
            .should.eventually.be.rejected;
    }
    "SZPromise: isNotFalse failure"() {
        return SZPromise_1.P.begin(false)
            .isNotFalse()
            .should.eventually.be.rejected;
    }
    "SZPromise: isNotFalsey failure"() {
        return SZPromise_1.P.begin(false)
            .isNotFalse()
            .should.eventually.be.rejected;
    }
    "SZPromise: isArray failure"() {
        return SZPromise_1.P.begin(false)
            .isArray()
            .should.eventually.be.rejected;
    }
    "SZPromise: parseJSON"() {
        let test_obj = { test_object: "one" };
        return SZPromise_1.P.begin(JSON.stringify(test_obj))
            .parseJSON()
            .then((data) => {
            return chai.expect(data).to.eql(test_obj);
        });
    }
    "SZPromise: validateJSON"() {
        let test_obj = { test_object: "one" };
        return SZPromise_1.P.begin(JSON.stringify(test_obj))
            .validateJSON(SZValidator_1.SZSchemaBuilder.object({ test_object: SZValidator_1.SZSchemaBuilder.string() }))
            .then((data) => {
            return chai.expect(data).to.eql(test_obj);
        });
    }
    "SZPromise: validateData"() {
        let test_obj = { test_object: "one" };
        return SZPromise_1.P.begin(test_obj)
            .validateData(SZValidator_1.SZSchemaBuilder.object({ test_object: SZValidator_1.SZSchemaBuilder.string() }))
            .then((data) => {
            return chai.expect(data).to.eql(test_obj);
        });
    }
    "SZPromise: validateData failure"() {
        let test_obj = { test_object: "one", another_obj: "woop" };
        return SZPromise_1.P.begin(test_obj)
            .validateData(SZValidator_1.SZSchemaBuilder.object({ test_object: SZValidator_1.SZSchemaBuilder.string() }).unknown(false))
            .should.eventually.be.rejected;
    }
    "SZPromise: promiseWhile"() {
        let count = 0;
        return SZPromise_1.P.begin(true)
            .promiseWhile((response) => {
            return response < 10;
        }, () => {
            return SZPromise_1.P.resolve(++count);
        }).should.eventually.be.fulfilled;
    }
    "SZPromise: promiseWhile timeout"() {
        let count = 0;
        return SZPromise_1.P.begin(true)
            .promiseWhileLimit({ fullTimeout: 5000 }, (response) => {
            return response < 50;
        }, () => {
            return SZPromise_1.P.resolve(++count);
        }).should.eventually.be.rejected;
    }
    "SZPromise: promiseWhile retry count exceeded"() {
        let count = 0;
        return SZPromise_1.P.begin(true)
            .promiseWhileLimit({ retryCount: 4 }, (response) => {
            return response < 50;
        }, () => {
            return SZPromise_1.P.resolve(++count);
        }).should.eventually.be.rejected;
    }
};
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: isNotNull failure", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: isNotUndefined failure", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: isNotFalse failure", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: isNotFalsey failure", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: isArray failure", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: parseJSON", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: validateJSON", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: validateData", null);
__decorate([
    test
], SZPromiseTestSuite.prototype, "SZPromise: validateData failure", null);
__decorate([
    test(slow(20000), timeout(40000))
], SZPromiseTestSuite.prototype, "SZPromise: promiseWhile", null);
__decorate([
    test(slow(20000), timeout(40000))
], SZPromiseTestSuite.prototype, "SZPromise: promiseWhile timeout", null);
__decorate([
    test(slow(20000), timeout(40000))
], SZPromiseTestSuite.prototype, "SZPromise: promiseWhile retry count exceeded", null);
SZPromiseTestSuite = __decorate([
    suite
], SZPromiseTestSuite);
//# sourceMappingURL=SZPromise.suite.js.map