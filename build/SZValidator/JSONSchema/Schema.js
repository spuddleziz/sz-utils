"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
const assert = require("assert");
const lodash_1 = require("lodash");
class Schema {
    constructor(typeOrTypes) {
        this._validValues = [];
        this._children = [];
        this._notAllowed = false;
        if (typeOrTypes) {
            this._type = typeOrTypes;
        }
    }
    setTitle(title) {
        assert(title && typeof title === "string", `title wasn't supplied or wasn't a string`);
        this.title = title;
    }
    setDescription(description) {
        assert(description && typeof description === "string", `description wasn't supplied or wasn't a string`);
        this.description = description;
    }
    setExamples(examples, clearExisting) {
        if (examples === undefined || examples === null)
            return;
        if (Array.isArray(examples) && !Array.isArray(this._type) && this._type !== Types_1.Types.array) {
            if (this.examples && !clearExisting) {
                this.examples.push.apply(this.examples, examples);
                delete this.example;
            }
            else if (this.example && !clearExisting) {
                this.examples.push.apply(this.examples, [this.example].concat(examples));
                delete this.example;
            }
            else {
                this.examples = examples;
                delete this.example;
            }
        }
        else if (!Array.isArray(this._type) && this._type === Types_1.Types.array && Array.isArray(examples)) {
            if (this.examples && !clearExisting) {
                this.examples.push(examples);
                delete this.example;
            }
            else if (this.example && !clearExisting) {
                this.examples = [this.example].concat(examples);
                delete this.example;
            }
            else {
                this.example = examples;
                delete this.examples;
            }
        }
        else {
            if (this.examples && !clearExisting) {
                this.examples.push(examples);
                delete this.example;
            }
            else if (this.example && !clearExisting) {
                this.examples = [this.example, examples];
                delete this.example;
            }
            else {
                this.example = examples;
                delete this.examples;
            }
        }
    }
    setDefault(defaultVar) {
        if (defaultVar !== undefined && defaultVar !== null) {
            this.default = defaultVar;
        }
    }
    setValids(validVaues) {
        assert(Array.isArray(validVaues), `valid values cannot be set as an array of valid values wasn't passed.`);
        this._validValues = validVaues;
    }
    addChild(childSchemaToAdd) {
        this._children.push(childSchemaToAdd);
    }
    setRequired(isRequired) {
        if (isRequired === false) {
            this._requiredFlag = false;
        }
        else {
            this._requiredFlag = true;
        }
    }
    setForbidden(isForbidden) {
        if (isForbidden === false) {
            this._forbiddenFlag = false;
        }
        else {
            this._forbiddenFlag = true;
        }
    }
    setStrip(isStripped) {
        if (isStripped === false) {
            this._stripFlag = false;
        }
        else {
            this._stripFlag = true;
        }
    }
    static toJSON(schemaObj, inSchema) {
        let outSchema = (typeof inSchema === "object" ? lodash_1.clone(inSchema) : {});
        if (schemaObj._type) {
            outSchema.type = schemaObj._type;
        }
        let thisItem = null;
        for (let itemKey in schemaObj) {
            if (itemKey[0] !== "_" && schemaObj.hasOwnProperty(itemKey) && !outSchema.hasOwnProperty(itemKey)) {
                thisItem = schemaObj[itemKey];
                if (thisItem !== null && thisItem !== undefined) {
                    outSchema[itemKey] = thisItem;
                }
            }
        }
        if (schemaObj.title) {
            outSchema.title = schemaObj.title;
        }
        if (schemaObj.description) {
            outSchema.description = schemaObj.description;
        }
        if (schemaObj.default) {
            outSchema.default = schemaObj.default;
        }
        if (schemaObj.example) {
            outSchema.example = schemaObj.example;
        }
        else if (schemaObj.examples) {
            outSchema.examples = schemaObj.examples;
        }
        if (schemaObj._validValues && Array.isArray(schemaObj._validValues) && schemaObj._validValues.length > 0) {
            if (Array.isArray(schemaObj._children)) {
                return {
                    '------oneOf': [
                        {
                            'type': outSchema.type,
                            'enum': schemaObj._validValues
                        },
                        outSchema
                    ]
                };
            }
            outSchema.enum = schemaObj._validValues;
        }
        return outSchema;
    }
    toJSON() {
        return Schema.toJSON(this);
    }
    compile() {
    }
    validate(value) {
        return true;
    }
}
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map