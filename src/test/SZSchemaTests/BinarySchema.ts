// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />


import * as moment from "moment";

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
import {BinarySchemaEncodingOption} from "../../SZValidator/SZSchemas/BinarySchema";

function makeValidator(schema:AnySchema, value:any) {

  return function (value) {

    return this.validate(value);

  }.bind(schema, value);

}

function unicodeStringToTypedArray(s):any {
  let escstr = encodeURIComponent(s);
  let binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(<any>'0x' + p1);
  });
  let ua = new Uint8Array(binstr.length);
  Array.prototype.forEach.call(binstr, function (ch, i) {
    ua[i] = ch.charCodeAt(0);
  });
  return ua;
}


@suite class SZBinarySchemaTests {

  @test "Check BinarySchema will accept a buffer object"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary(), buff)()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will accept a string"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary(), "hello")()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will accept a string in a different encoding"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary().encoding(BinarySchemaEncodingOption.BASE64), buff.toString("base64"))()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will accept a UInt8Array"() {
    let buff = Buffer.from(unicodeStringToTypedArray("hello"));
    expect(makeValidator(SZSchemaBuilder.binary(), buff)()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will allow buffer sizes less than the maximum limit"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary().max(8), buff)()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will reject buffer sizes larger than the maximum limit"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary().max(4), buff)).to.throw();
  }

  @test "Check BinarySchema will allow buffer sizes more than the minimum limit"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary().min(4), buff)()).satisfy((bin:Buffer) => {

      return buff.equals(bin);

    });
  }

  @test "Check BinarySchema will reject buffer sizes less than the minimum limit"() {
    let buff = Buffer.from("hello", "utf8");
    expect(makeValidator(SZSchemaBuilder.binary().min(8), buff)).to.throw();
  }

}
