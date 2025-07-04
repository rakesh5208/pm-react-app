import { useCallback, useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../Popover'
import type { ColumnDef } from '@tanstack/react-table'
import Button from '@/components/common/Button';

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

const ColumnCustomizer = <T,>({ allColumns, frozenColumns, otherSelectedColumns, onUpdate }: ColumnCustomizerProps<T>) => {
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
    }, [])

    const onRemoveColumn = useCallback((col: ColumnCustomizerField)=> {
        // update the otherSelectedColumnList
        onColSelectStateChange(col);
    }, []);

    const handleCancel = useCallback(() => {
    // Reset to initial props state
    setFrozenColumnList([...copiedFrozenColumns]);
    setOtherSelectedColumnsList([...copiedOtherSelectedColumns]);

    // Rebuild allCustomizerFields if you moved it to state
    const resetFields: ColumnCustomizerField[] = copiedAllColumns.map((col) => {
        const isFreezed = copiedFrozenColumns.some(frozen => frozen.id === col.id);
        const isSelected = isFreezed || copiedOtherSelectedColumns.some(selected => selected.id === col.id);
        return {
            id: col.id || '',
            label: col.header?.toString() || '',
            isColumnFreezed: isFreezed,
            isSelected,
            };
        });
        
        setAllCustomizerFields([...frozenFieldFromAllColumns, ...otherSelectedFieldFromAllColumns, ...resetFields]);

        // Close the popover
        setIsOpenPopover(false);
    }, [copiedFrozenColumns, copiedOtherSelectedColumns, copiedAllColumns]);

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
                <PopoverContent align='end' className='-mr-2 w-[300px] p-0'>
                    <div className='flex flex-col text-prop'>
                        {/* header */}
                        <div className='p-4 border-b border-primary-border'>
                            <h3 className='font-semibold'>Add/Remove and reorder columns</h3>
                        </div>
                        <div className='max-h-[300px] flex gap-4'>
                            {/* Search and field list  */}
                            <div className='flex flex-col w-full p-2'>
                                <div className='px-4 py-2'>
                                    <input type="text" placeholder='search column...' className='w-full' />
                                </div>
                                
                                {/* list of fozen columns, */}
                                <ul>

                                </ul>

                                {/* list of other selected columns */}
                                <ul>

                                </ul>

                                <div className='flex flex-col gap-2 flex-1 overflow-y-auto px-4 p-2'>
                                    {
                                        allCustomizerFields.map((col) => {
                                            return (
                                                <CustomizerFieldItem 
                                                    key={col.id}
                                                    column={ col }
                                                    onRemoveColumn={ onRemoveColumn }
                                                    onFreezeStateChange={ onFrozenStateChange }
                                                />
                                                // <li key={col.id} className='py-1 mt-1 text-prop' onClick={() => onColSelectStateChange(col)}>
                                                //     <div className={`flex items-top gap-2 border border-primary-border rounded p-2 ${col.isColumnFreezed ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                //         <Checkbox checked={col.isSelected} disabled={col.isColumnFreezed} className='mt-0.5' />
                                                //         <span className='align-top'>{col.label}</span>
                                                //     </div>
                                                // </li>
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

export default ColumnCustomizer;