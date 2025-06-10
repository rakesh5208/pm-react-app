import React from "react";
import type { Field, FieldType } from "./form";
import { type CellContext, type Table as ReactTable, type RowData } from '@tanstack/react-table';

// Table Column Customize Type
export interface SavedColumnConfig {
    name: string;
    locked: boolean;
    position: number;
}

export type UiColumn = {
    name: string;
    type: FieldType;
    label?:string; // first ColumnDefaultConfig.header will be priority, else this label will be used else name will be used for table column
}

export type ColumnDefaultConfig<T> = {
    name: string;
    header?: string;
    accessorKey?: string;
    accessorFn?: (props: T) => unknown
    cell?: (props: CellContext<T, unknown>) => React.ReactNode;
    canRender?: () => boolean, // this function may be used to check features based columns, if return false, it will skip for rendering
    width?:number; // get default column width, this can be store
}

export type TableColumnConfig<T extends RowData>= {
    storageName: string;
    initialColumns: Array<SavedColumnConfig>;
    uiMappedColumns: Array<UiColumn>;
    excludeColumns: Array<string>;
    excludeCustomTypeColumns: Array<string>
    defaultConfigs: Array<ColumnDefaultConfig<T>>
}

// table Component types
export type TableProps<T> = {
    tableColumnConfigs: TableColumnConfig<T>;
    allFormFields: Array<Field>,
    data: Array<T>
}

export type TableHeaderProps<T> = {
    tableInstance: ReactTable<T>
}

export type TableBodyProps<T> = {
    tableInstance: ReactTable<T>
}

export interface CellComponentProps<TData, TValue> extends CellContext<TData, TValue> {
  defaultValue?: string;
}