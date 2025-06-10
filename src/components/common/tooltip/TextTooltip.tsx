import { type ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
interface TextTooltipProps {
    children: ReactNode;
    tooltipText: string;
    asChild?: boolean;
}
export const TextTooltip = ( {children, tooltipText, asChild }: TextTooltipProps) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild={ asChild }>
            { children}
        </TooltipTrigger>
        <TooltipContent>
            {tooltipText}
        </TooltipContent>
    </Tooltip>
  )
}
