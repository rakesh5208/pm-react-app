"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { classNameMerge } from "@/utils/class-name-merge"

const defaultStyleClass = 'peer border-input data-[state=checked]:bg-primary-nav-background data-[state=checked]:text-primary-nav-foreground data-[state=checked]:border-primary-nav-background focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
 const isChecked = checked === 'indeterminate' ? false : checked;
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={classNameMerge(
        defaultStyleClass,
        className
      )}
      checked = { isChecked }
      onCheckedChange = { onCheckedChange }
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
