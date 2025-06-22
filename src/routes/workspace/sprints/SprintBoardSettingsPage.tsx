import { DragDropSortable } from "@/components/common/drag-drop-sortable"
import { Popover, PopoverTrigger } from "@/components/common/Popover";
import { classNameMerge } from "@/utils/class-name-merge";
import { PopoverContent } from "@radix-ui/react-popover";
import { SettingsIcon } from "lucide-react";
import { forwardRef, useState } from "react";
const priorites = ['low', 'medium', 'high', 'urgent']
const statuses = ['open', 'inprogress', 'done'];
const tasks = new Array(50).fill(-1).map((_, index) => {
  const random = Math.random();
  const randomPriority = priorites[Math.floor(random * priorites.length)]
  const randomStatus = statuses[Math.floor(random * statuses.length)]
  return {
    id: index+1,
    title: 'This is sample task: ' + index,
    priority: randomPriority,
    status: randomStatus
  }
})

const DraggableItem = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { style, item,  className, listeners, ...restProps  } = props;
  return (
    <div 
      ref = {ref} 
      style={style}
      className={classNameMerge(
          "bg-page-background p-4 rounded border border-primary-border mb-3 cursor-grab",
          className
        )}
      {...listeners}
      {...restProps} >
      <div className="flex flex-col gap-4">
        <h1>{item.title}</h1>
        <div className="flex gap-2">
          <div className="p-2 border border-primary-border rounded">{item.priority}</div>
          <div className="p-2 border border-primary-border rounded">{item.status}</div>
        </div>
      </div>
    </div>
  )
});
const SprintBoardSettingsPage = () => {
  const [openItems, setOpenItems] = useState(tasks.filter((task) => task.status === 'open'));
  const [inprogressItems, setInProgressItems] = useState(tasks.filter((task) => task.status === 'inprogress'));
  const [doneItems, setDoneItems] = useState(tasks.filter((task) => task.status === 'done'));
  const [allItems, setAllItems] = useState([...tasks]);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  return (
    <div className="">
        <div className="flex justify-end">
          <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
            <PopoverTrigger className="top-2 cursor-pointer p-2 mb-2 flex flex-center gap-2 border border-primary-border rounded ">
              <SettingsIcon color="var(--color-icon-primary)" className="w-5 h-5" />
              <span>Setting</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[450px] h-[400px] overflow-hidden my-1 border border-primary-border shadow-md rounded bg-card-background flex">
              {/* <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, sequi quisquam. Rem asperiores dolorem iure hic praesentium obcaecati, necessitatibus inventore deserunt amet laboriosam ab. Laboriosam voluptas similique vitae perferendis veniam!</p> */}
              <div className="w-1/2 overflow-y-auto p-4 h-full">
                <ul>
                  {
                    new Array(100).fill(-1).map((_, index) => (
                      <li className="bg-page-background p-2 mb-2 rounded">
                        <div>
                          <h3 className="semibold">This is item no. {index}</h3>
                        </div>
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div className="overflow-y-auto p-4 h-full">
                <DragDropSortable 
                  items={allItems}
                  name="normal-list"
                  onReorder={(items) => setAllItems(items)}
                  SortableItemComponent={DraggableItem}
                  />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-4 flex-1">
          <div className="overflow-hidden grow bg-card-background rounded flex flex-col gap-4 border border-primary-border">
              <h3 className="p-2 bg-page-background border-b border-primary-border font-semibold rounded-t flex items-center gap-2"> 
                <span>Open</span>
                <span className="border border-primary-border px-2 py-1 rounded">{openItems.length}</span>
              </h3>
              <div className="overflow-y-auto p-2 h-[500px]">
                <DragDropSortable 
                  items={openItems}
                  name="normal-list"
                  onReorder={(items) => setOpenItems(items)}
                  SortableItemComponent={DraggableItem}
                  />
              </div>
          </div>
          <div className="overflow-hidden grow bg-card-background rounded flex flex-col gap-4 border border-primary-border">
              <h3 className="p-2 bg-page-background border-b border-primary-border font-semibold rounded-t flex items-center gap-2"> 
                <span>In Progress</span>
                <span className="border border-primary-border px-2 py-1 rounded">{inprogressItems.length}</span>
              </h3>
              <div className="overflow-y-auto p-2 h-[500px]">
                <DragDropSortable 
                  items={inprogressItems}
                  name="normal-list"
                  onReorder={(items) => setInProgressItems(items)}
                  SortableItemComponent={DraggableItem}
                  />
              </div>
          </div>
          <div className="overflow-hidden grow bg-card-background rounded flex flex-col gap-4 border border-primary-border">
              <h3 className="p-2 bg-page-background border-b border-primary-border font-semibold rounded-t flex items-center gap-2"> 
                <span>Done</span>
                <span className="border border-primary-border px-2 py-1 rounded">{doneItems.length}</span>
              </h3>
              <div className="overflow-y-auto p-2 h-[500px]">
                <DragDropSortable 
                  items={doneItems}
                  name="normal-list"
                  onReorder={(items) => setDoneItems(items)}
                  SortableItemComponent={DraggableItem}
                  />
              </div>
          </div>
        </div>
    </div>
  )
}

export default SprintBoardSettingsPage