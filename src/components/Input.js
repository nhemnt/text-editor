import React, { useState} from 'react'

const Input = ({ className, onChange, ...rest }) => {
  const [val, setVal] = useState('');

  const handleInputChange = (e) => {
    setVal(e.target.value)
    onChange(e.target.value);
  }
  const reset = () => {
    setVal('');
  }
  return (
    <input className={`mr-2 ml-2 ${className ?? ''}`} {...rest} onChange={handleInputChange} value={val} onBlur={reset}/>
  )
}

export default Input
