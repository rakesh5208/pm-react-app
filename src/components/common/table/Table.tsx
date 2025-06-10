import { getCoreRowModel, useReactTable, type ColumnDef, type ColumnPinningState } from '@tanstack/react-table';
import { useMemo, useState } from 'react'
import { buildColumnDefs } from './table-helper';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import type { SavedColumnConfig, TableProps } from '@/types/table';
import storage from '@/utils/storage';
import { getCurrentColumns } from './table-customizer-helper';
import ColumnCustomizerV1 from './utils-components/column-customizer-v1/ColumnCustomizerV1';
import ColumnCustomizer from './utils-components/column-customizer/ColumnCustomizer';



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

    //saved config as state to update the columns, as, lockedColumnDefs and unlockedColumnDefs have dependency on this state
    const [columnConfigs, setColumnConfigs] = useState<Array<SavedColumnConfig>>(savedColumnConfigs);
    
    // get all locked/pinned columnDefs 
    const frozenColumnDefs = useMemo(() => {
        const lockedCols = columnConfigs.filter((col) => col.locked);
        return getCurrentColumns<T>(allColumnsMap, lockedCols)
    }, [columnConfigs, allColumnsMap]);

    // get all other columnDefs, apart from locked/pinned columns
    const otherSelectedColumnDefs = useMemo(() => {
        const unlockedCols = columnConfigs.filter((col) => !col.locked);
        return getCurrentColumns<T>(allColumnsMap, unlockedCols);
    }, [columnConfigs, allColumnsMap]);


    // get all the current columns to be render in the table
    const currentColumnsToRender = useMemo(() => {
        return [...frozenColumnDefs, ...otherSelectedColumnDefs];
    }, [frozenColumnDefs, otherSelectedColumnDefs]);

    const pinnedColumns: ColumnPinningState = useMemo(() => {
        return {
            left: frozenColumnDefs.map((col) => col.id || ''),
            right: []
        }
    }, [frozenColumnDefs]);

    const tableInstance = useReactTable<T>({
        columns: currentColumnsToRender,
        data,
        getCoreRowModel: getCoreRowModel(),
        initialState:{
            columnPinning: pinnedColumns
        }
    });

    const onColumnUpdate = ({ frozenColumns, otherSelectedColumns} : { frozenColumns: Array<ColumnDef<T>>, otherSelectedColumns: Array<ColumnDef<T>> }) => {
        // here update the table column, and updated the pinnedColumns
        // configs for frozenColumn
        // need to update the logic, this operation is costly
        const findName = (columnToFind: ColumnDef<T>) => {
            return Object.entries(allColumnsMap).find(([, col]) => {
                return col.id === columnToFind.id;
            })
        }
        
        let position = 0;
        const frozenColumnConfig = frozenColumns.map((col: ColumnDef<T>) => {
            const name = findName(col)?.[0] || '';
            position = position + 1;
            return {
                name,
                locked: true,
                position
            }
        });

        const otherColumnConfig = otherSelectedColumns.map((col: ColumnDef<T>) => {
            const name = findName(col)?.[0] || '';
            position = position + 1;
            return {
                name,
                locked: false,
                position
            }
        });

        const config = [...frozenColumnConfig, ...otherColumnConfig]
        setColumnConfigs(config);
        //update the storage
        storage.setItem(tableColumnConfigs.storageName, JSON.stringify(config));
    }

    return (
        <div className='relative'>
            {/* <ColumnCustomizerV1 
                allColumns={allAvailableColumns}
                frozenColumns = { frozenColumnDefs }
                otherSelectedColumns={otherSelectedColumnDefs}
                onUpdate={onColumnUpdate}
            /> */}

            <ColumnCustomizer 
                allColumns={allAvailableColumns}
                frozenColumns = { frozenColumnDefs }
                otherSelectedColumns={otherSelectedColumnDefs}
                onUpdate={onColumnUpdate}
            />
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