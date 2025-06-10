import { useCallback, useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../Popover'
import type { ColumnDef } from '@tanstack/react-table'
import Button from '@/components/common/Button';
import { Checkbox } from '../../../Checkbox';
import CustomizerFieldItem from './CustomizerFieldItem';
import { SettingsIcon } from 'lucide-react';

export type ColumnCustomizerField = {
    id: string;
    label: string;
    isColumnFreezed?: boolean;
    isSelected?: boolean
}
interface ColumnCustomizerProps<T> {
    allColumns: Array<ColumnDef<T>>,
    frozenColumns: Array<ColumnDef<T>>,
    otherSelectedColumns: Array<ColumnDef<T>>,
    onUpdate: (opts: { frozenColumns: Array<ColumnDef<T>>, otherSelectedColumns: Array<ColumnDef<T>> }) => void
}

const ColumnCustomizerV1 = <T,>({ allColumns, frozenColumns, otherSelectedColumns, onUpdate }: ColumnCustomizerProps<T>) => {
    const [isOpenPopover, setIsOpenPopover] = useState(false);
    
    // cached all the data,
    const copiedAllColumns = useMemo(() => [...allColumns], [allColumns]);
    const copiedFrozenColumns = useMemo(() => [...frozenColumns], [frozenColumns]);
    const copiedOtherSelectedColumns = useMemo(() => [...otherSelectedColumns], [otherSelectedColumns]);

    const [allCustomizerFields, setAllCustomizerFields] = useState<Array<ColumnCustomizerField>>([]);
    
    const [frozenColumnList, setFrozenColumnList] = useState(copiedFrozenColumns);
    const [otherSelectedColumnsList, setOtherSelectedColumnsList] = useState(copiedOtherSelectedColumns);

    const frozenColumnIds = useMemo(() => frozenColumnList.map((col) => col.id), [frozenColumnList]);
    const otherSelectedColumnIds = useMemo(() => otherSelectedColumnsList.map((col) => col.id), [otherSelectedColumnsList]);

    const allColumnsAsMapWithId = useMemo(() => {
        const colMap: Record<string, ColumnDef<T>> = {};
        copiedAllColumns.forEach((col) => {
            colMap[col.id || ''] = col
        });

        return colMap;
    }, [copiedAllColumns])

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

    // use effect compute allCustomizerFields
    useEffect(() => {
        if(isOpenPopover) {
            // other apart from frozen and selected fields
            const allOtherFields = copiedAllColumns.filter((col) => !(frozenColumnIds.includes(col.id) || otherSelectedColumnIds.includes(col.id))).map((col) => {
                return {
                    id: col.id || '',
                    label: col.header?.toString() || '',
                    isColumnFreezed: false,
                    isSelected: false
                }
            });

            setAllCustomizerFields([...frozenFieldFromAllColumns, ...otherSelectedFieldFromAllColumns, ...allOtherFields]);
        }

    }, [isOpenPopover])

    const onColSelectStateChange = useCallback((col: ColumnCustomizerField) => {
        if(col.isColumnFreezed) {
            return;
        }
        // update the state 
        setAllCustomizerFields((prev) =>
            prev.map((item) =>
                item.id === col.id ? { ...item, isSelected: !item.isSelected } : item
            )
        );

        if (!col.isSelected) {
            setOtherSelectedColumnsList((prev) => [...prev, allColumnsAsMapWithId[col.id]]);
        } else {
            setOtherSelectedColumnsList((prev) => prev.filter((field) => field.id !== col.id));
        }
    }, []);

    const onFrozenStateChange = useCallback((col: ColumnCustomizerField) => {
        if (col.isColumnFreezed) {
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
    }, []);

    const onRemoveColumn = useCallback((col: ColumnCustomizerField)=> {
        // update the otherSelectedColumnList
        onColSelectStateChange(col);
    }, []);

    const handleCancel = useCallback(() => {
        // Reset to initial props state
        setFrozenColumnList([...copiedFrozenColumns]);
        setOtherSelectedColumnsList([...copiedOtherSelectedColumns]);
        // reset to empty array, as this will get recomputed, in useEffect once the popover open again
        setAllCustomizerFields([]);
        setIsOpenPopover(false);
        
    }, [copiedFrozenColumns, copiedOtherSelectedColumns]);

    const handleUpdate = () => {
        console.log("Selected fields with state =>", frozenColumnList, otherSelectedColumnsList);
        onUpdate({ frozenColumns: [...frozenColumnList], otherSelectedColumns: [...otherSelectedColumnsList] });
        setIsOpenPopover(false);
    }

    return (
        <div className='absolute right-0 z-10 flex items-center justify-center shadow-md bg-card-background rounded hover:bg-card-hover'>
            <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
                <PopoverTrigger className='w-9 h-9 top-2 cursor-pointer flex justify-center items-center'>
                    <SettingsIcon color='var(--color-icon-primary)' className='w-5 h-5' />
                </PopoverTrigger>
                <PopoverContent align='end' className='-mr-2 w-[450px] p-0'>
                    <div className='flex flex-col text-prop'>
                        {/* header */}
                        <div className='p-4 border-b border-primary-border'>
                            <h3 className='font-semibold'>Add / Remove and Reorder columns</h3>
                        </div>
                        <div className='max-h-[300px] flex gap-4'>
                            {/* Search and field list  */}
                            <div className='flex flex-col w-1/2 border-r border-primary-border py-2'>
                                <div className='px-4 py-2'>
                                    <input type="text" placeholder='search column...' className='w-full' />
                                </div>
                                <ul className='flex-1 overflow-y-auto px-4'>
                                    {
                                        allCustomizerFields.map((col) => {
                                            return (
                                                <li key={`all-customizer-field-${col.id}`} className='py-1 mt-1 text-prop'>
                                                    <div className='flex items-top gap-2'>
                                                        <Checkbox id={col.id} className='mt-0.5' checked={col.isSelected} disabled={col.isColumnFreezed} onCheckedChange={() => onColSelectStateChange(col)}  />
                                                        <label className={`align-top wrap-anywhere all-customizer-field-${col.id} ${col.isColumnFreezed ? 'cursor-not-allowed': 'cursor-pointer'}`} htmlFor={`${col.id}`}>{col.label}</label>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                            </div>
                            {/* selected field list */}
                            <div className='w-1/2 flex flex-col  py-2'>
                                <div className='overflow-y-auto flex-1 pr-4 pb-2'>
                                    {/* frozzen column list */}
                                    {
                                        frozenFieldFromAllColumns.map((col) => {
                                            return (
                                                <CustomizerFieldItem 
                                                    key={`frozen-field-${col.id}`}
                                                    column={col}
                                                    onFreezeStateChange = {onFrozenStateChange}
                                                    onRemoveColumn = {onRemoveColumn} />
                                            )
                                        })
                                    }

                                    {/* reorderable columns */}
                                    {
                                        otherSelectedFieldFromAllColumns.map((col) => {
                                            return (
                                                <CustomizerFieldItem 
                                                    key={`other-selected-field-${col.id}`}
                                                    column={col}
                                                    onFreezeStateChange = {onFrozenStateChange}
                                                    onRemoveColumn = {onRemoveColumn} />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {/* action */}
                        <div className='flex justify-end gap-2 p-4 bg-card-background'>
                            <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                            <Button type="button" onClick={handleUpdate}>Update</Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ColumnCustomizerV1;