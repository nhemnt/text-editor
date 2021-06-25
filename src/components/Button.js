import React from 'react'

const Button = ({ children, className, cmd, editorRef, ...rest }) => {
  const execCmd = (command) => {
    if (editorRef) {
      editorRef().execCommand(command, false, null);  
    }
    
  };
  return (
    <button
      className={`mr-2 ${className ?? ''}`}
      {...rest}
      onClick={() => {execCmd(cmd)} }
    >
      {children}
    </button>
  )
}

export default Button
