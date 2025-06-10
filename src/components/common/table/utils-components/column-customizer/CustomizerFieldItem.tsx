import React, { useState } from 'react'
import type { ColumnCustomizerField } from './ColumnCustomizer'
import { Checkbox } from '@/components/common/Checkbox'
import Button from '@/components/common/Button'
import { LockIcon } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/common/tooltip/Tooltip';


interface CustomizerFieldItemProps {
    column: ColumnCustomizerField,
    onRemoveColumn: (column: ColumnCustomizerField) => void,
    onFreezeStateChange: (column: ColumnCustomizerField) => void,
}

const CustomizerFieldItem = ({ column, onRemoveColumn, onFreezeStateChange }: CustomizerFieldItemProps) => {
    const [isMouseHover, setIsMouseHover] = useState(false);
    const onMouseEnter = () => {
        setIsMouseHover(true)
    }

    const onMouseLeave = () => {
        setIsMouseHover(false);
    }
  return (
    <div className={`flex items-top gap-2 border border-primary-border rounded p-2`}
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Checkbox checked={column.isSelected} disabled={column.isColumnFreezed} className='mt-0.5' />
        <span className='align-top flex-1'>{column.label}</span>
        <div className=''>
            {
                column.isColumnFreezed && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(column)}> 
                                <LockIcon className='w-4 h-4 shrink-0' color={isMouseHover ? 'var(--color-icon-danger)': 'currentColor'}/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Unfreeze Column
                        </TooltipContent>
                    </Tooltip>
                )
            }

            {
                isMouseHover && !column.isColumnFreezed && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(column)}> 
                                <LockIcon className='w-4 h-4 shrink-0' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Freeze Column
                        </TooltipContent>
                    </Tooltip>
                    
                )
            }
        </div>

    </div>
  )
}

export default CustomizerFieldItem