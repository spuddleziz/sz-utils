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
let booleanFalsey = ["n", "false", 0];
let booleanTruthy = ["y", "true", 1];
let booleanSchema = SZValidator_1.SZSchemaBuilder.boolean().truthy(booleanTruthy).falsey(booleanFalsey);
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
let SZBooleanSchemaTests = class SZBooleanSchemaTests {
    "Validate a boolean"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.boolean(), true)()).to.eql(true, `BooleanSchema can't validate true`);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.boolean(), false)()).to.eql(false, `BooleanSchema can't validate false`);
    }
    "Add Truth/Falsey values and check they can be validated"() {
        let booleanSchema = SZValidator_1.SZSchemaBuilder.boolean().truthy(booleanTruthy).falsey(booleanFalsey);
        chai_1.expect(booleanSchema.validate("y")).to.eql(true, `BooleanSchema can't validate y -> true`);
        chai_1.expect(booleanSchema.validate("true")).to.eql(true, `BooleanSchema can't validate "true" -> true`);
        chai_1.expect(booleanSchema.validate(1)).to.eql(true, `BooleanSchema can't validate 1 -> true`);
        chai_1.expect(booleanSchema.validate("n")).to.eql(false, `BooleanSchema can't validate "n" -> false`);
        chai_1.expect(booleanSchema.validate("false")).to.eql(false, `BooleanSchema can't validate "false" -> false`);
        chai_1.expect(booleanSchema.validate(0)).to.eql(false, `BooleanSchema can't validate 0 -> false`);
    }
    "Check truth/false values with insensitive mode off throw"() {
        const checkInvalidTruthy = function () {
            booleanSchema.validate("TRUE");
        };
        chai_1.expect(checkInvalidTruthy).to.throw();
        const checkInvalidFalsey = function () {
            booleanSchema.validate("FALSE");
        };
        chai_1.expect(checkInvalidFalsey).to.throw();
    }
    "Validate a boolean with insensitive mode on"() {
        booleanSchema = booleanSchema.insensitive();
        chai_1.expect(booleanSchema.validate("TRUE")).to.eql(true, `BooleanSchema can't validate "TRUE" -> true with insensitive mode on`);
        chai_1.expect(booleanSchema.validate("FALSE")).to.eql(false, `BooleanSchema can't validate "FALSE" -> false with insensitive mode on`);
    }
};
__decorate([
    test
], SZBooleanSchemaTests.prototype, "Validate a boolean", null);
__decorate([
    test
], SZBooleanSchemaTests.prototype, "Add Truth/Falsey values and check they can be validated", null);
__decorate([
    test
], SZBooleanSchemaTests.prototype, "Check truth/false values with insensitive mode off throw", null);
__decorate([
    test
], SZBooleanSchemaTests.prototype, "Validate a boolean with insensitive mode on", null);
SZBooleanSchemaTests = __decorate([
    suite
], SZBooleanSchemaTests);
//# sourceMappingURL=BooleanSchema.js.map