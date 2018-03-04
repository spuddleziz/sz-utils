"use strict";
// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />
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
const chai_1 = require("chai");
const SZValidator_1 = require("../../SZValidator");
const BinarySchema_1 = require("../../SZValidator/SZSchemas/BinarySchema");
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
function unicodeStringToTypedArray(s) {
    let escstr = encodeURIComponent(s);
    let binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    let ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}
let SZBinarySchemaTests = class SZBinarySchemaTests {
    "Check BinarySchema will accept a buffer object"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary(), buff)()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will accept a string"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary(), "hello")()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will accept a string in a different encoding"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary().encoding(BinarySchema_1.BinarySchemaEncodingOption.BASE64), buff.toString("base64"))()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will accept a UInt8Array"() {
        let buff = Buffer.from(unicodeStringToTypedArray("hello"));
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary(), buff)()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will allow buffer sizes less than the maximum limit"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary().max(8), buff)()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will reject buffer sizes larger than the maximum limit"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary().max(4), buff)).to.throw();
    }
    "Check BinarySchema will allow buffer sizes more than the minimum limit"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary().min(4), buff)()).satisfy((bin) => {
            return buff.equals(bin);
        });
    }
    "Check BinarySchema will reject buffer sizes less than the minimum limit"() {
        let buff = Buffer.from("hello", "utf8");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.binary().min(8), buff)).to.throw();
    }
};
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will accept a buffer object", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will accept a string", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will accept a string in a different encoding", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will accept a UInt8Array", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will allow buffer sizes less than the maximum limit", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will reject buffer sizes larger than the maximum limit", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will allow buffer sizes more than the minimum limit", null);
__decorate([
    test
], SZBinarySchemaTests.prototype, "Check BinarySchema will reject buffer sizes less than the minimum limit", null);
SZBinarySchemaTests = __decorate([
    suite
], SZBinarySchemaTests);
//# sourceMappingURL=BinarySchema.js.map