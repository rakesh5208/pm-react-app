import { useCallback, useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../Popover'
import type { ColumnDef } from '@tanstack/react-table'
import { GripVerticalIcon, LockIcon, LockKeyholeIcon, LockKeyholeOpenIcon, LockOpenIcon, Settings as SettingIcon, XIcon } from 'lucide-react';
import Button from '@/components/common/Button';
import { Checkbox } from '../../../Checkbox';

type ColumnCustomizerField = {
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

interface SelectCustomizerItemProps {
    customizerField: ColumnCustomizerField,
    onRemoveColumn: (customizerField: ColumnCustomizerField) => void,
    onFreezeStateChange: (customizerField: ColumnCustomizerField) => void,
}

const SelectCustomizerItem = ({ customizerField, onRemoveColumn, onFreezeStateChange }: SelectCustomizerItemProps) => {
    const [isMouseHover, setIsMouseHover] = useState(false);

    const onMouseEnter = () => {
        setIsMouseHover(true)
    }

    const onMouseLeave = () => {
        setIsMouseHover(false);
    }
    return (
        <li key={customizerField.id} className='flex items-center gap-0.5' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className='hover:cursor-move'>
                <GripVerticalIcon className='w-4 h-4 shrink-0' />
            </div>
            <div className='flex-1 p-2 border border-primary-border mt-1 rounded text-prop flex items-center gap-2'>
                <span className='flex-1'>{customizerField.label}</span>
                {isMouseHover && (
                    <>
                        {customizerField.isColumnFreezed
                            ? <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(customizerField)}> <LockOpenIcon className='w-4 h-4 shrink-0' /></Button>
                            : <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(customizerField)}> <LockIcon className='w-4 h-4 shrink-0' /></Button>
                        }
                        <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onRemoveColumn(customizerField)}> <XIcon className='w-4 h-4 shrink-0' /></Button>
                    </>
                )}
            </div>
        </li>
    )
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
                    <SettingIcon color='var(--color-icon-primary)' className='w-5 h-5' />
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
                                <p className='font-medium px-4 py-2'>Add / Remove Columns</p>
                                <div className='px-4 py-2'>
                                    <input type="text" placeholder='search column...' className='w-full' />
                                </div>
                                <ul className='flex-1 overflow-y-auto px-4'>
                                    {
                                        allCustomizerFields.map((col) => {
                                            return (
                                                <li key={col.id} className='py-1 mt-1 text-prop' onClick={() => onColSelectStateChange(col)}>
                                                    <div className={`flex items-top gap-2 ${col.isColumnFreezed ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                                        <Checkbox checked={col.isSelected} disabled={col.isColumnFreezed} className='mt-0.5' />
                                                        <span className='align-top'>{col.label}</span>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                            </div>
                            {/* selected field list */}
                            <div className='w-1/2 flex flex-col'>
                                <p className='font-medium pr-4 py-2'>Reorder Columns</p>
                                <ol className='list-decimal overflow-y-auto flex-1 pr-4 pb-2'>
                                    {/* frozzen column list */}
                                    {
                                        frozenFieldFromAllColumns.map((col) => {
                                            return (
                                                <li key={col.id} className='p-2 border border-primary-border mt-1 rounded text-prop'>
                                                    <div className='flex items-top gap-1 '>
                                                        <span className='flex-1'>{col.label}</span>
                                                        <LockKeyholeIcon className='w-4 h-4 shrink-0 mt-0.5' />
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }

                                    {/* reorderable columns */}
                                    {
                                        otherSelectedFieldFromAllColumns.map((col) => {
                                            return (
                                                <SelectCustomizerItem 
                                                    key={col.id}
                                                    customizerField={col}
                                                    onFreezeStateChange = {onFrozenStateChange}
                                                    onRemoveColumn = {onRemoveColumn} />
                                            )
                                        })
                                    }
                                </ol>
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