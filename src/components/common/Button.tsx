import React, { type ComponentProps } from 'react'

const Button:React.FC<ComponentProps<"button">> = ( props ) => {
  return (
    <button type="button" {...props } />
  )
}

export default Button