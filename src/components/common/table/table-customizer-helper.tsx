import type { ColumnDef } from "@tanstack/react-table";
import type { SavedColumnConfig } from "@/types/table";


export function getCurrentColumns<T>(allAvailableColumns: Record<string, ColumnDef<T>>, savedConfigs:Array<SavedColumnConfig>): Array<ColumnDef<T>> {
    // columns defs after sort by position
    const sortedColDefs = savedConfigs
    .sort((col1, col2) => col1.position - col2.position)
    .map((column) => allAvailableColumns[column.name]);


    // return defined columns set
    return [...sortedColDefs].filter((colDef) => colDef);
}