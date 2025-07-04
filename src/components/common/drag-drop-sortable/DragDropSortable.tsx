import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useState, type ComponentType } from "react";
import SortableItemWrapper from "./SortableItemWrapper";
import { createPortal } from "react-dom";

export type WithId<T> = T & { id: string | number };

const dragOverlayDefaultStyle = {
  background: 'var(--page-background)',
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};
interface DragDropSortableProps<T> {
  name: string;
  items: Array<WithId<T>>;
  dragOverlayStyle?: Record<string, string>;
  onReorder: (items: Array<WithId<T>>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SortableItemComponent: ComponentType<any>;
}

const DragDropSortable = <T,>({
  name,
  items,
  dragOverlayStyle = {},
  onReorder,
  SortableItemComponent,
}: DragDropSortableProps<T>) => {
  const [activeItem, setActiveItem] = useState<T | undefined>(undefined);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(
        (item: WithId<T>) => item.id === active.id
      );
      const newIndex = items.findIndex(
        (item: WithId<T>) => item.id === over?.id
      );
      return onReorder(arrayMove(items, oldIndex, newIndex));
    }
    setActiveItem(undefined);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeItem = items.find((item: WithId<T>) => item.id === active.id);
    setActiveItem(activeItem);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item) => {
          return (
            <SortableItemWrapper
              key={`${name}-${item.id}`}
              item={item}
              SortableItemComponent={SortableItemComponent}
            />
          );
        })}
      </SortableContext>

      {activeItem
        ? createPortal(
            <DragOverlay>
              <SortableItemComponent
                item={activeItem}
                style={{
                  ...dragOverlayDefaultStyle,
                  ...dragOverlayStyle,
                }}
              />
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
};

// style={{
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                         backgroundColor: 'white',
//                         borderRadius: '4px',
//                         padding: '8px',
//             }}

export default DragDropSortable;
