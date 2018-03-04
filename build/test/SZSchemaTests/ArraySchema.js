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
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
let orderedValidatorSchema = SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string())
    .ordered(SZValidator_1.SZSchemaBuilder.string().regex(/^first$/));
let SZArraySchemaTests = class SZArraySchemaTests {
    "Validate an array"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string()), ["hello"])()).eql(["hello"]);
    }
    "Check ArraySchema can add ordered schemas and validate items in order"() {
        let arr = ["first", "hello"];
        chai_1.expect(makeValidator(orderedValidatorSchema, arr)())
            .to.eql(arr, `JSON Schema generated doesn't match expected`);
    }
    "Check ArraySchema will reject ordered items"() {
        let arr = ["not", "hello"];
        chai_1.expect(makeValidator(orderedValidatorSchema, arr))
            .to.throw();
    }
    "Check ArraySchema can handle sparse arrays"() {
        let arr = [];
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string()).sparse(), arr)())
            .to.eql(arr, `JSON Schema generated doesn't match expected`);
    }
    "Check ArraySchema will reject sparse arrays if the shcmea isnt configured for them"() {
        let arr = [];
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string()), arr))
            .to.throw();
    }
    "Check ArraySchema can handle single array items and expand them to an array"() {
        let arr = ["hello"];
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string()).single(), arr[0])())
            .to.eql(arr, `JSON Schema generated doesn't match expected`);
    }
    "Check ArraySchema will reject single array items when single mode isnt enabled"() {
        let arr = ["hello"];
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string()), arr[0]))
            .to.throw();
    }
};
__decorate([
    test
], SZArraySchemaTests.prototype, "Validate an array", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema can add ordered schemas and validate items in order", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema will reject ordered items", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema can handle sparse arrays", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema will reject sparse arrays if the shcmea isnt configured for them", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema can handle single array items and expand them to an array", null);
__decorate([
    test
], SZArraySchemaTests.prototype, "Check ArraySchema will reject single array items when single mode isnt enabled", null);
SZArraySchemaTests = __decorate([
    suite
], SZArraySchemaTests);
//# sourceMappingURL=ArraySchema.js.map