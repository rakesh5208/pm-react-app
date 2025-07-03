import React, { useMemo } from "react";
import type { ColumnCustomizerField } from "./ColumnCustomizerV1";
import DragDropSortable from "@/components/common/drag-drop-sortable/DragDropSortable";
import CustomizerFieldItem from "./SelectedColumn";
interface SelectedColumnsPropType {
  title?:string;
  name:string;
  columns: ColumnCustomizerField[];
  onRemoveColumn: (column: ColumnCustomizerField) => void;
  onFreezeStateChange: (column: ColumnCustomizerField) => void;
  onDropAndSort: (columns: ColumnCustomizerField[]) => void;
}
export const SelectedColumns: React.FC<SelectedColumnsPropType> = ({
  title,
  name,
  columns,
  onRemoveColumn,
  onFreezeStateChange,
  onDropAndSort
}: SelectedColumnsPropType) => {

  const items = useMemo(() => [...columns], [columns]);

    // add as forward ref to make it compatible with dnd-kit, useMemo to avoid re-creation
    const SortableSelectedColumn = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.forwardRef<HTMLDivElement, any>((props, ref) => {
        const { item, style, className, handleProps, listeners, ...restProps } =
          props;
        return (
          <CustomizerFieldItem
            ref={ref}
            column={item as ColumnCustomizerField}
            style={style}
            className={className}
            handleProps={handleProps}
            listeners={listeners}
            onFreezeStateChange={onFreezeStateChange}
            onRemoveColumn={onRemoveColumn}
            {...restProps}
          />
        );
      });
    }, []);

  return (
    <div className="border-b border-dashed border-primary-border pb-4">
      { title && <h3 className="font-semibold p-2"> {title} </h3> }
      <DragDropSortable<ColumnCustomizerField>
        dragOverlayStyle = {{padding: '4px', radius: '4px'}}
        items={items} 
        name={name} 
        onReorder={onDropAndSort}
        SortableItemComponent={SortableSelectedColumn}/>
    </div>
  );
};

export default SelectedColumns;
