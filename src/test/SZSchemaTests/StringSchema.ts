// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />


let colors = require('mocha/lib/reporters/base').colors;
colors['diff gutter'] = 92;
colors['diff added'] = 32;
colors['diff removed'] = 31;
colors['error stack'] = 92;
colors.progress = 92;
colors.runway = 92;
colors.fast = 92;
colors.pass = 92;
import * as Promise from "bluebird";
import { assert, expect,  } from "chai";
import {AnySchema, ArraySchema, BooleanSchema, SZSchemaBuilder, StringSchemaIPRuleOptionsCIDR,
  StringSchemaIPRuleOptionsIPVersion, StringSchema } from "../../SZValidator";

const stringSchema = SZSchemaBuilder.string().required();
const validateValueFunc = function () {
  stringSchema.validate(this);
};

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}

@suite class SZStringSchemaTests  {

  @test "Check Invalid Values: null"() {
    expect(validateValueFunc.bind(null)).to.throw();
  }
  @test "Check Invalid Values: undefined"() {
    expect(validateValueFunc.bind(undefined)).to.throw();
  }
  @test "Check Invalid Values: number"() {
    expect(validateValueFunc.bind(1)).to.throw();
  }
  @test "Check Invalid Values: object"() {
    expect(validateValueFunc.bind({})).to.throw();
  }
  @test "Check Invalid Values: Date"() {
    expect(validateValueFunc.bind(new Date())).to.throw();
  }
  @test "Check Invalid Values: Array"() {
    expect(validateValueFunc.bind([])).to.throw();
  }

  @test "Check Standard String"() {
    expect(makeValidator(SZSchemaBuilder.string().required(), "hello_world")()).eql("hello_world");
  }

  @test "Check Allow Null"() {
    expect(makeValidator(SZSchemaBuilder.string().required().allowNull(), null)()).eql(null);
  }
  @test "Check Valid"() {
    expect(makeValidator(SZSchemaBuilder.string().required().valid("TEST"), "TEST")()).eql("TEST");
  }
  @test "Check Valid Insensitive"() {
    expect(makeValidator(SZSchemaBuilder.string().required().insensitive().valid("TEST").regex(/^[^a-zA-Z0-9]+/), "test")())
      .eql("test");
  }

  @test "Check Valid MinLength"() {
    expect(makeValidator(SZSchemaBuilder.string().required().min(2), "test")()).eql("test");
  }
  @test "Check Invalid MinLength"() {
    expect(makeValidator(SZSchemaBuilder.string().required().min(10), "test")).to.throw();
  }

  @test "Check Valid MaxLength"() {
    expect(makeValidator(SZSchemaBuilder.string().required().max(10), "test")()).eql("test");
  }
  @test "Check Invalid MaxLength"() {
    expect(makeValidator(SZSchemaBuilder.string().required().max(2), "test")).to.throw();
  }


  @test "Check Valid MaxLength with Truncate"() {
    expect(makeValidator(SZSchemaBuilder.string().required().max(4).truncate(), "hello_world")()).eql("hell");
  }


  @test "Check Valid Regex"() {
    expect(makeValidator(SZSchemaBuilder.string().required().regex(/^testing_string$/), "testing_string")())
      .eql("testing_string");
  }
  @test "Check Invalid Regex"() {
    expect(makeValidator(SZSchemaBuilder.string().required().regex(/^testing_string$/), "test")).to.throw();
  }
  @test "Check Inverted Regex"() {
    expect(makeValidator(SZSchemaBuilder.string().required().regex(/^testing_string$/, {invert: true}), "test")())
      .eql("test");
  }
  @test "Check Invalid Inverted Regex"() {
    expect(makeValidator(SZSchemaBuilder.string().required().regex(/^testing_string$/, {invert: true}), "testing_string"))
      .to.throw();
  }


