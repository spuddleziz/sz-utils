import { Schema } from "./Schema";
export declare class SZDate extends Schema<number> {
    _format: string;
    constructor();
    setTimstamp(): void;
    toJSON(): any;
}
