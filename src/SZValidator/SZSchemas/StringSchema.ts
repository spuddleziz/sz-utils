import {BaseSchema, SZSchemaTypes} from "./BaseSchema";
import {SZArray} from "../JSONSchema/Array";
import {SZAny} from "../JSONSchema/Any";
import {SchemaValidationFailedError} from "../SchemaError";
import {SZString} from "../JSONSchema/String";
import * as assert from "assert";
import {AnySchema} from "./AnySchema";

const StringSchemaIPv4RegexStr:string = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";

const StringSchemaIPv4RegexNoCIDR:RegExp = new RegExp(StringSchemaIPv4RegexStr + "$");

const StringSchemaIPv4RegexOptionalCIDR:RegExp = new RegExp(StringSchemaIPv4RegexStr + "(\\/([1-9]|[1-2][0-9]|3[0-2]))?$");

const StringSchemaIPv4RegexRequiredCIDR:RegExp = new RegExp(StringSchemaIPv4RegexStr + "(\\/([1-9]|[1-2][0-9]|3[0-2])){1}$");

const StringSchemaIPv6RegexStr:string = "^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))";

const StringSchemaIPv6RegexNoCIDR:RegExp = new RegExp(StringSchemaIPv6RegexStr + "$");

const StringSchemaIPv6RegexOptionalCIDR:RegExp = new RegExp(StringSchemaIPv6RegexStr + "(\\/([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$");

const StringSchemaIPv6RegexRequiredCIDR:RegExp = new RegExp(StringSchemaIPv6RegexStr + "(\\/([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8])){1}$");

const StringSchemaGUIDRegex:RegExp = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;

const StringSchemaHexRegex:RegExp = /^[0-9a-fA-F]+$/;

const StringSchemaBase64Regex:RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

const StringSchemaHostnameRegex:RegExp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

const StringSchemaEmailRegex:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const StringSchemaAlphaNumRegex:RegExp = /^[A-Za-z0-9]+$/;

const StringSchemaTokenRegex:RegExp = /^[A-Za-z0-9_]+$/;

const StringSchemaLeadingTrimRegex:RegExp = /^\s+/;

const StringSchemaTrailingTrimRegex:RegExp = /\s+$/;

const StringSchemaUppercaseRegex:RegExp = /[a-z]/g;

const StringSchemaLowercaseRegex:RegExp = /[A-Z]/g;

const StringSchemaISODateRegex:RegExp = /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])(\D?([01]\d|2[0-3])\D?([0-5]\d)\D?([0-5]\d)?\D?(\d{3})?([zZ]|([\+-])([01]\d|2[0-3])\D?([0-5]\d)?)?)?$/;

export interface StringSchemaRegexRuleOptions {

  name?:string;
  invert?:boolean;

}

export interface StringSchemaRegexStackChildItem {

  name?:string;
  regex:RegExp;
  invert?:boolean;

}

export interface StringSchemaRegexStackItem {

  name?:string;
  regex:RegExp|Array<StringSchemaRegexStackChildItem>;
  invert?:boolean;
  all?:boolean;

}

export interface StringSchemaURIRuleOptions {

  scheme : Array<string>|string,
  allowRelative?:boolean,
  relativeOnly?:boolean

}

export enum StringSchemaIPRuleOptionsIPVersion {

  IPv4 = "ipv4",
  IPv6 = "ipv6",
  IPvFUTURE = "ipvfuture"

}

export enum StringSchemaIPRuleOptionsCIDR {

  OPTIONAL = "optional",
  REQUIRED = "requried",
  FORBIDDEN = "forbidden"

}

export interface StringSchemaIPRuleOptions {

  version:Array<StringSchemaIPRuleOptionsIPVersion>,
  cidr: StringSchemaIPRuleOptionsCIDR

}

export enum StringSchemaGUIDRuleVersion {

  V1 = "uuidv1",
  V2 = "uuidv2",
  V3 = "uuidv3",
  V4 = "uuidv4",
  V5 = "uuidv5"

}

export enum StringSchemaNormaliseForm {

  NFC = "NFC",
  NFD = "NFD",
  NFKC = "NFKC",
  NFKD = "NFKD"

}

export interface StringSchemaGUIDRuleOptions {

  version:Array<StringSchemaGUIDRuleVersion>|StringSchemaGUIDRuleVersion

}


