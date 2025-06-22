import type { ColumnCustomizerField } from "./ColumnCustomizerV1";

import Button from "@/components/common/Button";

import { forwardRef, useState, type CSSProperties } from "react";
import { GripVerticalIcon, LockIcon, XIcon } from "lucide-react";
import { TextTooltip } from "@/components/common/tooltip/TextTooltip";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { classNameMerge } from "@/utils/class-name-merge";

interface SelectedColumnBase {
  id: string;
  column: ColumnCustomizerField;
  style?:CSSProperties;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleProps: any; // this props will be used to add the draggable icon ref so that this will, if full container, no need of this
  listeners: SyntheticListenerMap; // this props will be used to add the draggable listners either in drag handle icon or in container
  onRemoveColumn: (column: ColumnCustomizerField) => void;
  onFreezeStateChange: (column: ColumnCustomizerField) => void;
}

export type SelectedColumnProps = SelectedColumnBase;


const SelectedColumn = forwardRef<HTMLDivElement, SelectedColumnProps>(({
  id,
  column,
  handleProps,
  className,
  listeners,
  style,
  ...props
}, ref) => {
  const {onRemoveColumn, onFreezeStateChange, ...restProps} = props;
  const [isMouseHover, setIsMouseHover] = useState(false);

  const onMouseEnter = () => {
    setIsMouseHover(true);
  };

  const onMouseLeave = () => {
    setIsMouseHover(false);
  };
  return (
    <div
      id={id}
      ref = {ref}
      className={classNameMerge("bg-page-background flex items-center gap-0.5", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
      {...restProps}
    >
      <div className="hover:cursor-move">
        <GripVerticalIcon className="w-4 h-4 shrink-0" {...handleProps } {...listeners}/>
      </div>
      <div className="flex-1 p-2 border border-primary-border mt-1 rounded text-prop flex items-center gap-1">
        <span className="flex-1 wrap-anywhere">{column.label}</span>
          <div className="w-9 flex gap-1 items-center justify-end">
            {column.isColumnFreezed && (
              <TextTooltip asChild={true} tooltipText="Unlock Column">
                <Button
                  variant="transparent"
                  className="w-4 h-4 p-0"
                  onClick={() => onFreezeStateChange(column)}
                >
                  <LockIcon
                    className="w-4 h-4 shrink-0"
                    color={
                      isMouseHover ? "var(--color-icon-danger)" : "currentColor"
                    }
                  />
                </Button>
              </TextTooltip>
            )}

            {isMouseHover && !column.isColumnFreezed && (
              <>
                {/* freeze column */}
                <TextTooltip asChild={true} tooltipText="Lock Column">
                  <Button
                    variant="transparent"
                    className="w-4 h-4 p-0"
                    onClick={() =>onFreezeStateChange(column)}
                  >
                    <LockIcon className="w-4 h-4 shrink-0" />
                  </Button>
                </TextTooltip>
                {/* remove column */}
                <TextTooltip asChild={true} tooltipText="Remove Column">
                  <Button
                    variant="transparent"
                    className="w-4 h-4 p-0"
                    onClick={() => onRemoveColumn(column)}
                  >
                    <XIcon className="w-4 h-4 shrink-0" />
                  </Button>
                </TextTooltip>
              </>
            )}
          </div>
      </div>
    </div>
  );
});


export default SelectedColumn;
