import { useMemo } from 'react'
import type { CellComponentProps } from '../../types/table';

const DefaultCell = <TData, TValue, >( props: CellComponentProps<TData, TValue> ) => {
  const formattedValue = useMemo(() => {
    const value = props.getValue?.();
    const fallbackValue = props.defaultValue || '--';
    return (value || fallbackValue) as string; // cast the value as string;
  }, [props]);
  
  return (
    <div className='w-full text-nowrap overflow-hidden text-ellipsis'> { formattedValue }</div>
  )
}

export default DefaultCell;