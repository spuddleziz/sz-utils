import { SZDate } from "../JSONSchema/Date";
import { AnySchema } from "./AnySchema";
import * as moment from "moment";
export declare enum DateSchemaTimestampType {
    JAVASCRIPT = "javascript",
    UNIX = "unix",
}
export declare class DateSchema extends AnySchema {
    internalJSONSchema: SZDate;
    _timestampType: DateSchemaTimestampType;
    _timestampMode: boolean;
    _isoMode: boolean;
    _momentMode: boolean;
    _min: number;
    _max: number;
    constructor();
    valid(...values: Array<Date | string | number>): this;
    invalid(...values: Array<Date | string | number>): this;
    min(minDate: number | Date | moment.Moment): this;
    max(maxDate: number | string | Date | moment.Moment): this;
    iso(enableISOMode?: boolean): this;
    moment(enableMomentMode?: boolean): this;
    timestamp(type?: DateSchemaTimestampType): this;
    validate(value: string | number | moment.Moment | Date): any;
    private _parseISOString(inDate);
    private _coerceToDestType(inDate);
}
