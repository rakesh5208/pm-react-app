import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WithId } from "./DragDropSortable";
import type { ComponentType } from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export type SortableItemComponetProps<T> = {
  ref: (node: HTMLElement | null) => void;
  handleProps: { ref: (node: HTMLElement | null) => void }
  item: WithId<T>;
  className?:string;
  isDragging?:boolean;
  style?: React.CSSProperties;
  listeners?: SyntheticListenerMap
};

export type SortableItemProps<T> = {
  item: WithId<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SortableItemComponent: ComponentType<SortableItemComponetProps<T>>;
};

// const DRAGGING_CLASS_NAME = 'relative z-10 shadow-lg p-2 shrink-0 rounded'
const DRAGGING_CLASS_NAME = 'opacity-30'

const SortableItemWrapper = <T,>({
  item,
  SortableItemComponent,
}: SortableItemProps<T>) => {
  const {
    listeners,
    attributes,
    setNodeRef,
    setActivatorNodeRef, // this will be used when the any handle icon only used for the dragging
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, data: item });

  console.log("transform >>", transform, transition);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <SortableItemComponent
      ref={setNodeRef}
      handleProps={{ ref: setActivatorNodeRef }}
      item={item}
      style={style}
      isDragging = {isDragging}
      className = {isDragging ? DRAGGING_CLASS_NAME: ''}
      listeners={listeners} // this for the drag listeners, either in handle icon or full
      {...attributes}
    />
  );
};

export default SortableItemWrapper;
