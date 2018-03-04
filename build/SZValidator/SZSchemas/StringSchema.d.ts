import { SZString } from "../JSONSchema/String";
import { AnySchema } from "./AnySchema";
export interface StringSchemaRegexRuleOptions {
    name?: string;
    invert?: boolean;
}
export interface StringSchemaRegexStackChildItem {
    name?: string;
    regex: RegExp;
    invert?: boolean;
}
export interface StringSchemaRegexStackItem {
    name?: string;
    regex: RegExp | Array<StringSchemaRegexStackChildItem>;
    invert?: boolean;
    all?: boolean;
}
export interface StringSchemaURIRuleOptions {
    scheme: Array<string> | string;
    allowRelative?: boolean;
    relativeOnly?: boolean;
}
export declare enum StringSchemaIPRuleOptionsIPVersion {
    IPv4 = "ipv4",
    IPv6 = "ipv6",
    IPvFUTURE = "ipvfuture",
}
export declare enum StringSchemaIPRuleOptionsCIDR {
    OPTIONAL = "optional",
    REQUIRED = "requried",
    FORBIDDEN = "forbidden",
}
export interface StringSchemaIPRuleOptions {
    version: Array<StringSchemaIPRuleOptionsIPVersion>;
    cidr: StringSchemaIPRuleOptionsCIDR;
}
export declare enum StringSchemaGUIDRuleVersion {
    V1 = "uuidv1",
    V2 = "uuidv2",
    V3 = "uuidv3",
    V4 = "uuidv4",
    V5 = "uuidv5",
}
export declare enum StringSchemaNormaliseForm {
    NFC = "NFC",
    NFD = "NFD",
    NFKC = "NFKC",
    NFKD = "NFKD",
}
export interface StringSchemaGUIDRuleOptions {
    version: Array<StringSchemaGUIDRuleVersion> | StringSchemaGUIDRuleVersion;
}
export declare class StringSchema extends AnySchema {
    _insensitiveMode: boolean;
    _normaliseMode: boolean;
    _normaliseModeForm: StringSchemaNormaliseForm;
    _truncateMode: boolean;
    _singleRegex: boolean;
    _singleRegexName: string;
    _regexStack: Array<StringSchemaRegexStackItem>;
    _replaceRegex: RegExp;
    _replaceWithString: string;
    _lowerMode: boolean;
    _upperMode: boolean;
    _trimMode: boolean;
    internalJSONSchema: SZString;
    constructor();
    insensitive(insensitiveEnabled?: boolean): this;
    min(limit: number): this;
    max(limit: number): this;
    truncate(truncateEnabled?: boolean): this;
    regex(pattern: RegExp): this;
    regex(pattern: RegExp, name: string): this;
    regex(pattern: RegExp, options: StringSchemaRegexRuleOptions): this;
    replace(pattern: RegExp | string, replacement: string): this;
    alphanum(): this;
    token(): this;
    email(): this;
    ip(options?: StringSchemaIPRuleOptions): this;
    uri(uriRulOptions?: StringSchemaURIRuleOptions): this;
    guid(guidRuleOptions?: StringSchemaGUIDRuleOptions): this;
    uuid(guidRuleOptions?: StringSchemaGUIDRuleOptions): this;
    hex(): this;
    base64(): this;
    hostname(): this;
    normalise(normailiseForm?: StringSchemaNormaliseForm): this;
    lowercase(): this;
    uppercase(): this;
    trim(): this;
    isoDate(): this;
    validate(value: string): any;
}
