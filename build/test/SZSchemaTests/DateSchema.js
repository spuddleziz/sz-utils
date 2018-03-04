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
const moment = require("moment");
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
const dateSchema = SZValidator_1.SZSchemaBuilder.date().required();
const validateValueFunc = function () {
    return dateSchema.validate(this);
};
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
let SZDateSchemaTests = class SZDateSchemaTests {
    "Check DateSchema will accept a javascript date object"() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date(), date)()).eql(date);
    }
    "Check DateSchema will reject a javascript date object that isnt larger than or equal to a mimimum"() {
        let date = new Date(0);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().min(10), date)).to.throw();
    }
    "Check DateSchema will allow a javascript date object that is larger than or equal to a mimimum"() {
        let date = new Date(11);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().min(10), date)()).eql(date);
    }
    "Check DateSchema will reject a javascript date object that isnt smaller than or equal to a maximum"() {
        let date = new Date(11);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().max(10), date)).to.throw();
    }
    "Check DateSchema will accept a javascript date object that is smaller than or equal to a maximum"() {
        let date = new Date(10);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().max(10), date)()).eql(date);
    }
    "Check DateSchema will accept a javascript date object and return a moment object"() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().moment(), date)()).eql(moment(date.getTime()));
    }
    "Check DateSchema will accept a javascript date object and return a javascript timestamp"() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().timestamp(), date)()).eql(date.getTime());
    }
    "Check DateSchema will accept a string and return a javascript timestamp"() {
        let str = "1995-12-25";
        let date = moment(str);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().timestamp(), str)()).eql(date.valueOf());
    }
    "Check DateSchema will accept a ISO:8601 string and return a javascript timestamp"() {
        let str = "2010-01-01T05:06:07";
        let date = moment("2010-01-01T05:06:07", moment.ISO_8601);
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().timestamp(), str)()).eql(date.valueOf());
    }
    "Check DateSchema will accept a javascript date object and return a the same when convert mode is disabled"() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }), date)()).eql(date);
    }
    "Check DateSchema will accept a javascript timestamp and return a the same when convert mode is disabled"() {
        let date = new Date().getTime();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).timestamp(), date)()).eql(date);
    }
    "Check DateSchema will reject a javascript date object when convert mode is disabled and timestamp mode is on."() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).timestamp(), date)).to.throw();
    }
    "Check DateSchema will reject a moment object when convert mode is disabled and timestamp mode is on."() {
        let date = moment(new Date());
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).timestamp(), date)).to.throw();
    }
    "Check DateSchema will reject a string when convert mode is disabled and timestamp mode is on."() {
        let date = "1995-12-25";
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).timestamp(), date)).to.throw();
    }
    "Check DateSchema will accept a moment object when convert mode is disabled and moment mode is on."() {
        let date = moment(new Date());
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).moment(), date)()).eql(date);
    }
    "Check DateSchema will reject a javascript date object when convert mode is disabled and moment mode is on."() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).moment(), date)).to.throw();
    }
    "Check DateSchema will reject a javascript timestamp when convert mode is disabled and moment mode is on."() {
        let date = new Date().getTime();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).moment(), date)).to.throw();
    }
    "Check DateSchema will reject a string when convert mode is disabled and moment mode is on."() {
        let date = "1995-12-25";
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }).moment(), date)).to.throw();
    }
    "Check DateSchema will accept a javascript date object when convert mode is disabled."() {
        let date = new Date();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }), date)()).eql(date);
    }
    "Check DateSchema will reject a moment object when convert mode is disabled."() {
        let date = moment(new Date());
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }), date)).to.throw();
    }
    "Check DateSchema will reject a javascript timestamp when convert mode is disabled."() {
        let date = new Date().getTime();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }), date)).to.throw();
    }
    "Check DateSchema will reject a string when convert mode is disabled."() {
        let date = "1995-12-25";
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.date().options({ convert: false }), date)).to.throw();
    }
};
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript date object that isnt larger than or equal to a mimimum", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will allow a javascript date object that is larger than or equal to a mimimum", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript date object that isnt smaller than or equal to a maximum", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object that is smaller than or equal to a maximum", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object and return a moment object", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object and return a javascript timestamp", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a string and return a javascript timestamp", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a ISO:8601 string and return a javascript timestamp", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object and return a the same when convert mode is disabled", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript timestamp and return a the same when convert mode is disabled", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript date object when convert mode is disabled and timestamp mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a moment object when convert mode is disabled and timestamp mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a string when convert mode is disabled and timestamp mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a moment object when convert mode is disabled and moment mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript date object when convert mode is disabled and moment mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript timestamp when convert mode is disabled and moment mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a string when convert mode is disabled and moment mode is on.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will accept a javascript date object when convert mode is disabled.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a moment object when convert mode is disabled.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a javascript timestamp when convert mode is disabled.", null);
__decorate([
    test
], SZDateSchemaTests.prototype, "Check DateSchema will reject a string when convert mode is disabled.", null);
SZDateSchemaTests = __decorate([
    suite
], SZDateSchemaTests);
//# sourceMappingURL=DateSchema.js.map