import { Schema } from "./Schema";
export declare class SZArray<T> extends Schema<Array<T>> {
    uniqueItems: boolean;
    minItems: number;
    maxItems: number;
    _items: Schema<T>;
    _oneOf: Array<Schema<T>>;
    _ordered: Array<Schema<T>>;
    constructor();
    setUniqueItems(enabled: boolean): void;
    setLength(length: number): void;
    setMinItems(minItems: number): void;
    setMaxItems(maxItems: number): void;
    setOrdered(ordered: Array<Schema<T>>): void;
    setItems(inSchema: Schema<T>): any;
    setItems(inSchema: Array<Schema<T>>): any;
    toJSON(): any;
}
