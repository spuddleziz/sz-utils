import {AnySchema} from "./SZSchemas/AnySchema";

export class SchemaValidationFailedError extends Error {

  constructor(msg) {

    super(msg);

    this.name = "SchemaValidationFailedError";

  }

}


export class SchemaValidationErrorItem {

  schema:AnySchema;
  originalError:Error;
  value:any;
  key:string;
  index:number;
  message:string;

  constructor(itemSchema:AnySchema, originalError:Error) {

    this.message = `Validation Error: Schema: ${itemSchema.schemaType} |> ${originalError.message}`;

    this.originalError = originalError;

  }

  setKey(key:string) {

    this.key = key;

    return this;

  }

  setIndex(index:number) {

    this.index = index;

    return this;

  }

  setValue(value:any) {

    if (value !== null || value !== undefined) {

      this.value = value;

    }

    return this;

  }

  setError(error:Error) {

    this.originalError = error;

  }

}



export class SchemaValidationErrors {

  value:any;
  thisError:SchemaValidationErrorItem;
  itemErrors:Array<SchemaValidationErrorItem> = [];
  schema:AnySchema;
  message:string;
  name:string;

  constructor(inSchema:AnySchema) {

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

  setError(originalError:Error) {

    if (!this.thisError) {

      this.thisError = new SchemaValidationErrorItem(this.schema, originalError)

    } else {

      this.thisError.setError(originalError);

    }

    return this;

  }

  public setKeyError(key:string, originalError:Error, value:any):this {

    this.itemErrors.push(new SchemaValidationErrorItem(this.schema, originalError).setValue(value).setKey(key));

    return this;

  }

  setIndexError(index:number, originalError:Error, value:any) {

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


export class WrappedSchemaValidationErrors extends Error {

  constructor(name: string, msg:string) {

    super(msg);

  }

}

export class WrappedSchemaValidationError extends Error {

  constructor(error:Error) {

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
