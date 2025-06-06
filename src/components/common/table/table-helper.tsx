import type { CellContext, Column, ColumnDef } from "@tanstack/react-table";
import type { Field } from "@/types/form";
import type { TableColumnConfig, UiColumn } from "@/types/table";
import DefaultCell from "@/components/table-cells/DefaultCell";
import { TABLE_COLUMN_WIDTH_BASED_ON_FIELD_TYPE } from "@/constants/table-columns-configs/table-column-field-type-width";
import type { Property } from "csstype";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultCellDef = <TData, TValue, >(value: CellContext<TData, TValue>) => {
    return <DefaultCell {...value}/>
}

function buildColumnDef<T>(field: Field | UiColumn, tableColumnConfigs: TableColumnConfig<T>): ColumnDef<T> | null {
    // let columnDefinition:ColumnDef<T>;
    const defaultColumnDefConfig = tableColumnConfigs.defaultConfigs.find((config) => config.name === field.name);
    
    // canRender return false, return null
    if(defaultColumnDefConfig?.canRender && !defaultColumnDefConfig?.canRender()) {
        return null;
    }
    const id = 'id' in field && field.id ? field.id : field.name;
    const label = 'label' in field && field.label ? field.label : field.name;

    const columnDefinition:ColumnDef<T> = {
        id,
        header: defaultColumnDefConfig?.header || label,
        accessorKey: defaultColumnDefConfig?.accessorKey || field.name,
        accessorFn: defaultColumnDefConfig?.accessorFn,
        cell: defaultColumnDefConfig?.cell || defaultCellDef,
        size: defaultColumnDefConfig?.width || TABLE_COLUMN_WIDTH_BASED_ON_FIELD_TYPE[field.type] || 178
    }
    return columnDefinition;
}


export function buildColumnDefs<T>(tableColumnConfigs: TableColumnConfig<T>, allFormFields: Array<Field>): Record<string, ColumnDef<T>>{
    // list of columns with mapped
    const allColumnsMap: Record<string, ColumnDef<T>> = {};
    
    // columnDef for all form fields
    allFormFields.filter((field) => {
        const filterOut = (field.hidden || tableColumnConfigs.excludeColumns.includes(field.name) || tableColumnConfigs.excludeCustomTypeColumns.includes(field.type));
        return !filterOut;
    }).forEach((field) => {
        // build the columns defs for each fields
        const config = buildColumnDef(field, tableColumnConfigs);
        if(config) {
            allColumnsMap[field.name] = config;
        }
    })

    // columnDef for all ui columns
    tableColumnConfigs.uiMappedColumns.map((uiColumn) => {
        const config = buildColumnDef(uiColumn, tableColumnConfigs)
        if(config) {
            allColumnsMap[uiColumn.name] = config;
        }
    })

    return allColumnsMap;
}

export function getColumnPinnedStyle<T>(col: Column<T>){
    const isPinned = col.getIsPinned();
    const isLeftPinned = isPinned === 'left';
    const isRightPinned = isPinned === 'right';
    const isLastLeftPinnedColumn = isLeftPinned && col.getIsLastColumn('left');
    const isLastRightPinnedColumn = isRightPinned && col.getIsLastColumn('right');
    return {
        width: `${col.getSize()}px`,
        left: isLeftPinned ? `${col.getStart('left')}px`: undefined,
        position: (isPinned ? 'sticky': 'relative') as Property.Position,
        zIndex: isPinned ? 1: 0,
        boxShadow: isLastLeftPinnedColumn ? 'var(--shadow-table-frozen-left)': (isLastRightPinnedColumn ? 'var(--shadow-table-frozen-right)': undefined)
    }
}