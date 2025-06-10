import { classNameMerge } from '@/utils/class-name-merge';
import React, { type ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'transparent';

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant
}

const defaultStyleClass = 'flex items-center justify-center gap-1 h-9 px-4 py-2 border rounded font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-65';

const VariantClassMap: Record<ButtonVariant, string> = {
  'primary': 'bg-primary-nav-background text-primary-nav-foreground border-primary-nav-background hover:bg-primary-nav-hover-background hover:disabled:bg-primary-nav-background',
  'secondary': 'bg-transparent border-primary-nav-background text-page-foreground hover:bg-card-hover hover:disabled:bg-transparent',
  'transparent': 'bg-transparent border-none'
}

const Button:React.FC<ButtonProps> = ( { className, variant='primary', ...rest} ) => {
  
  return (
    <button type="button" {...rest } className={classNameMerge(defaultStyleClass, VariantClassMap[variant], className)}/>
  )
}

export default Button