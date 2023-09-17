import React, {useEffect, useState} from 'react'
import styles from './MeissnerGridCell.module.scss'
import cn from 'classnames'
import type {ChargeCodes} from '@/components/utils'


interface GridCellProps {
  value?: any
  children?: any
  columnType?: string
  columnName: string
  rowIndex?: number
  columnIndex?: number
  width?: string | number
  className?: string
  readOnly?: boolean
  isLookup?: boolean
  step?: number | null
  isAll?: boolean
  defaultValue?: string | number | Date | null
  dataId?: string | number | null
  dataType?: string
  tableContainerRef?: React.MutableRefObject<HTMLDivElement>
  chargeCodes?: Partial<ChargeCodes>[]
  onUpdate?: (
    actionType: string,
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

export function MeissnerGridCell({
  value,
  columnName,
  rowIndex,
  columnIndex,
  width,
  className = '',
  tableContainerRef,
  columnType,
  chargeCodes,
  readOnly = false,
  onUpdate,
}: GridCellProps) {
  const tableName = tableContainerRef?.current?.getAttribute('data-table-name')
  const objectTypeLower = tableName ? tableName.charAt(0).toLowerCase() + tableName.slice(1) : ''

  if (columnName === 'amount' && (value === '' || !value)) {
    value = '0'
  }
  columnName = columnName.replace(' expand_more', '').replace(' expand_less', '')
  const [inputValue, setInputValue] = useState(value)

  const [isHovered, setIsHovered] = useState(false)

  function handleMouseEnter() {
    setIsHovered(true)
  }

  function handleMouseLeave() {
    setIsHovered(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      parseInt(event.target.value).toString() !== event.target.value &&
      columnType === 'number' &&
      event.target.value !== '' &&
      (event.target.value.match(/\./g) || []).length > 1
    ) {
      return
    }

    let newValue = event.target.value


    if (columnType === 'Date') {
      if (/^\d{6}$/.test(newValue)) {
        const lastTwoDigits = newValue.slice(4, 6);
        if (lastTwoDigits !== '19' && lastTwoDigits !== '20') {
          newValue = `${parseInt(newValue.slice(0, 2))}/${parseInt(newValue.slice(2, 4))}/20${lastTwoDigits}`;
        }
      }
      if (/^\d{8}$/.test(newValue)) {
        newValue = `${parseInt(newValue.slice(0, 2))}/${parseInt(newValue.slice(2, 4))}/${newValue.slice(4, 8)}`;
      }
    }

    setInputValue(newValue)
    onUpdate && onUpdate('change', event, newValue, rowIndex, columnIndex, columnName, objectTypeLower)
  }



  function handleClear(event: React.MouseEvent<HTMLSpanElement>) {
    event.preventDefault()
    setInputValue('')
    onUpdate && onUpdate('clear', event, '', rowIndex, columnIndex, columnName, objectTypeLower)
  }

  function getTextColor(value: any): string {
    if (columnType === 'Date') {
      if ((inputValue as string).length < 6 && inputValue !== '' && (inputValue.match(/\//g) || []).length !== 2) {
        return 'pink'
      }
    }
    if (
      columnType === 'string' &&
      columnName.toLowerCase() === 'charge_code' &&
      chargeCodes && !chargeCodes.some((chargeCode) => chargeCode && chargeCode?.code === inputValue) &&
      inputValue !== ''
    ) {
      return 'pink'
    }
    return 'white'
  }
  return (
    <div
      className={cn(className, styles.cellContainer)}
      style={{width: width, display: 'flex'}}
      data-column-id={columnName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <input
        id={`${rowIndex}:${columnIndex}`}
        type={'text'}
        style={{
          display: 'flex',
          width: 'inherit',
          flexDirection: 'column',
          userSelect: 'none',
          color: getTextColor(value),
        }}
        value={inputValue ? inputValue : ''}
        data-column-id={columnIndex}
        data-row-id={rowIndex + 1}
        data-column-name={columnName}
        onChange={handleChange}
        readOnly={readOnly}
      />

      {isHovered &&
        inputValue !== '' &&
        !readOnly && (
          <span
            className={cn('material-symbols-outlined red', styles.hoverShow)}
            style={{fontSize: '13px'}}
            onMouseDown={handleClear}>
            close
          </span>
        )}
    </div>
  )
}
