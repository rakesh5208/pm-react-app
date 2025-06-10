import type { ColumnCustomizerField } from './ColumnCustomizerV1';

import Button from '@/components/common/Button';

import { useState } from 'react';
import { GripVerticalIcon, LockIcon, XIcon } from 'lucide-react';
import { TextTooltip } from '@/components/common/tooltip/TextTooltip';


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
        <div className='flex items-center gap-0.5' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className='hover:cursor-move'>
                <GripVerticalIcon className='w-4 h-4 shrink-0' />
            </div>
            <div className='flex-1 p-2 border border-primary-border mt-1 rounded text-prop flex items-center gap-1'>
                <span className='flex-1 wrap-anywhere'>{column.label}</span>
                <div className='w-9 flex gap-1 items-center justify-end'>
                    {
                        column.isColumnFreezed && (
                            <TextTooltip asChild={true} tooltipText='Unfreeze Column'>
                                <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(column)}> 
                                    <LockIcon className='w-4 h-4 shrink-0' color={isMouseHover ? 'var(--color-icon-danger)': 'currentColor'}/>
                                </Button>
                            </TextTooltip>
                        )
                    }

                    {
                        isMouseHover && !column.isColumnFreezed && (

                            <>
                                {/* freeze column */}
                                <TextTooltip asChild={true} tooltipText='Freeze Column'>
                                    <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onFreezeStateChange(column)}> 
                                        <LockIcon className='w-4 h-4 shrink-0' />
                                    </Button>
                                </TextTooltip>
                                {/* remove column */}
                                <TextTooltip asChild={true} tooltipText='Remove Column'>
                                    <Button variant="transparent" className='w-4 h-4 p-0' onClick={() => onRemoveColumn(column)}>
                                        <XIcon className='w-4 h-4 shrink-0' />
                                    </Button>
                                </TextTooltip>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CustomizerFieldItem