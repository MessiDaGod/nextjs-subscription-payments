import styles from '@/components/dropdown/GenericDropdown.module.scss'
import {v4 as uuidv4} from 'uuid'
import cn from 'classnames'

interface Props {
  children?: React.ReactNode
  columnName: string
  rowIndex?: string
  width?: string
  minWidth?: string
  isAll?: boolean
  isNull?: boolean
  style?: React.CSSProperties;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    newValue: string,
    columnName: string
  ) => void
  onClickAll?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    newValue: string,
    columnName: string
  ) => void
}

export function DynamicGridTableCell({
  columnName,
  rowIndex,
  children,
  width,
  minWidth,
  isAll,
  isNull = false,
  style,
  onClick,
  onClickAll,
}: Props) {
  function handleOnClick(e, newValue) {
    if (e.target?.dataset === null) return
    if (e.target.dataset?.columnId !== null) {
      onClick && onClick(e, e.currentTarget.querySelector('input').value ?? '', columnName)
    }
  }

  function handleOnClickAll(e) {
    if (e.target?.dataset === null) return
    if (e.target.dataset?.columnId !== null) {
      onClickAll && onClickAll(e, e.currentTarget.querySelector('input').value ?? '', columnName)
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault() // prevent default scrolling behavior
      var newIdxArray = rowIndex.split('_')
      const rownum = newIdxArray[0]
      const colidx = newIdxArray[1]
      const currentCell = event.currentTarget
      const nextCellId = `${parseInt(rownum) + 1}_${colidx}`
      const nextCell = document.getElementById(`${columnName}${nextCellId}`)
      const input = nextCell ? (nextCell.querySelector('input') as HTMLInputElement) : null

      if (input) {
        input.focus()
      }
    }
  }

  function handleKeyUp(event) {
    if (event.key === 'ArrowUp') {
      event.preventDefault() // prevent default scrolling behavior
      var newIdxArray = rowIndex.split('_')
      const rownum = newIdxArray[0]
      const colidx = newIdxArray[1]
      const currentCell = event.currentTarget
      const nextCellId = `${parseInt(rownum) - 1}_${colidx}`
      const nextCell = document.getElementById(`${columnName}${nextCellId}`)
      const input = nextCell ? (nextCell.querySelector('input') as HTMLInputElement) : null

      if (input) {
        input.focus()
      }
    }
  }

  return (
    <div
      id={`${columnName}${rowIndex}`}
      key={uuidv4()}
      className={cn(styles['td'], isNull ? 'null' : 'notnull')}
      data-column-id={columnName}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={(e) => (isAll ? handleOnClickAll(e) : handleOnClick(e, ''))}
      style={{width: width ?? '100%', paddingLeft: '5px'}}>
      {children}
    </div>
  )
}
