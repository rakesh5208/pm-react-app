import { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../Popover'
import type { ColumnDef } from '@tanstack/react-table'
import { Settings as SettingIcon } from 'lucide-react';
import Button from '@/components/common/Button';

type ColumnCustomizerField = {
    id: string;
    label: string;
    isColumnFreezed?: boolean;
    isSelected?: boolean
}
interface ColumnCustomizerProps<T> {
    allColumns: Array<ColumnDef<T>>,
    frozenColumns: Array<ColumnDef<T>>,
    otherSelectedColumns: Array<ColumnDef <T>>,
    onUpdate: (opts : { frozenColumns: Array<ColumnDef<T>>, otherSelectedColumns: Array<ColumnDef<T>> }) => void
}

const ColumnCustomizer = <T, >({ allColumns, frozenColumns, otherSelectedColumns, onUpdate}: ColumnCustomizerProps<T>) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
//   const [allColumnList, setAllColumnList ] = useState(allColumns);
  const [frozenColumnList, setFrozenColumnList] = useState(frozenColumns);
  const [otherSelectedColumnsList, setOtherSelectedColumnsList] = useState(otherSelectedColumns);

  const frozenColumnIds = useMemo(() => frozenColumnList.map((col) => col.id), [frozenColumnList]);
  const otherSelectedColumnIds = useMemo(() => otherSelectedColumnsList.map((col) => col.id), [otherSelectedColumnsList]);
  
  const allColumnsAsMapWithId = useMemo(() => {
    const colMap: Record<string, ColumnDef<T>> = { };
    allColumns.forEach((col) => {
        colMap[col.id || ''] = col
    });

    return colMap;
  }, [allColumns])
  
  const frozenFieldFromAllColumns = useMemo(() => {
    return frozenColumnIds.map((colId) => {
        const col = allColumnsAsMapWithId[colId || ''];
        return {
            id: col.id || '',
            label: col.header?.toString() || '',
            isColumnFreezed: true,
            isSelected: true,
        }
    });
  }, [frozenColumnIds, allColumnsAsMapWithId]);

  const otherSelectedFieldFromAllColumns = useMemo(() => {
    return otherSelectedColumnIds.map((colId) => {
        const col = allColumnsAsMapWithId[colId || ''];
        return {
            id: col.id || '',
            label: col.header?.toString() || '',
            isColumnFreezed: false, // this is not frozen column
            isSelected: true,
        }
    });
  }, [otherSelectedColumnIds, allColumnsAsMapWithId]);

  const allCustomizerFields: ColumnCustomizerField[]= useMemo(() => {
    
    // other apart from frozen and selected fields
    const allOtherFields =allColumns.filter((col) => !(frozenColumnIds.includes(col.id) || otherSelectedColumnIds.includes(col.id))).map((col) => {
        return {
            id: col.id || '',
            label: col.header?.toString() || '',
            isColumnFreezed: false,
            isSelected: false
        }
    });
    
    return [...frozenFieldFromAllColumns, ...otherSelectedFieldFromAllColumns, ...allOtherFields]
  }, [allColumns, frozenColumnIds, otherSelectedColumnIds, frozenFieldFromAllColumns, otherSelectedFieldFromAllColumns]);

  const onColSelectStateChange = (col: ColumnCustomizerField) => {
    if(col.isSelected) {
        // remove if already selected
        // otherSelectedColumns.filter((field) => !field.id === col.id);
        setOtherSelectedColumnsList((prev) => prev.filter((field) => field.id !== col.id));
    } else {
        // add new item
        setOtherSelectedColumnsList((prev) => [...prev, allColumnsAsMapWithId[col.id]]);
    }
  }

  const onFrozenStateChange = (col: ColumnCustomizerField) => {
    if(col.isColumnFreezed) {
        // remove if already freezed
        setFrozenColumnList((prev) => prev.filter((frozenColumn) => frozenColumn.id !== col.id));
        // add to selected columns if defreeze as it must be in the selected list
        setOtherSelectedColumnsList((prev) => [...prev, allColumnsAsMapWithId[col.id]]);
    } else {
        // add to freezed list
        setFrozenColumnList((prev) => [...prev, allColumnsAsMapWithId[col.id]]);
        // remove from the other selected column as only selected column can be freezed
        setOtherSelectedColumnsList((prev) => prev.filter((field) => field.id !== col.id));

    }
  }

  const handleCancel = () => {
    setIsOpenPopover(false);
  }
  
  const handleUpdate = () => {
    console.log("Selected fields with state =>",  frozenColumnList, otherSelectedColumnsList);
    onUpdate({frozenColumns: [...frozenColumnList], otherSelectedColumns: [...otherSelectedColumnsList]});
    setIsOpenPopover(false);
  }


  
  return (
    <div className='absolute right-0 z-10 flex items-center justify-center shadow-md bg-card-background rounded hover:bg-card-hover'>
        <Popover open = {isOpenPopover} onOpenChange={setIsOpenPopover}>
            <PopoverTrigger className='w-9 h-9 top-2 cursor-pointer flex justify-center items-center'>
                <SettingIcon color='var(--color-icon-primary)' className='w-5 h-5'/>
            </PopoverTrigger>
            <PopoverContent align='end' className='-mr-2 w-[450px] p-0'>
                <div className='flex flex-col text-prop'>
                    {/* header */}
                    <div className='p-4 border-b border-primary-border'>
                        <h3 className='font-semibold'>Customize columns</h3>
                    </div>
                    <div className='max-h-[300px] flex gap-4'>
                        {/* Search and field list  */}
                        <div className='flex flex-col w-1/2 border-r border-primary-border'>
                            <p>Add / Remove Columns</p>
                            <div className='px-4 py-2'>
                                <input type="text" placeholder='search column...' className='w-full'/>
                            </div>
                            <ul className='flex-1 overflow-y-auto px-4'>
                                {
                                    allCustomizerFields.map((col) => {
                                        return (
                                            <li key={col.id} className='py-1 mt-1 rounded text-prop' onClick={ () => onColSelectStateChange(col)}>
                                                {col.isColumnFreezed &&  'f' } {col.isSelected && 's'} {col.label}
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                        </div>
                        {/* selected field list */}
                        <div className='w-1/2 flex flex-col'>
                            <p className='font-medium pr-4 py-2'>Reorder Columns</p>
                            <ul className='overflow-y-auto flex-1 pr-4 pb-2'>
                                {
                                    frozenFieldFromAllColumns.map((col) => {
                                        return (
                                            <li key={col.id} className='p-2 border border-primary-border mt-1 rounded text-prop' onClick={() => onFrozenStateChange(col)}>
                                                {col.isColumnFreezed &&  'f' } {col.isSelected && 's'} {col.label}
                                            </li>
                                        )
                                    })
                                }
                                {
                                    otherSelectedFieldFromAllColumns.map((col) => {
                                        return (
                                            <li key={col.id} className='p-2 border border-primary-border mt-1 rounded text-prop' onClick={() => onFrozenStateChange(col)}>
                                               {col.isColumnFreezed &&  'f' } {col.isSelected && 's'} {col.label}
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    {/* action */}
                    <div className='flex justify-end gap-2 p-4 bg-card-background'>
                       <Button type="button" onClick={ handleCancel }>Cancel</Button>
                       <Button type="button" onClick={ handleUpdate }>Update</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    </div>
  )
}

export default ColumnCustomizer;