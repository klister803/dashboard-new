import { useState } from 'react'

const Button = ({ 
  children, 
  className, 
  style = {}, 
  hoverStyle = {}, 
  onClick, 
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className={className}
      style={{
        backgroundColor: 'transparent',
        cursor: 'pointer',
        ...style,
        ...(isHovered ? hoverStyle : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
