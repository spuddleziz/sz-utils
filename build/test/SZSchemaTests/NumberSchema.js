"use strict";
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
let SZNumberSchemaTests = class SZNumberSchemaTests {
    "Check NumberSchema will accept a number of multiple types"() {
        let numList = [1, -1, 0, 427.69, -222.9777];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number(), num)()).eql(num);
        });
    }
    "Check NumberSchema will accept integers in integer mode"() {
        let numList = [1, -1, 76899922, 23423423, 22, -89889234];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().integer(), num)()).eql(num);
        });
    }
    "Check NumberSchema will reject non number inputs"() {
        let inList = ["hello", "world", new Date()];
        inList.forEach((inItem) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number(), inItem)).to.throw();
        });
    }
    "Check NumberSchema will reject positive numbers in negative mode"() {
        let numList = [500.77, 222.66];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().negative(), num)).to.throw();
        });
    }
    "Check NumberSchema will reject negative numbers in positive mode"() {
        let numList = [-500.77, -222.66];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().positive(), num)).to.throw();
        });
    }
    "Check NumberSchema will reject floats in integer mode"() {
        let numList = [500.77, 222.66];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().integer(), num)).to.throw();
        });
    }
    "Check NumberSchema will reject negative numbers/floats in integer & positive mode"() {
        let numList = [500.77, 222.66, -200, -2556.64335666];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().integer().positive(), num)).to.throw();
        });
    }
    "Check NumberSchema will reject positive numbers/floats in integer & negative mode"() {
        let numList = [500.77, 222.66, 200, 2556.64335666];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().integer().negative(), num)).to.throw();
        });
    }
    "Check NumberSchema will accept numbers under the max limit"() {
        let numList = [-999, 0, 22, 400.27];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().max(400.27), num)()).eql(num);
        });
    }
    "Check NumberSchema will accept numbers larger than the min limit"() {
        let numList = [-400.27, 0, 22, 400.27];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().min(-400.27), num)()).eql(num);
        });
    }
    "Check NumberSchema will reject numbers over the max limit"() {
        let numList = [400.28, 999, 999999.99999999];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().max(400.27), num)).to.throw();
        });
    }
    "Check NumberSchema will reject numbers under the min limit"() {
        let numList = [-9999, -80, 0, 69];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().min(70), num)).to.throw();
        });
    }
    "Check NumberSchema will accept numbers under the less limit"() {
        let numList = [-999, 0, 22, 400.26];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().less(400.27), num)()).eql(num);
        });
    }
    "Check NumberSchema will accept numbers larger than the greater limit"() {
        let numList = [-400.26, 0, 22, 400.27];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().greater(-400.27), num)()).eql(num);
        });
    }
    "Check NumberSchema will reject numbers over the less limit"() {
        let numList = [400.27, 999, 999999.99999999];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().less(400.27), num)).to.throw();
        });
    }
    "Check NumberSchema will reject numbers under the greater limit"() {
        let numList = [-9999, -80, 0, 70];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().greater(70), num)).to.throw();
        });
    }
    "Check NumberSchema will accept numbers that are multiples of the multiple limit"() {
        let numList = [2, 64, 128, 1024];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().multiple(2), num)()).eql(num);
        });
    }
    "Check NumberSchema will reject numbers that are not multiples of the multiple limit"() {
        let numList = [2, 64, 128, 1024];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().multiple(3), num)).to.throw();
        });
    }
    "Check NumberSchema will accept numbers that are of the correct precision with convert mode disabled"() {
        let numList = [11, 11.11, 11.1111];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().options({ convert: false }).precision(4), num)()).eql(num);
        });
    }
    "Check NumberSchema will reject numbers that are of the incorrect precision with convert mode disabled"() {
        let numList = [11.11111, 9.00000002, 6546456456.23492873429384792347];
        numList.forEach((num) => {
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().options({ convert: false }).precision(4), num)).to.throw();
        });
    }
    "Check NumberSchema will accept and convert numbers to the correct precision."() {
        let numList = [11, 11.11, 11.1111, 8976234876234.234982734927834, 23723.1231231, -500, 0, 0.00004, -867486734.9873497834];
        numList.forEach((num) => {
            let exp = (num.toString().indexOf(".") === -1 ? num : parseFloat(num.toFixed(4)));
            chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.number().precision(4), num)()).eql(exp);
        });
    }
};
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept a number of multiple types", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept integers in integer mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject non number inputs", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject positive numbers in negative mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject negative numbers in positive mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject floats in integer mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject negative numbers/floats in integer & positive mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject positive numbers/floats in integer & negative mode", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers under the max limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers larger than the min limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers over the max limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers under the min limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers under the less limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers larger than the greater limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers over the less limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers under the greater limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers that are multiples of the multiple limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers that are not multiples of the multiple limit", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept numbers that are of the correct precision with convert mode disabled", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will reject numbers that are of the incorrect precision with convert mode disabled", null);
__decorate([
    test
], SZNumberSchemaTests.prototype, "Check NumberSchema will accept and convert numbers to the correct precision.", null);
SZNumberSchemaTests = __decorate([
    suite
], SZNumberSchemaTests);
//# sourceMappingURL=NumberSchema.js.map