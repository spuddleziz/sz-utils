import {Types} from "./Types";
import * as assert from "assert";
import {clone} from "lodash";

export abstract class Schema<T> {

  _type:Array<Types>|Types;
  title:string;
  description:string;
  example:T;
  examples:Array<T>;
  default:any;
  _requiredFlag:boolean;
  _forbiddenFlag:boolean;
  _stripFlag:boolean;
  _validValues:Array<T> = [];
  _children:Array<Schema<any>> = [];
  _notAllowed:boolean = false;


  constructor(typeOrTypes?:Array<Types>|Types) {

    if (typeOrTypes) {

      this._type = typeOrTypes;

    }

  }

  setTitle(title:string) {

    assert(title && typeof title === "string",`title wasn't supplied or wasn't a string`);

    this.title = title;

  }

  setDescription(description:string) {

    assert(description && typeof description === "string",`description wasn't supplied or wasn't a string`);

    this.description = description;

  }

  setExamples(example:T)
  setExamples(examples:Array<T>)
  setExamples(example:T, clearExisting?:boolean)
  setExamples(examples:Array<T>, clearExisting?:boolean)
  setExamples(examples:Array<T>|T, clearExisting?:boolean) {

    if (examples === undefined || examples === null) return;

    if (Array.isArray(examples) && !Array.isArray(this._type) && this._type !== Types.array) {

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
    else if (!Array.isArray(this._type) && this._type === Types.array && Array.isArray(examples)) {

      if (this.examples && !clearExisting) {

        this.examples.push((<any>examples));
        delete this.example;

      }
      else if (this.example && !clearExisting) {

        this.examples = [this.example].concat(examples);
        delete this.example;

      }
      else {

        this.example = <any>examples;
        delete this.examples;

      }

    }
    else {

      if (this.examples && !clearExisting) {

        this.examples.push(<any>examples);
        delete this.example;

      }
      else if (this.example && !clearExisting) {

        this.examples = [this.example, <any>examples];
        delete this.example;

      }
      else {

        this.example = <any>examples;
        delete this.examples;

      }

    }

  }

  setDefault(defaultVar:any) {

    if (defaultVar !== undefined && defaultVar !== null) {

      this.default = defaultVar;

    }

  }

  setValids(validVaues:Array<any>) {

    assert(Array.isArray(validVaues), `valid values cannot be set as an array of valid values wasn't passed.`);

    this._validValues = validVaues;

  }

  addChild(childSchemaToAdd:Schema<any>) {

    this._children.push(childSchemaToAdd);

  }

  setRequired(isRequired?:boolean) {

    if (isRequired === false) {

      this._requiredFlag = false;

    }
    else {

      this._requiredFlag = true;

    }

  }

  setForbidden(isForbidden?:boolean) {

    if (isForbidden === false) {

      this._forbiddenFlag = false;

    }
    else {

      this._forbiddenFlag = true;

    }

  }

  setStrip(isStripped?:boolean) {

    if (isStripped === false) {

      this._stripFlag = false;

    }
    else {

      this._stripFlag = true;

    }

  }

  public static toJSON(schemaObj:Schema<any>, inSchema?:object) {

    let outSchema:any = (typeof inSchema === "object" ? clone(inSchema) : {});

    if (schemaObj._type) {
      outSchema.type = schemaObj._type;
    }

    let thisItem:any = null;

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

        }

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