function throwConvertNotEnabled(value:string, regex:RegExp, convert:boolean, convertFN:Function, inner?:boolean) {

  if (!inner && convert === true && convertFN && typeof convertFN === "function") {

    if (regex.test(value)) {

      return convertFN(value);

    }
    else {

      return throwConvertNotEnabled(convertFN(value), regex, false, null);

    }

  }
  else if (regex.test(value)) {

    return value;

  }

  throw new SchemaValidationFailedError(`Value passed cannot be converted as it did not pass validation. Conversion enabled: ${convert}`);

}


export class StringSchema extends AnySchema {


  _insensitiveMode:boolean = false;
  _normaliseMode:boolean = false;
  _normaliseModeForm:StringSchemaNormaliseForm;
  _truncateMode:boolean = false;
  _singleRegex:boolean = false;
  _singleRegexName:string;
  _regexStack:Array<StringSchemaRegexStackItem> = [];
  _replaceRegex:RegExp;
  _replaceWithString:string;
  _lowerMode:boolean = false;
  _upperMode:boolean = false;
  _trimMode:boolean = false;

  public internalJSONSchema:SZString;

  constructor() {

    super(SZSchemaTypes.String);

    this.internalJSONSchema = new SZString();

  }

  insensitive(insensitiveEnabled?:boolean):this {

    if (insensitiveEnabled === false) {

      this._insensitiveMode = false;

    }
    else {

      this._insensitiveMode = true;

    }

    return this;

  }

  min(limit:number):this {

    assert((typeof limit === "number" && limit >= 0), `Supplied Minimum string length must be a number and greater than or equal to 0`);

    this.internalJSONSchema.setMinLength(limit);

    return this;

  }

  max(limit:number):this {

    assert((typeof limit === "number" && limit >= 1), `Supplied Maximum string length must be a number and greater than or equal to 1`);

    this.internalJSONSchema.setMaxLength(limit);

    return this;

  }

  truncate(truncateEnabled?:boolean):this {

    if (truncateEnabled === false) {

      this._truncateMode = false;

    }
    else {

      this._truncateMode = true;

    }

    return this;

  }


  regex(pattern:RegExp):this
  regex(pattern:RegExp, name:string):this
  regex(pattern:RegExp, options:StringSchemaRegexRuleOptions):this
  regex(pattern:RegExp, nameOrOptions?:StringSchemaRegexRuleOptions|string):this {

    let name = null, invert = false;

    if (nameOrOptions && typeof nameOrOptions === "string") {

      name = nameOrOptions;

    }
    else if (nameOrOptions && (<StringSchemaRegexRuleOptions>nameOrOptions).name && typeof (<StringSchemaRegexRuleOptions>nameOrOptions).name === "string") {

      if ((<StringSchemaRegexRuleOptions>nameOrOptions).invert === true) {

        invert = true

      }

      name = (<StringSchemaRegexRuleOptions>nameOrOptions).name;

    }
    else if (nameOrOptions && (<StringSchemaRegexRuleOptions>nameOrOptions).invert === true) {

      invert = true;

    }

    if (this._regexStack.length === 0 && !this._singleRegex) {

      this._singleRegex = true;

    }

    this._regexStack.push({

      regex : pattern,
      name : name,
      invert : invert

    });

    if (!this.internalJSONSchema.pattern) {

      this.internalJSONSchema.setPattern(pattern);

    }

    return this;

  }

  replace(pattern:RegExp|string, replacement:string):this {

    assert((pattern instanceof RegExp || typeof pattern === "string") && typeof replacement === "string", `Must pass a Regular Expression and a replacement to the replace rule.`);

    if (typeof pattern === "string") pattern = new RegExp(pattern, "g");

    this._replaceRegex = pattern;

    this._replaceWithString = replacement;

    return this;

  }

