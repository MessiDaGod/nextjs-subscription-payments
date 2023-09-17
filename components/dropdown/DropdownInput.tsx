import {useState} from 'react'
import {getHeaderValue} from 'components/utils'

interface DropdownInputProps {
  selectItem?: string
  value: string | null
  columnId?: string
  width?: string | number
  columnIndex?: number
  rowIndex?: number
  inputId?: string
  handleInputChange?: (newValue: any, columnId: string, rowIndex: number) => void
}
export function DropdownInput({
  selectItem = '',
  value,
  columnId = '',
  width = '',
  columnIndex,
  rowIndex = -1,
  inputId,
  handleInputChange,
}: DropdownInputProps) {
  const [inputValue, setInputValue] = useState(value)

  function onChange(e) {
    setInputValue(e.target.value)
    handleInputChange(e.target.value, columnId, rowIndex)
  }

  return (
    <input
      id={inputId}
      data-column-id={columnIndex}
      data-row-id={rowIndex}
      style={{display: 'flex', width: '100%', flexDirection: 'column', userSelect: 'none'}}
      placeholder={getHeaderValue(selectItem)}
      value={inputValue === null ? '' : inputValue.toString()}
      readOnly={true}
      onChange={onChange}
      type="text"
    />
  )
}
