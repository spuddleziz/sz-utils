// Reference mocha-typescript's global definitions:
/// <reference path="../../node_modules/mocha-typescript/globals.d.ts" />


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
import { P } from "../SZPromise";
import {SZSchemaBuilder} from "../SZValidator";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised"

before(() => {
  chai.use(chaiAsPromised);
  chai.should();
});

@suite class SZPromiseTestSuite {

  @test "SZPromise: isNotNull failure"() {

    return P.begin(null)
      .isNotNull()
      .should.eventually.be.rejected;

  }

  @test "SZPromise: isNotUndefined failure"() {

    return P.begin(undefined)
      .isNotUndefined()
      .should.eventually.be.rejected;

  }

  @test "SZPromise: isNotFalse failure"() {

    return P.begin(false)
      .isNotFalse()
      .should.eventually.be.rejected;

  }

  @test "SZPromise: isNotFalsey failure"() {

    return P.begin(false)
      .isNotFalse()
      .should.eventually.be.rejected;

  }

  @test "SZPromise: isArray failure"() {

    return P.begin(false)
      .isArray()
      .should.eventually.be.rejected;

  }

  @test "SZPromise: parseJSON"() {

    let test_obj = { test_object : "one" };

    return P.begin(JSON.stringify(test_obj))
      .parseJSON()
      .then((data:any) => {

      return chai.expect(data).to.eql(test_obj);

    });

  }

  @test "SZPromise: validateJSON"() {

    let test_obj = { test_object : "one" };

    return P.begin(JSON.stringify(test_obj))
      .validateJSON(SZSchemaBuilder.object({ test_object : SZSchemaBuilder.string() }))
      .then((data:any) => {

      return chai.expect(data).to.eql(test_obj);

    });

  }

  @test "SZPromise: validateData"() {

    let test_obj = { test_object : "one" };

    return P.begin(test_obj)
      .validateData(SZSchemaBuilder.object({ test_object : SZSchemaBuilder.string() }))
      .then((data:any) => {

        return chai.expect(data).to.eql(test_obj);

      });

  }

  @test "SZPromise: validateData failure"() {

    let test_obj = { test_object : "one", another_obj : "woop" };

    return P.begin<object>(test_obj)
      .validateData(SZSchemaBuilder.object({ test_object : SZSchemaBuilder.string() }).unknown(false))
      .should.eventually.be.rejected;

  }

  @test(slow(20000), timeout(40000)) "SZPromise: promiseWhile"() {

    let count = 0;

    return P.begin(true)
      .promiseWhile((response) => {

        return response < 10;

      }, () => {

        return P.resolve(++count);

      }).should.eventually.be.fulfilled;

  }

  @test(slow(20000), timeout(40000)) "SZPromise: promiseWhile timeout"() {

    let count = 0;

    return P.begin(true)
      .promiseWhileLimit({ fullTimeout : 5000 }, (response) => {

        return response < 50;

      }, () => {

        return P.resolve(++count);

      }).should.eventually.be.rejected;

  }

  @test(slow(20000), timeout(40000)) "SZPromise: promiseWhile retry count exceeded"() {

    let count = 0;

    return P.begin(true)
      .promiseWhileLimit({ retryCount : 4 }, (response) => {

        return response < 50;

      }, () => {

        return P.resolve(++count);

      }).should.eventually.be.rejected;

  }

}
