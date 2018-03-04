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
const stringSchema = SZValidator_1.SZSchemaBuilder.string().required();
const validateValueFunc = function () {
    stringSchema.validate(this);
};
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
let SZStringSchemaTests = class SZStringSchemaTests {
    "Check Invalid Values: null"() {
        chai_1.expect(validateValueFunc.bind(null)).to.throw();
    }
    "Check Invalid Values: undefined"() {
        chai_1.expect(validateValueFunc.bind(undefined)).to.throw();
    }
    "Check Invalid Values: number"() {
        chai_1.expect(validateValueFunc.bind(1)).to.throw();
    }
    "Check Invalid Values: object"() {
        chai_1.expect(validateValueFunc.bind({})).to.throw();
    }
    "Check Invalid Values: Date"() {
        chai_1.expect(validateValueFunc.bind(new Date())).to.throw();
    }
    "Check Invalid Values: Array"() {
        chai_1.expect(validateValueFunc.bind([])).to.throw();
    }
    "Check Standard String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required(), "hello_world")()).eql("hello_world");
    }
    "Check Allow Null"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().allowNull(), null)()).eql(null);
    }
    "Check Valid"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().valid("TEST"), "TEST")()).eql("TEST");
    }
    "Check Valid Insensitive"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().insensitive().valid("TEST").regex(/^[^a-zA-Z0-9]+/), "test")())
            .eql("test");
    }
    "Check Valid MinLength"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().min(2), "test")()).eql("test");
    }
    "Check Invalid MinLength"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().min(10), "test")).to.throw();
    }
    "Check Valid MaxLength"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().max(10), "test")()).eql("test");
    }
    "Check Invalid MaxLength"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().max(2), "test")).to.throw();
    }
    "Check Valid MaxLength with Truncate"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().max(4).truncate(), "hello_world")()).eql("hell");
    }
    "Check Valid Regex"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().regex(/^testing_string$/), "testing_string")())
            .eql("testing_string");
    }
    "Check Invalid Regex"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().regex(/^testing_string$/), "test")).to.throw();
    }
    "Check Inverted Regex"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().regex(/^testing_string$/, { invert: true }), "test")())
            .eql("test");
    }
    "Check Invalid Inverted Regex"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().regex(/^testing_string$/, { invert: true }), "testing_string"))
            .to.throw();
    }
    "Check Any IPv4"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "127.0.0.1")).to.not.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "127.0.0.1/32")).to.not.throw();
    }
    "Check Invalid IPv4"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "255.255.255.256")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "127.0.0.1/0")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "127.0.0.1/33")).to.throw();
    }
    "Check Any IPv6"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.not.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/128")).to.not.throw();
    }
    "Check Invalid IPv6"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "GGGG:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/0")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/129")).to.throw();
    }
    "Check IPv4 with Options"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv4],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.FORBIDDEN
        }), "127.0.0.1")()).eql("127.0.0.1");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv4],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "127.0.0.1/32")()).eql("127.0.0.1/32");
    }
    "Check IPv6 with Options"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv6],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.FORBIDDEN
        }), "1200:0000:AB00:1234:0000:2552:7777:1313")())
            .eql("1200:0000:AB00:1234:0000:2552:7777:1313");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv6],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "1200:0000:AB00:1234:0000:2552:7777:1313/128")())
            .eql("1200:0000:AB00:1234:0000:2552:7777:1313/128");
    }
    "Check Invalid IPv4 with Options"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv4],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.FORBIDDEN
        }), "127.0.0.1/32")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv4],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "127.0.0.1")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv4],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
    }
    "Check Invalid IPv6 with Options"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv6],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.FORBIDDEN
        }), "1200:0000:AB00:1234:0000:2552:7777:1313/128")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv6],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip({
            version: [SZValidator_1.StringSchemaIPRuleOptionsIPVersion.IPv6],
            cidr: SZValidator_1.StringSchemaIPRuleOptionsCIDR.REQUIRED
        }), "127.0.0.1")).to.throw();
    }
    "Check Invalid IP"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().ip(), "test")).to.throw();
    }
    "Check Base64 String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().base64(), "aGVsbG9fd29ybGQK")())
            .eql("aGVsbG9fd29ybGQK");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().base64(), "hello_world")).to.throw();
    }
    "Check Hex String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().hex(), "deadbeef")()).eql("deadbeef");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().hex(), "hello_world")).to.throw();
    }
    "Check Hostname String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().hostname(), "skylaker-01")()).eql("skylaker-01");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().hostname(), "99 well this isnt good")).to.throw();
    }
    "Check Token String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().token(), "hello_world_99")()).eql("hello_world_99");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().token(), "99 well this isnt good")).to.throw();
    }
    "Check Alphanum String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().alphanum(), "helloWorld99")()).eql("helloWorld99");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().alphanum(), "99 well this isnt good")).to.throw();
    }
    "Check GUID/UUID String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().guid(), "8c2be51e-1e0f-11e8-8ceb-473afd2b9ea7")())
            .eql("8c2be51e-1e0f-11e8-8ceb-473afd2b9ea7");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().guid(), "99 well this isnt good")).to.throw();
    }
    "Check Uppercase with convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().uppercase(), "hello_world")()).eql("HELLO_WORLD");
    }
    "Check Uppercase with no convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).uppercase(), "HELLO_WORLD")()).eql("HELLO_WORLD");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).uppercase(), "hello_world")).to.throw();
    }
    "Check Lowercase with convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().lowercase(), "HELLO_WORLD")()).eql("hello_world");
    }
    "Check Lowercase with no convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).lowercase(), "hello_world")()).eql("hello_world");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).lowercase(), "HELLO_WORLD")).to.throw();
    }
    "Check Trim with convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().trim(), "    hello_world      ")()).eql("hello_world");
    }
    "Check Trim with no convert"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).trim(), "hello_world")()).eql("hello_world");
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().options({ convert: false }).trim(), "     hello_world      ")).to.throw();
    }
    "Check Replace"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().replace(/world/, "bool"), "hello_world")()).eql("hello_bool");
    }
    "Check Replace Multiple"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().replace(/world/g, "bool"), "hello_world_world_world")())
            .eql("hello_bool_bool_bool");
    }
    "Check Replace String"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().replace("world", "bool"), "hello_world")()).eql("hello_bool");
    }
    "Check Replace String Multiple"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.string().required().replace("world", "bool"), "hello_world_world_world")())
            .eql("hello_bool_bool_bool");
    }
    "Large String Test"() {
        const schema = SZValidator_1.SZSchemaBuilder.string().required().trim().replace("world", "bool").regex(/^[A-Za-z0-9_]+$/).min(1).max(7).truncate().uppercase();
        const val = makeValidator(schema, "    hello_world_world_world     ");
        chai_1.expect(val())
            .eql("HELLO_B");
    }
};
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: null", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: undefined", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: number", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: object", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: Date", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Values: Array", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Standard String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Allow Null", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid Insensitive", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid MinLength", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid MinLength", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid MaxLength", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid MaxLength", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid MaxLength with Truncate", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Valid Regex", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Regex", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Inverted Regex", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid Inverted Regex", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Any IPv4", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid IPv4", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Any IPv6", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid IPv6", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check IPv4 with Options", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check IPv6 with Options", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid IPv4 with Options", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid IPv6 with Options", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Invalid IP", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Base64 String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Hex String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Hostname String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Token String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Alphanum String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check GUID/UUID String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Uppercase with convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Uppercase with no convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Lowercase with convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Lowercase with no convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Trim with convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Trim with no convert", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Replace", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Replace Multiple", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Replace String", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Check Replace String Multiple", null);
__decorate([
    test
], SZStringSchemaTests.prototype, "Large String Test", null);
SZStringSchemaTests = __decorate([
    suite
], SZStringSchemaTests);
//# sourceMappingURL=StringSchema.js.map