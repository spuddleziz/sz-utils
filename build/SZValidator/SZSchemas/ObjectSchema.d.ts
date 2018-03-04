import { AnySchema } from "./AnySchema";
import { SZObject } from "../JSONSchema/Object";
import { IDictionary } from "../../IDictionary";
export interface ObjectSchemaRenameRuleOptions {
    alias?: boolean;
    multiple?: boolean;
    override?: boolean;
    ignoreUndefined?: boolean;
    setUndefinedOnFromKey?: boolean;
}
export declare class ObjectSchemaRenameRule {
    options: ObjectSchemaRenameRuleOptions;
    from: string;
    to: string;
    optionsEnabled: boolean;
    constructor(from: string, to: string, options?: ObjectSchemaRenameRuleOptions);
}
export interface ObjectSchemaAssertionRule {
    schema?: AnySchema;
    ref?: string;
    message?: string;
}
export declare class ObjectSchema extends AnySchema {
    internalJSONSchema: SZObject;
    _anyKey: boolean;
    _anyKeySchema: AnySchema;
    _keyPattern: RegExp;
    _keyPatternSchema: AnySchema;
    _properties: IDictionary<AnySchema>;
    _minKeys: number;
    _maxKeys: number;
    _andRulesMap: IDictionary<Array<string>>;
    _nandRulesMap: IDictionary<Array<string>>;
    _orRulesMap: IDictionary<Array<string>>;
    _xorRulesMap: IDictionary<Array<string>>;
    _withRules: IDictionary<Array<string>>;
    _withoutRules: IDictionary<Array<string>>;
    _renameRules: IDictionary<ObjectSchemaRenameRule>;
    _assertRules: IDictionary<Array<ObjectSchemaAssertionRule>>;
    _constructorType: Function;
    _constructorTypeName: string;
    _isMetaSchema: boolean;
    _forbiddenKeys: Array<string>;
    _requiredKeys: Array<string>;
    _optionalKeys: Array<string>;
    constructor(inSchemaMap?: IDictionary<AnySchema>);
    keys(inSchemaMap: IDictionary<AnySchema>): this;
    unknown(allowUnknown?: boolean): this;
    min(limit: number): this;
    max(limit: number): this;
    length(limit: number): this;
    pattern(regex: RegExp, schema: AnySchema): this;
    and(...peers: Array<string>): this;
    nand(...peers: Array<string>): this;
    or(...peers: Array<string>): this;
    xor(...peers: Array<string>): this;
    with(key: string, ...peers: Array<string>): this;
    without(key: string, ...peers: Array<string>): this;
    rename(from: string, to: string, options?: ObjectSchemaRenameRuleOptions): this;
    private _lookupOtherRename(from, targetTo);
    private _lookupTargetRename(target, override?);
    private _lookupFromAlias(target);
    assert(ref: string, assertRef: string): any;
    assert(ref: string, schema: AnySchema): any;
    assert(ref: string, assertRef: string, message: string): any;
    assert(ref: string, schema: AnySchema, message: string): any;
    type(constructor: Function, name?: string): this;
    schema(metaSchemaEnabled?: boolean): this;
    requiredKeys(...children: Array<string>): this;
    optionalKeys(...children: Array<string>): this;
    forbiddenKeys(...children: Array<string>): this;
    validate(value: object): any;
}
