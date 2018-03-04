"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSchema_1 = require("./BaseSchema");
const assert = require("assert");
const AnySchema_1 = require("./AnySchema");
const Array_1 = require("../JSONSchema/Array");
const lodash_1 = require("lodash");
const SchemaError_1 = require("../SchemaError");
class ArrayItemSchemaMissing extends Error {
    constructor() {
        super(`No array item schema has been specified.`);
        this.name = "ArrayItemSchemaMissing";
    }
}
exports.ArrayItemSchemaMissing = ArrayItemSchemaMissing;
class ArraySchema extends AnySchema_1.AnySchema {
    constructor() {
        super(BaseSchema_1.SZSchemaTypes.Array);
        this._sparseMode = false;
        this._singleMode = false;
        this._itemSchemas = [];
        this._ordered = [];
        this.internalJSONSchema = new Array_1.SZArray();
    }
    sparse(sparseModeOn) {
        if (sparseModeOn === false) {
            this._sparseMode = false;
        }
        else {
            this._sparseMode = true;
        }
        return this;
    }
    single(singleModeOn) {
        if (singleModeOn === false) {
            this._singleMode = false;
        }
        else {
            this._singleMode = true;
        }
        return this;
    }
    items(...itemSchemas) {
        assert(Array.isArray(itemSchemas) && itemSchemas.length >= 1, `No schemas were passed with which to validate array items`);
        if (this._itemSchemas.length > 0) {
            this._itemSchemas.push.apply(this._itemSchemas, itemSchemas);
        }
        else {
            this._itemSchemas = itemSchemas;
        }
        if (this._itemSchemas.length > 1) {
            this.internalJSONSchema.setItems.apply(this.internalJSONSchema, lodash_1.map(this._itemSchemas, "internalJSONSchema"));
        }
        else {
            this.internalJSONSchema.setItems(this._itemSchemas[0].internalJSONSchema);
        }
        return this;
    }
    ordered(...orderedSchemas) {
        if (orderedSchemas.length === 1) {
            this._ordered.push(orderedSchemas[0]);
            this.internalJSONSchema.setOrdered([orderedSchemas[0].internalJSONSchema]);
        }
        else {
            this._ordered.push.apply(this._ordered, orderedSchemas);
            this.internalJSONSchema.setOrdered(lodash_1.map(orderedSchemas, "internalJSONSchema"));
        }
        return this;
    }
    min(limit) {
        this.internalJSONSchema.setMinItems(limit);
        return this;
    }
    max(limit) {
        this.internalJSONSchema.setMaxItems(limit);
        return this;
    }
    length(limit) {
        this.internalJSONSchema.setLength(limit);
        return this;
    }
    unique(comparator) {
        this.internalJSONSchema.setUniqueItems(true);
        if (typeof comparator === "function") {
            this._comparatorFunction = comparator;
        }
        else if (typeof comparator === "string") {
            this._comparatorKey = comparator;
        }
        return this;
    }
    itemValidate(value) {
        if (this._itemSchemas && Array.isArray(this._itemSchemas) && this._itemSchemas.length > 0) {
            let itemSchema = null;
            const itemSchemaLen = this._itemSchemas.length;
            let errorStack = [];
            for (let itemSchemaIndex = 0; itemSchemaIndex < itemSchemaLen; itemSchemaIndex++) {
                itemSchema = this._itemSchemas[itemSchemaIndex];
                try {
                    return itemSchema.validate(value);
                }
                catch (ex) {
                    errorStack.push(ex);
                }
            }
            throw errorStack;
        }
        throw new ArrayItemSchemaMissing();
    }
    validate(value) {
        let valStack = AnySchema_1.AnySchema.preValidate(this, value);
        if (valStack.immediate)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        valStack = AnySchema_1.AnySchema.checkInvalid(this, valStack);
        //check valids
        valStack = AnySchema_1.AnySchema.checkValid(this, valStack);
        if (valStack.immediate === true)
            return AnySchema_1.AnySchema.postValidate(this, valStack.value, value);
        const valIsArray = Array.isArray(valStack.value);
        const valIsNullOrUndefined = (valStack.value === null || valStack.value === undefined);
        if (!valIsNullOrUndefined && !valIsArray && !this._singleMode) {
            throw new SchemaError_1.SchemaValidationFailedError(`Value passed wasn't an array and single mode isn't enabled.`);
        }
        else if (valIsNullOrUndefined && this.internalJSONSchema._requiredFlag === true && !this._sparseMode) {
            throw new SchemaError_1.SchemaValidationFailedError(`Value is required.`);
        }
        else if (!valIsArray && this._singleMode) {
            if (this._ordered.length > 0 && this._ordered[0] instanceof AnySchema_1.AnySchema) {
                return AnySchema_1.AnySchema.postValidate(this, [this._ordered[0].validate(valStack.value)], value);
            }
            return AnySchema_1.AnySchema.postValidate(this, [this.itemValidate(valStack.value)], value);
        }
        else if (valIsArray && value.length === 0 && !this._sparseMode) {
            throw new SchemaError_1.SchemaValidationFailedError(`Value passed is an empty array and sparse mode isn't enabled.`);
        }
        else if (valIsArray && value.length === 0) {
            return [];
        }
        else if (valIsArray) {
            let validationErrors = new SchemaError_1.SchemaValidationErrors(this);
            let orderedMode = (this._ordered.length > 0);
            let validatedArray = [];
            const self = this;
            valStack.value.forEach((item, index) => {
                try {
                    if (orderedMode && self._ordered[index] && self._ordered[index] instanceof AnySchema_1.AnySchema) {
                        try {
                            validatedArray.push(self._ordered[index].validate(item));
                        }
                        catch (innerEx) {
                            innerEx.message = `Error with ordered validation requirement: ${innerEx.message}`;
                            validationErrors.setIndexError(index, innerEx, item);
                        }
                    }
                    else {
                        validatedArray.push(self.itemValidate(item));
                    }
                }
                catch (ex) {
                    if (ex.name === "ArrayItemSchemaMissing")
                        throw ex;
                    ex.message = `Error with array item validation: ${ex.message}`;
                    validationErrors.setIndexError(index, ex, item);
                }
            });
            if (validationErrors.itemErrors.length > 0) {
                validationErrors.message = `[${validationErrors.itemErrors.length}] ArraySchema Validation Errors`;
                throw validationErrors;
            }
            return AnySchema_1.AnySchema.postValidate(this, validatedArray, value);
        }
        throw new SchemaError_1.SchemaValidationFailedError(`Value passed is not valid for ArraySchema validation.`);
    }
}
exports.ArraySchema = ArraySchema;
//# sourceMappingURL=ArraySchema.js.map