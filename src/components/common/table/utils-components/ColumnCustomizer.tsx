import { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../Popover'
import type { ColumnDef } from '@tanstack/react-table'
import { Settings as SettingIcon } from 'lucide-react';
import Button from '@/components/common/Button';

interface ColumnCustomizerProps<T> {
    allColumnMap:Record<string, ColumnDef<T>>,
    selectedColumns: Array<ColumnDef<T>>
}

const ColumnCustomizer = <T, >({ allColumnMap, selectedColumns}: ColumnCustomizerProps<T>) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const allColumnsSortedOrder= useMemo(() => {
    return Object.values(allColumnMap)
  }, [allColumnMap]);

  const handleCancel = () => {
    setIsOpenPopover(false);
  }
  
  const handleUpdate = () => {

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
                            <div className='px-4 py-2'>
                                <input type="text" placeholder='search column...' className='w-full'/>
                            </div>
                            <ul className='flex-1 overflow-y-auto px-4'>
                                {
                                    allColumnsSortedOrder.map((col) => {
                                        return (
                                            <li key={col.id} className='py-1 mt-1 rounded text-prop'>
                                                {col.header?.toString()}
                                            </li>
                                        )
                                    })
                                }
                            </ul>

                        </div>
                        {/* selected field list */}
                        <div className='w-1/2 flex flex-col'>
                            <p className='font-medium pr-4 py-2'> Selected Columns ({selectedColumns.length})</p>
                            <ul className='overflow-y-auto flex-1 pr-4 pb-2'>
                                {
                                    selectedColumns.map((col) => {
                                        return (
                                            <li key={col.id} className='p-2 border border-primary-border mt-1 rounded text-prop'>
                                                {col.header?.toString()}
                                            </li>
                                        )
                                    })
                                }
                                {
                                    selectedColumns.map((col) => {
                                        return (
                                            <li key={col.id} className='p-2 border border-primary-border mt-1 rounded text-prop'>
                                                {col.header?.toString()}
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