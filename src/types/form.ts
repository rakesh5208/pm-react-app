export type FieldType = 'TEXT' | 'NUMBER' | 'EMAIL' | 'DATE' | 'DATE_TIME' | 'DROPDOWN' | 'MULTI_SELECT_DROPDOWN' | 'AUTO_COMPLETE' | 'MULTI_SELECT_AUTO_COMPLETE';

export type FieldAdditionalOptions = {
    apiPath?: string;
    components?: string;
    min?:number;
    max?: number;
}

export type FieldValue = {
    id: string;
    name: string;
}

export type Field = {
    id: string;
    label: string;
    name: string;
    type: FieldType;
    position: number;
    required: boolean;
    hidden: boolean;
    default: boolean;
    // values: Array<FieldValue>
    // additionalOption: FieldAdditionalOptions;
}
export type Form = {
    id: string;
    name: string;
    description: string;
    fields: Array<Field>
}