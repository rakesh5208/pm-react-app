import { flexRender } from '@tanstack/react-table'
import type { TableBodyProps } from '../../../types/table'
import { getColumnPinnedStyle } from './table-helper'

const TableBody = <T,>({ tableInstance }: TableBodyProps<T>) => {
    return (
        <tbody>
            {
                tableInstance
                    .getRowModel()
                    .rows.map((row) => {
                        return (
                            <tr key={row.id} className='border-b border-primary-border hover:bg-card-background'>
                                {
                                    row.getVisibleCells().map((cell) => {
                                        return (
                                            <td key={cell.id} className='py-3 px-2 text-page-secondary-foreground bg-page-background' style={{...getColumnPinnedStyle<T>(cell.column)}}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>)
                                    })
                                }

                            </tr>
                        )
                    })
            }

        </tbody>
    )
}

export default TableBody;