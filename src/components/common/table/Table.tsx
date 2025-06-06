import { getCoreRowModel, useReactTable, type ColumnPinningState } from '@tanstack/react-table';
import { useMemo } from 'react'
import { buildColumnDefs } from './table-helper';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import type { SavedColumnConfig, TableProps } from '@/types/table';
import storage from '@/utils/storage';
import { getCurrentColumns } from './table-customizer-helper';



// declared this Generic Type and Given comma to avoid error syntax <T, >
const Table = <T,>({ tableColumnConfigs, allFormFields, data }: TableProps<T>) => {
    // this is allColumnMap, o(1) search for the field name
    const allColumnsMap = useMemo(() => {
        return buildColumnDefs<T>(tableColumnConfigs, allFormFields)
    }, [tableColumnConfigs, allFormFields]);

    const allAvailableColumns = useMemo(() => Object.values(allColumnsMap), [allColumnsMap]);
    
    // get saved/persisted config
    const savedColumnConfigs = useMemo(() => {
        const configFromStorage = storage.getItem(tableColumnConfigs.storageName);
        let savedConfigs: Array<SavedColumnConfig>;
        if(configFromStorage) {
            savedConfigs = JSON.parse(configFromStorage);
        } else {
            savedConfigs = tableColumnConfigs.initialColumns;
        }
        return savedConfigs;
    }, [tableColumnConfigs]);
    
    // get all locked/pinned columnDefs 
    const lockedColumnDefs = useMemo(() => {
        const lockedCols = savedColumnConfigs.filter((col) => col.locked);
        return getCurrentColumns<T>(allColumnsMap, lockedCols)
    }, [savedColumnConfigs, allColumnsMap]);

    // get all other columnDefs, apart from locked/pinned columns
    const unlockedColumnDefs = useMemo(() => {
        const unlockedCols = savedColumnConfigs.filter((col) => !col.locked);
        return getCurrentColumns<T>(allColumnsMap, unlockedCols);
    }, [savedColumnConfigs, allColumnsMap]);


    // get all the current columns to be render in the table
    const currentColumnsToRender = useMemo(() => {
        return [...lockedColumnDefs, ...unlockedColumnDefs];
    }, [lockedColumnDefs, unlockedColumnDefs]);

    const pinnedColumns: ColumnPinningState = useMemo(() => {
        return {
            left: lockedColumnDefs.map((col) => col.id || ''),
            right: []
        }
    }, [lockedColumnDefs]);

    const tableInstance = useReactTable<T>({
        columns: allAvailableColumns,
        data,
        getCoreRowModel: getCoreRowModel(),
        initialState:{
            columnPinning: pinnedColumns
        }
    });

    return (
        <div className='relative'>
            <div className='absolute right-0 z-10 w-9 h-9 top-2 flex items-center justify-center shadow-md bg-card-background rounded'>
                SE
            </div>
            <div className='overflow-y-auto overflow-x-auto'>
                <table className='w-full table-fixed'>
                    <TableHeader tableInstance={tableInstance} />
                    <TableBody tableInstance={tableInstance}/>
                </table>
            </div>
            <div className='flex p-2'>
                <p> Pagination </p>
            </div>
        </div>
    )
}

export default Table;