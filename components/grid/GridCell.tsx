import React, {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker'
import {Log, tryParseDate} from '@/components/utils'

interface GridCellProps {
  value?: any
  children?: any
  columnType?: string
  columnName?: string
  rowIndex?: number
  columnIndex?: number
  width?: string | number
  className?: string
  readOnly?: boolean
  isLookup?: boolean
  step?: number | null
  isAll?: boolean
  defaultValue?: string | number | Date | null
  tableContainerRef?: React.MutableRefObject<HTMLDivElement>
  onUpdate?: (
    e: any,
    newValue: any,
    rowIndex: number,
    columnIndex: number,
    columnName: string,
    objectType: string
  ) => void
  handleClick?: (
    e: any,
    value: string | number | Date | null,
    rowIndex: number,
    columnIndex: number,
    isAll?: boolean
  ) => void
  handleDateChange?: (date: string, e: any, rowIndex: number, columnIndex: string | number) => void
}

export function GridCell({
  value,
  defaultValue,
  children,
  columnName,
  rowIndex,
  columnType,
  columnIndex,
  width,
  className,
  readOnly,
  isLookup,
  step,
  isAll,
  tableContainerRef,
  onUpdate,
  handleClick,
  handleDateChange,
}: GridCellProps) {
  const tableName = tableContainerRef?.current?.getAttribute('data-table-name')
  const objectTypeLower = tableName ? tableName.charAt(0).toLowerCase() + tableName.slice(1) : ''
  const [inputValue, setInputValue] = useState(value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
    onUpdate && onUpdate(event, event.target.value, rowIndex, columnIndex, columnName, objectTypeLower)
  }

  const handleDatePickerChange = (
    dateString: string,
    e: any,
    rowIndex: number,
    columnIndex: string | number
  ) => {
    const date = new Date(e)
    const formattedDate = date.toLocaleDateString('en-US')
    setInputValue(formattedDate)
    handleDateChange && handleDateChange(formattedDate, e, rowIndex, columnIndex)
  }

  return (
    <div
      className={className}
      style={{width: width}}
      // onClick={(e) => onClick(e, value.toString(), rowIndex, columnIndex)}
      data-column-id={columnName}>
      {columnType === 'number' && (
        <input
          type={columnType === 'number' ? 'number' : 'text'}
          style={{display: 'flex', width: 'inherit', flexDirection: 'column', userSelect: 'none'}}
          value={inputValue ? inputValue : 0}
          data-column-id={columnIndex}
          data-row-id={rowIndex + 1}
          onChange={handleChange}
          readOnly={readOnly}
          step={step ?? 100}
        />
      )}
      {columnType === 'string' && (
        <input
          type={'text'}
          style={{display: 'flex', width: 'inherit', flexDirection: 'column', userSelect: 'none'}}
          value={inputValue ? inputValue : ''}
          data-column-id={columnIndex}
          data-row-id={rowIndex + 1}
          onChange={handleChange}
          readOnly={false}
        />
      )}
      {columnType === 'date' && (
        <div data-row-id={rowIndex} data-column-id={columnIndex}>
          <DatePicker
            selected={
              tryParseDate(inputValue ? inputValue.toString() : '')
                ? new Date(tryParseDate(inputValue ? inputValue.toString() : ''))
                : null
            }
            onChange={(event) =>
              handleDatePickerChange(inputValue.toString() ?? '', event, rowIndex, columnIndex)
            }
            dateFormat={columnName.toLowerCase().includes('postmonth') ? 'MM/yyyy' : 'MM/dd/yyyy'}
            preventOpenOnFocus={true}
          />
        </div>
      )}
    </div>
  )
}
