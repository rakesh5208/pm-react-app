import { flexRender } from '@tanstack/react-table'
import type { TableHeaderProps } from '../../../types/table';
import { getColumnPinnedStyle } from './table-helper';

const TableHeader = <T,>({ tableInstance }: TableHeaderProps<T>) => {
    return (<thead>
        {
            tableInstance.getHeaderGroups().map((headerGroups) => {
                return (
                    <tr key={headerGroups.id} className='border-b border-primary-border'>
                        {
                            headerGroups.headers.map((header) => {
                                return (<th key={header.id} style={{...getColumnPinnedStyle<T>(header.column)}} className='text-left py-3 px-2 bg-page-background text-nowrap overflow-hidden text-ellipsis font-medium'>
                                    {
                                        header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                    }
                                </th>)
                            })
                        }
                    </tr>
                )
            })
        }
    </thead>
    );
}

export default TableHeader;