  alphanum():this {

    assert(!this._singleRegex, `Cannot set alphanum to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "alphanum";

    this._regexStack.push({

      regex : StringSchemaAlphaNumRegex,
      name : "alphanum",
      invert : false

    });

    return this;

  }

  token():this {

    assert(!this._singleRegex, `Cannot set token to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "token";

    this._regexStack.push({

      regex : StringSchemaTokenRegex,
      name : "token",
      invert : false

    });

    return this;

  }

  email():this {

    assert(!this._singleRegex, `Cannot set email to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "email";

    this._regexStack.push({

      regex : StringSchemaEmailRegex,
      name : "email",
      invert : false

    });

    return this;

  }

  ip(options?:StringSchemaIPRuleOptions):this {

    assert(!this._singleRegex, `Cannot set ip to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "ip";

    let regexStack = [];

    if (options && options.version && options.version.length > 0) {

      const self = this;

      let discoveredVer = [];

      if (!options.cidr) options.cidr = StringSchemaIPRuleOptionsCIDR.OPTIONAL;

      options.version.forEach((ver) => {

        if (discoveredVer.indexOf(ver) >= 0) return;

        discoveredVer.push(ver);

        if (ver === StringSchemaIPRuleOptionsIPVersion.IPv4) {

          switch (options.cidr) {

            case StringSchemaIPRuleOptionsCIDR.OPTIONAL:
              return regexStack.push({

                regex : StringSchemaIPv4RegexOptionalCIDR,
                name : "ipv4_optional_cidr",
                invert : false

              });
            case StringSchemaIPRuleOptionsCIDR.FORBIDDEN:
              return regexStack.push({

                regex : StringSchemaIPv4RegexNoCIDR,
                name : "ipv4_forbidden_cidr",
                invert : false

              });
            case StringSchemaIPRuleOptionsCIDR.REQUIRED:
              return regexStack.push({

                regex : StringSchemaIPv4RegexRequiredCIDR,
                name : "ipv4_required_cidr",
                invert : false

              });
            default: return;

          }

        }
        else {

          switch (options.cidr) {

            case StringSchemaIPRuleOptionsCIDR.OPTIONAL:
              return regexStack.push({

                regex : StringSchemaIPv6RegexOptionalCIDR,
                name : "ipv6_optional_cidr",
                invert : false

              });
            case StringSchemaIPRuleOptionsCIDR.FORBIDDEN:
              return regexStack.push({

                regex : StringSchemaIPv6RegexNoCIDR,
                name : "ipv6_forbidden_cidr",
                invert : false

              });
            case StringSchemaIPRuleOptionsCIDR.REQUIRED:
              return regexStack.push({

                regex : StringSchemaIPv6RegexRequiredCIDR,
                name : "ipv6_required_cidr",
                invert : false

              });
            default: return;

          }

        }

      });

    }
    else {

      regexStack.push({

        regex : StringSchemaIPv4RegexOptionalCIDR,
        name : "ipv4_optional_cidr",
        invert : false

      });

      regexStack.push({

        regex : StringSchemaIPv6RegexOptionalCIDR,
        name : "ipv6_optional_cidr",
        invert : false

      });

    }

    this._regexStack.push({

      name: "ip",
      regex: regexStack,
      invert: false,
      all : false

    });

    return this;

  }

  uri(uriRulOptions?:StringSchemaURIRuleOptions):this {

    assert(!this._singleRegex, `Cannot set uri to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "uri";

    return this;

  }

  guid(guidRuleOptions?:StringSchemaGUIDRuleOptions):this {

    assert(!this._singleRegex, `Cannot set guid/uuid to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid/uuid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "guid";

    this._regexStack.push({

      name: "guid",
      regex: StringSchemaGUIDRegex,
      invert: false,
      all : false

    });

    return this;

  }

  uuid(guidRuleOptions?:StringSchemaGUIDRuleOptions):this {

    return this.guid(guidRuleOptions);

  }

  hex():this {

    assert(!this._singleRegex, `Cannot set hex to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "hex";

    this._regexStack.push({

      name: "hex",
      regex: StringSchemaHexRegex,
      invert: false,
      all : false

    });

    return this;

  }

  base64():this {

    assert(!this._singleRegex, `Cannot set base64 to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "base64";

    this._regexStack.push({

      name: "base64",
      regex: StringSchemaBase64Regex,
      invert: false,
      all : false

    });

    return this;

  }

  hostname():this {

    assert(!this._singleRegex, `Cannot set hostname to on if regular expression rules have already been added. It is also not possible to mix alphanum, token, email, ip, uri, guid, hex, base64 or hostname`);

    this._singleRegex = true;

    this._singleRegexName = "hostname";

    this._regexStack.push({

      name: "hostname",
      regex: StringSchemaHostnameRegex,
      invert: false,
      all : false

    });

    return this;

  }

  normalise(normailiseForm?:StringSchemaNormaliseForm):this {

    if (!normailiseForm || !StringSchemaNormaliseForm[normailiseForm]) {

      normailiseForm = StringSchemaNormaliseForm.NFC;

    }

    this._normaliseMode = true;

    this._normaliseModeForm = normailiseForm;

    return this;

  }

  lowercase():this {

    if (this._upperMode === true) {

      this._upperMode = false;

    }

    this._lowerMode = true;

    return this;

  }

  uppercase():this {

    if (this._lowerMode === true) {

      this._lowerMode = false;

    }

    this._upperMode = true;

    return this;

  }

  trim():this {

    this._trimMode = true;

    return this;

  }

  isoDate():this {

    return this;



  }

  validate(value:string) {

    let valStack = AnySchema.preValidate(this, value);

    if (valStack.immediate) return AnySchema.postValidate(this, valStack.value, value);

    if (this.internalJSONSchema._requiredFlag === true && value === "" && this.internalJSONSchema._validValues.indexOf("") === -1) {

      throw this.generateError("required", `Value passed is invalid because a value required and the value isn't in the valid values list.`);

    }

    valStack = AnySchema.checkInvalid(this, valStack);

    //check valids

    valStack = AnySchema.checkValid(this, valStack);

    if (valStack.immediate === true) return AnySchema.postValidate(this, valStack.value, value);

    if (!this._checkPassedValueType(valStack.value)) {

      throw new SchemaValidationFailedError(`Unable to validate value for schema as value is not a string`);

    }

    if (this._trimMode === true && (StringSchemaLeadingTrimRegex.test(valStack.value) || StringSchemaTrailingTrimRegex.test(valStack.value))) {

      if (this._options.convert === true) {

        valStack.value = valStack.value.replace(StringSchemaLeadingTrimRegex, "").replace(StringSchemaTrailingTrimRegex, "");

      }
      else {

        throw this.generateError("trim", `Value passed is invalid because whitespace has been detected at the start or the end and the convert option isn't enabled.`);

      }

    }

    if (this._replaceRegex && this._replaceRegex instanceof RegExp) {

      valStack.value = valStack.value.replace(this._replaceRegex, this._replaceWithString);

    }

    if (this._lowerMode === true && StringSchemaLowercaseRegex.test(valStack.value)) {

      if (this._options.convert === true) {

        valStack.value = valStack.value.toLowerCase();

      }
      else {

        throw this.generateError("lowercase", `Value passed is invalid because uppercase characters were found and the convert option isn't enabled.`);

      }

    }
    else if (this._upperMode === true && StringSchemaUppercaseRegex.test(valStack.value)) {

      if (this._options.convert === true) {

        valStack.value = valStack.value.toUpperCase();

      }
      else {

        throw this.generateError("uppercase", `Value passed is invalid because lowercase characters were found and the convert option isn't enabled.`);

      }

    }

    if (this.internalJSONSchema.minLength >= 0 && valStack.value.length < this.internalJSONSchema.minLength) {
      throw this.generateError("minLength", `Value passed is invalid because its length ${valStack.value.length} is less than the minimum allowed ${this.internalJSONSchema.minLength}.`);
    }

    if (this.internalJSONSchema.maxLength >= 0 && valStack.value.length > this.internalJSONSchema.maxLength) {
      if (this._truncateMode) {
        valStack.value = valStack.value.substr(0, this.internalJSONSchema.maxLength);
      }
      else {
        throw this.generateError("maxLength", `Value passed is invalid because its length ${valStack.value.length} is more than the maximum allowed ${this.internalJSONSchema.maxLength}.`);
      }
    }

    if (this._regexStack && this._regexStack.length > 0) {

      const regexStackLen = this._regexStack.length;

      let passedRegex = false, regexItem = null;

      for (let regexStackIndex = 0; regexStackIndex < regexStackLen; regexStackIndex++) {

        regexItem  = this._regexStack[regexStackIndex];

        if (regexItem && regexItem.regex && regexItem.regex instanceof RegExp) {

          if (!regexItem.invert && regexItem.regex.test(valStack.value)) {

            passedRegex = true;
            break;

          }
          else if (regexItem.invert && !regexItem.regex.test(valStack.value)) {

            passedRegex = true;
            break;

          }

        }
        else if (regexItem && regexItem.regex && Array.isArray(regexItem.regex) && regexItem.regex.length > 0) {

          regexItem.regex.forEach((iRegex) => {

            if (passedRegex) return;

            if (!regexItem.invert && iRegex.regex.test(valStack.value)) {

              passedRegex = true;
              return;

            }
            else if (regexItem.invert && !iRegex.regex.test(valStack.value)) {

              passedRegex = true;
              return;

            }

          });

          if (passedRegex) break;

        }

      }

      if (!passedRegex) {

        throw this.generateError((this._singleRegexName || "regex"), `Value passed is invalid because none of the available regular expressions tested successfully against the supplied value.`);

      }

    }

    return AnySchema.postValidate(this, valStack.value, value);

  }

}