  @test "Check Any IPv4"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "127.0.0.1")).to.not.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "127.0.0.1/32")).to.not.throw();
  }
  @test "Check Invalid IPv4"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "255.255.255.256")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "127.0.0.1/0")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "127.0.0.1/33")).to.throw();
  }
  @test "Check Any IPv6"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.not.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/128")).to.not.throw();
  }
  @test "Check Invalid IPv6"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "GGGG:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/0")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "1200:0000:AB00:1234:0000:2552:7777:1313/129")).to.throw();
  }
  @test "Check IPv4 with Options"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv4],
      cidr: StringSchemaIPRuleOptionsCIDR.FORBIDDEN
    }), "127.0.0.1")()).eql("127.0.0.1");
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv4],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "127.0.0.1/32")()).eql("127.0.0.1/32");
  }
  @test "Check IPv6 with Options"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv6],
      cidr: StringSchemaIPRuleOptionsCIDR.FORBIDDEN
    }), "1200:0000:AB00:1234:0000:2552:7777:1313")())
      .eql("1200:0000:AB00:1234:0000:2552:7777:1313");
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv6],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "1200:0000:AB00:1234:0000:2552:7777:1313/128")())
      .eql("1200:0000:AB00:1234:0000:2552:7777:1313/128");
  }
  @test "Check Invalid IPv4 with Options"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv4],
      cidr: StringSchemaIPRuleOptionsCIDR.FORBIDDEN
    }), "127.0.0.1/32")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv4],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "127.0.0.1")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv4],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
  }
  @test "Check Invalid IPv6 with Options"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv6],
      cidr: StringSchemaIPRuleOptionsCIDR.FORBIDDEN
    }), "1200:0000:AB00:1234:0000:2552:7777:1313/128")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv6],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "1200:0000:AB00:1234:0000:2552:7777:1313")).to.throw();
    expect(makeValidator(SZSchemaBuilder.string().required().ip({
      version : [StringSchemaIPRuleOptionsIPVersion.IPv6],
      cidr: StringSchemaIPRuleOptionsCIDR.REQUIRED
    }), "127.0.0.1")).to.throw();
  }
  @test "Check Invalid IP"() {
    expect(makeValidator(SZSchemaBuilder.string().required().ip(), "test")).to.throw();
  }

  @test "Check Base64 String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().base64(), "aGVsbG9fd29ybGQK")())
      .eql("aGVsbG9fd29ybGQK");
    expect(makeValidator(SZSchemaBuilder.string().required().base64(), "hello_world")).to.throw();
  }
  @test "Check Hex String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().hex(), "deadbeef")()).eql("deadbeef");
    expect(makeValidator(SZSchemaBuilder.string().required().hex(), "hello_world")).to.throw();
  }
  @test "Check Hostname String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().hostname(), "skylaker-01")()).eql("skylaker-01");
    expect(makeValidator(SZSchemaBuilder.string().required().hostname(), "99 well this isnt good")).to.throw();
  }
  @test "Check Token String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().token(), "hello_world_99")()).eql("hello_world_99");
    expect(makeValidator(SZSchemaBuilder.string().required().token(), "99 well this isnt good")).to.throw();
  }
  @test "Check Alphanum String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().alphanum(), "helloWorld99")()).eql("helloWorld99");
    expect(makeValidator(SZSchemaBuilder.string().required().alphanum(), "99 well this isnt good")).to.throw();
  }
  @test "Check GUID/UUID String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().guid(), "8c2be51e-1e0f-11e8-8ceb-473afd2b9ea7")())
      .eql("8c2be51e-1e0f-11e8-8ceb-473afd2b9ea7");
    expect(makeValidator(SZSchemaBuilder.string().required().guid(), "99 well this isnt good")).to.throw();
  }
  @test "Check Uppercase with convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().uppercase(), "hello_world")()).eql("HELLO_WORLD");
  }
  @test "Check Uppercase with no convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).uppercase(), "HELLO_WORLD")()).eql("HELLO_WORLD");
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).uppercase(), "hello_world")).to.throw();
  }
  @test "Check Lowercase with convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().lowercase(), "HELLO_WORLD")()).eql("hello_world");
  }
  @test "Check Lowercase with no convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).lowercase(), "hello_world")()).eql("hello_world");
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).lowercase(), "HELLO_WORLD")).to.throw();
  }
  @test "Check Trim with convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().trim(), "    hello_world      ")()).eql("hello_world");
  }
  @test "Check Trim with no convert"() {
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).trim(), "hello_world")()).eql("hello_world");
    expect(makeValidator(SZSchemaBuilder.string().required().options({convert: false}).trim(), "     hello_world      ")).to.throw();
  }
  @test "Check Replace"() {
    expect(makeValidator(SZSchemaBuilder.string().required().replace(/world/, "bool"), "hello_world")()).eql("hello_bool");
  }
  @test "Check Replace Multiple"() {
    expect(makeValidator(SZSchemaBuilder.string().required().replace(/world/g, "bool"), "hello_world_world_world")())
      .eql("hello_bool_bool_bool");
  }
  @test "Check Replace String"() {
    expect(makeValidator(SZSchemaBuilder.string().required().replace("world", "bool"), "hello_world")()).eql("hello_bool");
  }
  @test "Check Replace String Multiple"() {
    expect(makeValidator(SZSchemaBuilder.string().required().replace("world", "bool"), "hello_world_world_world")())
      .eql("hello_bool_bool_bool");
  }
  @test "Large String Test"() {
    const schema = SZSchemaBuilder.string().required().trim().replace("world", "bool").regex(/^[A-Za-z0-9_]+$/).min(1).max(7).truncate().uppercase();

    const val = makeValidator(schema, "    hello_world_world_world     ");

    expect(val())
      .eql("HELLO_B");
  }

}
