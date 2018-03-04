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
const objectSchema = SZValidator_1.SZSchemaBuilder.object().required();
const validateValueFunc = function () {
    return objectSchema.validate(this);
};
function makeValidator(schema, value) {
    return function (value) {
        return this.validate(value);
    }.bind(schema, value);
}
class TestType {
    constructor() {
        this.testing = "hello";
    }
}
let SZObjectSchemaTests = class SZObjectSchemaTests {
    "Check ObjectSchema will accept single property"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required()
        }), {
            test: "hello"
        })()).eql({
            test: "hello"
        });
    }
    "Check ObjectSchema will accept multiple properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required())
        }), {
            test: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will accept patterned properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required().strip(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required())
        }).pattern(/^vann:[A-Za-z0-9_\-]+$/, SZValidator_1.SZSchemaBuilder.string().strip()), {
            test: "hello",
            another: ["hello", "world"],
            "vann:test99": "wow"
        })()).eql({
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject forbidden properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required().strip(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required())
        }).pattern(/^vann:[A-Za-z0-9_\-]+$/, SZValidator_1.SZSchemaBuilder.string().strip()).forbiddenKeys("hello_world"), {
            test: "hello",
            hello_world: true,
            another: ["hello", "world"],
            "vann:test99": "wow"
        })).to.throw();
    }
    "Check ObjectSchema will confirm and properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string().required()
        }).and("test", "another", "foobar"), {
            test: "hello",
            another: ["hello", "world"],
            foobar: "hello"
        })()).eql({
            test: "hello",
            another: ["hello", "world"],
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject missing and properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string().required()
        }).and("test", "another", "foobar"), {
            test: "hello",
            foobar: "hello"
        })).to.throw();
    }
    "Check ObjectSchema will confirm or required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string().required()
        }).or("test", "another"), {
            test: "hello",
            foobar: "hello"
        })()).eql({
            test: "hello",
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject missing or required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).or("test", "another"), {
            foobar: "hello"
        })).to.throw();
    }
    "Check ObjectSchema will confirm xor required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).xor("test", "another"), {
            test: "hello",
            foobar: "hello",
        })()).eql({
            test: "hello",
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject missing xor required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).xor("test", "another"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will confirm nand required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).nand("test", "another"), {
            test: "hello",
            foobar: "hello",
        })()).eql({
            test: "hello",
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject nand required type properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).nand("test", "another"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will confirm required properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).requiredKeys("test", "another"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject required properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).requiredKeys("test", "another"), {
            test: "hello",
            foobar: "hello"
        })).to.throw();
    }
    "Check ObjectSchema will allow unknown properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).unknown(true), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"],
            what: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"],
            what: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject unknown properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"],
            what: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will require a minimum number of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).min(2), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject a minimum number of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).min(2), {
            test: "hello"
        })).to.throw();
    }
    "Check ObjectSchema will require a maximum number of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).max(2), {
            test: "hello",
            foobar: "hello"
        })()).eql({
            test: "hello",
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject a maximum number of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).max(2), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will require an exact length of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).length(2), {
            test: "hello",
            foobar: "hello"
        })()).eql({
            test: "hello",
            foobar: "hello"
        });
    }
    "Check ObjectSchema will reject an incorrect number of properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).length(2), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will rename a key/property"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            hello: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject renaming a key/property when it already exists"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string(),
            hello: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello"), {
            test: "hello2",
            foobar: "hello",
            another: ["hello", "world"],
            hello: "hello2"
        })).to.throw();
    }
    "Check ObjectSchema will rename a key/property if it already exists and override is enabled"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string(),
            hello: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { override: true }), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"],
            hello: "hello2"
        })()).eql({
            test: "hello",
            hello: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will rename a key/property multiple times"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { multiple: true }).rename("test", "hello", { multiple: true }), {
            test: "hello2",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            hello: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject renaming a key/property multiple times when no options are passed"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello").rename("test", "hello"), {
            test: "hello2",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will rename a key/property but ignore undefined values"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { ignoreUndefined: true }), {
            test: "hello2",
            foobar: undefined,
            another: ["hello", "world"]
        })()).eql({
            test: "hello2",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will rename a key/property but ignore undefined values however this will set undefined on the from key"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { ignoreUndefined: true, setUndefinedOnFromKey: true }), {
            test: "hello2",
            foobar: undefined,
            another: ["hello", "world"]
        })()).eql({
            test: "hello2",
            foobar: undefined,
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will rename a key/property and alias the value back to the original key"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { alias: true }), {
            test: "hello2",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            hello: "hello",
            foobar: "hello",
            test: "hello2",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will rename a key/property with undefined value and alias the value back to the original key"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { alias: true }), {
            test: "hello2",
            foobar: undefined,
            another: ["hello", "world"]
        })()).eql({
            hello: undefined,
            foobar: undefined,
            test: "hello2",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will rename a key/property and set the original key to undefined"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).rename("foobar", "hello", { setUndefinedOnFromKey: true }), {
            test: "hello2",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            hello: "hello",
            foobar: undefined,
            test: "hello2",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will require 'with' properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).with("test", "foobar", "another"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject missing 'with' properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).with("test", "foobar", "another"), {
            test: "hello",
            foobar: "hello"
        })).to.throw();
    }
    "Check ObjectSchema will ensure there are no 'without' properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).without("test", "foobar", "another"), {
            test: "hello"
        })()).eql({
            test: "hello"
        });
    }
    "Check ObjectSchema will reject when there are 'without' properties"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).without("test", "foobar", "another"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will ensure that properties/keys with reference based assertions succeed"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).assert("test", "foobar"), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will ensure that properties/keys with schema based assertions succeed"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).assert("test", SZValidator_1.SZSchemaBuilder.string().regex(/^hello$/)), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will ensure that properties/keys with reference based assertions and non equal values will reject"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).assert("test", "foobar"), {
            test: "hello",
            foobar: "hello2",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will ensure that properties/keys with schema based assertions and non equal values will reject"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).assert("test", SZValidator_1.SZSchemaBuilder.string().regex(/^hello2$/)), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will validate schemas itself"() {
        let schema = SZValidator_1.SZSchemaBuilder.string();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object().schema(), schema)()).eql(schema);
    }
    "Check ObjectSchema will reject schemas if schema mode isn't enabled"() {
        let schema = SZValidator_1.SZSchemaBuilder.string();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object(), schema)).to.throw();
    }
    "Check ObjectSchema will validate javascript classes/objects"() {
        let tempObj = new TestType();
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object().type(TestType), tempObj)()).eql({ testing: "hello" });
    }
    "Check ObjectSchema will reject invalid javascript classes/objects"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object().type(TestType), new Date())).to.throw();
    }
    "Check ObjectSchema will allow valid objects"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).valid({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        }), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject invalid objects"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).invalid({
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        }), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Check ObjectSchema will make keys optional after they may have been required"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).optionalKeys("test"), {
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will allow the extension of an existing schema"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            //test : SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).keys({
            hello_world: SZValidator_1.SZSchemaBuilder.string().required()
        }), {
            hello_world: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })()).eql({
            hello_world: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        });
    }
    "Check ObjectSchema will reject if an extension with required keys is added and the supplied value doesnt have the required key"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            //test : SZSchemaBuilder.string().required(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).keys({
            hello_world: SZValidator_1.SZSchemaBuilder.string().required()
        }), {
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
    "Large multi schema object test"() {
        chai_1.expect(makeValidator(SZValidator_1.SZSchemaBuilder.object({
            test: SZValidator_1.SZSchemaBuilder.string(),
            another: SZValidator_1.SZSchemaBuilder.array().items(SZValidator_1.SZSchemaBuilder.string().required()),
            foobar: SZValidator_1.SZSchemaBuilder.string()
        }).assert("test", SZValidator_1.SZSchemaBuilder.string().regex(/^hello2$/)), {
            test: "hello",
            foobar: "hello",
            another: ["hello", "world"]
        })).to.throw();
    }
};
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will accept single property", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will accept multiple properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will accept patterned properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject forbidden properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will confirm and properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject missing and properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will confirm or required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject missing or required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will confirm xor required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject missing xor required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will confirm nand required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject nand required type properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will confirm required properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject required properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will allow unknown properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject unknown properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will require a minimum number of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject a minimum number of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will require a maximum number of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject a maximum number of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will require an exact length of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject an incorrect number of properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject renaming a key/property when it already exists", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property if it already exists and override is enabled", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property multiple times", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject renaming a key/property multiple times when no options are passed", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property but ignore undefined values", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property but ignore undefined values however this will set undefined on the from key", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property and alias the value back to the original key", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property with undefined value and alias the value back to the original key", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will rename a key/property and set the original key to undefined", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will require 'with' properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject missing 'with' properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will ensure there are no 'without' properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject when there are 'without' properties", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will ensure that properties/keys with reference based assertions succeed", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will ensure that properties/keys with schema based assertions succeed", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will ensure that properties/keys with reference based assertions and non equal values will reject", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will ensure that properties/keys with schema based assertions and non equal values will reject", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will validate schemas itself", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject schemas if schema mode isn't enabled", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will validate javascript classes/objects", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject invalid javascript classes/objects", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will allow valid objects", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject invalid objects", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will make keys optional after they may have been required", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will allow the extension of an existing schema", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Check ObjectSchema will reject if an extension with required keys is added and the supplied value doesnt have the required key", null);
__decorate([
    test
], SZObjectSchemaTests.prototype, "Large multi schema object test", null);
SZObjectSchemaTests = __decorate([
    suite
], SZObjectSchemaTests);
//# sourceMappingURL=ObjectSchema.js.map