"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchemaValidationFailedError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "SchemaValidationFailedError";
    }
}
exports.SchemaValidationFailedError = SchemaValidationFailedError;
class SchemaValidationErrorItem {
    constructor(itemSchema, originalError) {
        this.message = `Validation Error: Schema: ${itemSchema.schemaType} |> ${originalError.message}`;
        this.originalError = originalError;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    setIndex(index) {
        this.index = index;
        return this;
    }
    setValue(value) {
        if (value !== null || value !== undefined) {
            this.value = value;
        }
        return this;
    }
    setError(error) {
        this.originalError = error;
    }
}
exports.SchemaValidationErrorItem = SchemaValidationErrorItem;
class SchemaValidationErrors {
    constructor(inSchema) {
        this.itemErrors = [];
        this.message = `Errors were encountered while validating schema of type: ${inSchema.schemaType}`;
        this.name = "SchemaValidationErrors";
        this.schema = inSchema;
    }
    setValue(value) {
        if (!this.thisError) {
            this.thisError = new SchemaValidationErrorItem(this.schema, new Error());
        }
        this.thisError.setValue(value);
        return this;
    }
    setError(originalError) {
        if (!this.thisError) {
            this.thisError = new SchemaValidationErrorItem(this.schema, originalError);
        }
        else {
            this.thisError.setError(originalError);
        }
        return this;
    }
    setKeyError(key, originalError, value) {
        this.itemErrors.push(new SchemaValidationErrorItem(this.schema, originalError).setValue(value).setKey(key));
        return this;
    }
    setIndexError(index, originalError, value) {
        this.itemErrors.push(new SchemaValidationErrorItem(this.schema, originalError).setValue(value).setIndex(index));
        return this;
    }
    makeError() {
        if (this.thisError && (!this.itemErrors || this.itemErrors.length === 0)) {
            if (this.thisError instanceof Error) {
                return new WrappedSchemaValidationError(this.thisError);
            }
            else if (this.thisError instanceof SchemaValidationErrorItem) {
                this.name = "SchemaValidationErrorItem";
                this.message = this.thisError.message;
            }
        }
        else if (this.itemErrors.length > 0) {
            this.message += `Error List: ${JSON.stringify(this.itemErrors, null, "  ")}`;
        }
        return new WrappedSchemaValidationErrors(this.name, this.message);
    }
}
exports.SchemaValidationErrors = SchemaValidationErrors;
class WrappedSchemaValidationErrors extends Error {
    constructor(name, msg) {
        super(msg);
    }
}
exports.WrappedSchemaValidationErrors = WrappedSchemaValidationErrors;
class WrappedSchemaValidationError extends Error {
    constructor(error) {
        super(error.message);
        if (error.name) {
            this.name = error.name;
        }
        else {
            this.name = "WrappedSchemaValidationError";
        }
        if (error.stack) {
            this.stack = error.stack;
        }
    }
}
exports.WrappedSchemaValidationError = WrappedSchemaValidationError;
//# sourceMappingURL=SchemaError.js.map