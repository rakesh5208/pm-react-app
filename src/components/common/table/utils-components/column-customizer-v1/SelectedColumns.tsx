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

  return (
    <div className="border-b border-dashed border-primary-border pb-4">
      { title && <h3 className="font-semibold p-2"> {title} </h3> }
      <DragDropSortable<ColumnCustomizerField>
        dragOverlayStyle = {{padding: '4px', radius: '4px'}}
        items={items} 
        name={name} 
        onReorder={onDropAndSort}
        SortableItemComponent={(props) => {
          const { item, ref, style, className, listeners, ...restProps } = props;
          return (
            <CustomizerFieldItem 
              ref = {ref}
              column = {item}
              style = {style}
              className = {className}
              listeners = {listeners}
              onFreezeStateChange={onFreezeStateChange}
              onRemoveColumn={onRemoveColumn}
              {...restProps}
            /> 
          );
        }}/>
    </div>
  );
};

export default SelectedColumns;
