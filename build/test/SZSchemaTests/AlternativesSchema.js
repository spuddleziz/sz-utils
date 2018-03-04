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
let SZAlternativesSchemaTests = class SZAlternativesSchemaTests {
    "Check AlternativesSchema will accept a simple 2 rules try alternative."() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.alternatives([
            SZValidator_1.SZSchemaBuilder.string().regex(/^atempt one$/),
            SZValidator_1.SZSchemaBuilder.number().integer()
        ]), 5)()).eql(5);
    }
};
__decorate([
    test
], SZAlternativesSchemaTests.prototype, "Check AlternativesSchema will accept a simple 2 rules try alternative.", null);
SZAlternativesSchemaTests = __decorate([
    suite
], SZAlternativesSchemaTests);
//# sourceMappingURL=AlternativesSchema.js.map