import {openDB, DBSchema} from 'idb'
import axios from 'axios'
import https from 'https'
import {CommercialEtlLeases, Payable} from './dataStructure'
import styles from '@/components/dropdown/GenericDropdown.module.scss'
import dayjs from 'dayjs'
import {property} from './Property'
import type { Database } from '@/types/supabase'
import {Account} from './Account'
import {Vendor} from './Vendor'
import datagridstyles from '@/components/DataGrid/DataGrid.module.scss'
import * as XLSX from 'xlsx'

export type Transetl = Database['public']['Tables']['transetl']['Row']

let ruler: HTMLElement | null = null

if (typeof document !== 'undefined') {
  ruler = document.createElement('div')
  ruler.style.cssText =
    'box-sizing: content-box; display: block; visibility: hidden; position: absolute; white-space: nowrap;'
  document.body.appendChild(ruler)
}

interface MyDB extends DBSchema {
  dimensions: {
    key: number
    value: Payable
  }
  dimension: {
    value: {
      name: string
      price: number
      productCode: string
    }
    key: number
    indexes: {'by-id': number}
  }
}

export interface IconWidths {
  [columnId: string]: number
}
export interface ColumnWidths {
  [columnId: string]: number
}

export interface ColumnDataTypes {
  [columnId: string]: string
  sortOrder?: string | null
}

export function hasOwnProperty(columnData: ColumnDataTypes): boolean {
  if (columnData == null) {
    return false
  }
  return Object.prototype.hasOwnProperty.call(columnData, columnData.columnId)
}

export function isRowEmpty<T>(row: T): boolean {
  if (!row) return true
  return Object.values(row).every(
    (value) =>
      value === null ||
      value === '' ||
      value === '0' ||
      value === '-1' ||
      value === '0.000000' ||
      value === 'NULL' ||
      value === 0
  )
}

export function isColumnHidden<T>(data: T[], columnName: string): boolean {
  if (Array.isArray(data)) {
    if (
      columnName.toLowerCase() === 'account' ||
      columnName.toLowerCase() === 'person' ||
      columnName.toLowerCase() === 'property'
    )
      return false
    const columnData = data.map((row) => row[columnName])
    return columnData.every(
      (value) =>
        value === null ||
        value === '' ||
        value === '0' ||
        value === '-1' ||
        value === '0.000000' ||
        value === 'NULL' ||
        value === '00000000-0000-0000-0000-000000000000' ||
        value === 0
    )
  } else {
    return true
  }
}

export function isColumnHiddenAll<T>(data: T[]): boolean {
  if (Array.isArray(data)) {
    for (const columnName in data[0]) {
      if (
        columnName.toLowerCase() === 'account' ||
        columnName.toLowerCase() === 'person' ||
        columnName.toLowerCase() === 'property'
      ) {
        continue
      }

      const columnData = data.map((row) => row[columnName])
      if (!columnData.every((value) => value === null || value === '' || value === 'NULL' || value === 'null')) {
        return false
      }
    }

    return true
  } else {
    return true
  }
}

export function parseValue(value: string): string {
  let newValue = value
  const regex = /batch (\d+)/i

  // Use the match() method to extract the number
  const match = value.toString().match(regex)

  if (match) {
    // Extract the number from the match result
    const batchNumber = 1100000000 + parseInt(match[1])

    // Create the hyperlink URL using string concatenation
    const hyperlinkUrl = 'http://192.168.1.117/VoyagerDev/pages/GlPayableBatch.aspx?Id=' + batchNumber

    // Output the hyperlink URL to the console
    newValue = hyperlinkUrl
  } else {
    newValue = value
  }
  return newValue
}
export function filterData<T>(data: T[]): T[] {
  if (!Array.isArray(data) || (Array.isArray(data) && data.length === 0)) return
  const propertyNames = Object.keys(data[0])
  const filteredData = [...data]

  // Iterate over each property
  for (const propertyName of propertyNames) {
    const hasNonNullValues = data.some((property) => property[propertyName] !== null)

    // If all values are null, remove the property from each object
    if (!hasNonNullValues) {
      for (const property of filteredData) {
        delete property[propertyName]
      }
    }
  }
  return removeTRowVersion(filteredData)
}

export function filterErrorData<T>(data: T[]): T[] {
  if (!Array.isArray(data) || (Array.isArray(data) && data.length === 0)) return data

  const propertyNames = Object.keys(data[0])
  const filteredData = [...data]
  var numPayables

  // Check if all values in the 'fieldvalue' column are empty strings
  const allEmptyFieldValues = filteredData.every((property) => property['fieldvalue'] === '')

  // If all values in 'fieldvalue' are empty, remove the column from each property
  if (allEmptyFieldValues) {
    for (const property of filteredData) {
      delete property['fieldvalue']
    }
  } else {
    // Iterate over each property
    for (const property of filteredData) {
      if (property['fieldvalue'] !== undefined && property['fieldvalue'].includes(':')) {
        numPayables = property['fieldvalue'].split(':')[property['fieldvalue'].split(':').length - 1]
      } else {
        numPayables = ''
      }
      delete property['fieldvalue']
    }

    for (const property of filteredData) {
      if (numPayables && property['errortext']) {
        const remainingText = property['errortext'].split('payables')[1]
        property['errortext'] = numPayables + ' payables' + remainingText
      }
    }
  }

  return filteredData
}

export function removeTRowVersion<T>(data: T[]): T[] {
  const filteredData = [...data]
  const tRowVersionIndex = data.findIndex((item) => Object.keys(item).some((key) => key.toLowerCase() === 'trowversion'))

  if (tRowVersionIndex >= 0) {
    const propertyName = Object.keys(data[tRowVersionIndex]).find((key) => key.toLowerCase() === 'trowversion')

    for (const item of filteredData) {
      delete item[propertyName as keyof T]
    }
  }

  return filteredData
}

export function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export function parseValueColumn(value: Object, columnName: string): Object {
  if (isNumber(value)) {
    return parseFloat((value as string).toString().trim())
  }
  if (
    !columnName.toLowerCase().includes('date') &&
    !columnName.toLowerCase().includes('post') &&
    !columnName.toLowerCase().includes('month') &&
    !columnName.toLowerCase().includes('movein') &&
    !columnName.toLowerCase().includes('from')
  )
    return value
  if (isNaN(Date.parse(value as string))) return value
  else {
    const actualDate = new Date(value as string)
    if (actualDate.getHours() === 0 && actualDate.getMinutes() === 0 && actualDate.getSeconds() === 0) {
      const formattedDate = `${actualDate.getMonth() + 1}/${actualDate.getDate()}/${actualDate.getFullYear()}`
      return formattedDate
    } else {
      return value
    }
  }
}

export class CustomError extends Error {
  name: string
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}

export async function PostInvoices(take: number | null = null) {
  try {
    let url = `https://localhost:5006/api/data/GetInvoices${take ? `?take=${encodeURIComponent(take)}` : ''}`
    const response = await fetch(url, {
      method: 'GET',
    })
    const result = await response.text()
    return JSON.parse(result)
  } catch (error) {
    return error
  }
}

export async function runSqlQuery(table: string, take: number) {
  const url = 'https://localhost:5006/api/data/RunSqlQuery'
  const params = {table, take}
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
  const fullUrl = `${url}?${queryString}`
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export function Log(message: any) {
  if (process.env.NODE_ENV !== 'development') return
  console.log(message)
}

export function LogError(message: any) {
  if (process.env.NODE_ENV !== 'development') return
  console.error(message)
}

export function LogWarn(message: any) {
  if (process.env.NODE_ENV !== 'development') return
  console.warn(message)
}

export function Time(name: any) {
  if (process.env.NODE_ENV !== 'development') return
  try {
    console.time(name)
  } catch (error) {
    if (((error as {message?: string})?.message ?? '').includes('already exists')) {
      console.timeEnd(name)
      console.time(name)
    }
  }
}
export function TimeEnd(name: any) {
  if (process.env.NODE_ENV !== 'development') return

  console.timeEnd(name)
}

export function isDate(dateString: string): boolean {
  const dateFormats = ['YYYY-MM-DD', 'MM-DD-YYYY', 'DD-MM-YYYY', 'YYYY/MM/DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'DD/MM/YY']

  for (const format of dateFormats) {
    const parsedDate = dayjs(dateString, format)
    if (parsedDate.isValid()) {
      return true
    }
  }

  return false
}

export function headerize(text: string): string {
  const wordsToCapitalize = ['date', 'num', 'post', 'month', 'tran', 'type']
  let result = text.toLowerCase()

  // Uppercase the first letter of each word
  result = capitalizeWords(result)

  for (const word of wordsToCapitalize) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    result = result.replace(regex, (match) => {
      return match.charAt(0).toUpperCase() + match.slice(1)
    })
  }

  return capitalizeAfterUnderscore(result)
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (match) => {
    return match.toUpperCase()
  })
}

function capitalizeAfterUnderscore(str: string): string {
  return str.replace(/(_[a-z])/g, (match) => {
    return match.toUpperCase().replace('_', '')
  })
}

export function paddingDiffY(col: HTMLElement): number {
  if (getStyleVal(col, 'box-sizing') === 'border-box') {
    return 0
  }
  const padTop = getStyleVal(col, 'padding-top')
  const padBottom = getStyleVal(col, 'padding-bottom')
  return parseInt(padTop) + parseInt(padBottom)
}

export function paddingDiff(col: HTMLElement | SVGSVGElement): number {
  // if (getStyleVal(col, 'box-sizing') === 'border-box') {
  //   return 0;
  // }
  const padding = getStyleVal2(col)
  return parseInt(padding.paddingLeft) + parseInt(padding.paddingRight)
}

export function getStyleVal(elm: HTMLElement, css: string): string {
  return window.getComputedStyle(elm, null).getPropertyValue(css)
}

export function getStyleVal2(elm: HTMLElement | SVGSVGElement): {
  paddingLeft: string
  paddingRight: string
} {
  // Get the computed styles for the element
  const styles = window.getComputedStyle(elm)

  // Get the value of padding-left and padding-right from the inline style
  const inlinePaddingLeft = elm.style.paddingLeft === '' ? '0' : elm.style.paddingLeft
  const inlinePaddingRight = elm.style.paddingRight === '' ? '0' : elm.style.paddingRight

  // Get the value of padding-left and padding-right from the computed styles
  const computedPaddingLeft = styles.paddingLeft ?? '0'
  const computedPaddingRight = styles.paddingRight ?? '0'

  // Use the value that a browser would use
  const cssText = elm.style.cssText
  const paddingLeftMatch = cssText.match(/padding-left:\s*(\d+(px|em|rem|pt|vh|vw|%));/i)
  const paddingRightMatch = cssText.match(/padding-right:\s*(\d+(px|em|rem|pt|vh|vw|%));/i)
  const paddingLeft = paddingLeftMatch ? parseInt(paddingLeftMatch[1], 10) : 0
  const paddingRight = paddingRightMatch ? parseInt(paddingRightMatch[1], 10) : 0
  const paddingLeft2 = inlinePaddingLeft ? parseInt(inlinePaddingLeft, 10) : parseInt(computedPaddingLeft, 10)
  const paddingRight2 = inlinePaddingRight ? parseInt(inlinePaddingRight, 10) : parseInt(computedPaddingRight, 10)
  const result = {
    paddingLeft: isNaN(Math.max(paddingLeft, paddingLeft2)) ? '0' : Math.max(paddingLeft, paddingLeft2).toString() + 'px',
    paddingRight: isNaN(Math.max(paddingRight, paddingRight2))
      ? '0'
      : Math.max(paddingRight, paddingRight2).toString() + 'px',
  }

  return result
}

export function allCellsInColumnsHaveSameWidth(table: HTMLElement, itemsPerPage: number) {
  const ths = [...table.querySelectorAll('[class*="_th"]')].filter((c) => c.getAttribute('data-column-id') !== null)

  for (const th of ths) {
    const col = th.getAttribute('data-column-id')

    const cells = table.querySelectorAll(`[data-column-id="${col}"]`)
    const numCells = itemsPerPage ? Math.min(cells.length, itemsPerPage) : cells.length
    let firstCellWidth: number | null = null
    for (let i = 0; i < numCells; i++) {
      for (const cell of cells) {
        const cellWidth = parseInt((cells[i] as HTMLElement).style.width)
        if (firstCellWidth === null) {
          firstCellWidth = cellWidth
        } else if (cellWidth !== firstCellWidth) {
          return false
        }
        return true
      }
    }
  }
  // }
}

export function getVisualLength(s: string) {
  let ruler: HTMLElement | null = null

  if (typeof document !== 'undefined') {
    ruler = document.createElement('div')
    ruler.style.cssText =
      'box-sizing: content-box; display: block; visibility: hidden; position: absolute; white-space: nowrap;'
    const computedStyle = window.getComputedStyle(document.body)
    const fontSize = computedStyle.fontSize
    ruler.style.fontSize = fontSize

    document.body.appendChild(ruler)

    ruler.innerText = s
    const width = ruler.offsetWidth
    document.body.removeChild(ruler)
    return width
  }
}

export function visualLength(s: string, elem: HTMLElement) {
  if (!ruler) {
    return 0
  }
  ruler.innerText = s
  const width = ruler.offsetWidth + paddingDiff(elem)
  return width
}

export function getBodyWidth(): string {
  if (typeof window !== 'undefined') {
    const rootStyles = getComputedStyle(document.documentElement)
    const width = parseInt(rootStyles.getPropertyValue('--sb-width'))

    return `${(100 - width).toString()}vw`
  }
  return '1400px'
}

export async function getBodyHeight() {
  const rootStyles = getComputedStyle(document.documentElement)
  const width = parseInt(rootStyles.getPropertyValue('--tb-height'))
  return width
}

export function setColumnWidths(table: HTMLElement | null, columnName: string | null = null) {
  if (table === null || table === undefined) {
    return
  }

  if (table.querySelectorAll(`div[class*="${styles['td']}"]`).length === 0) {
    return
  }

  Time('setColumnWidths')
  columnName = columnName ?? null
  const columnWidths: ColumnWidths = {}
  const rootStyles = getComputedStyle(document.documentElement)
  const colDividerWidth = parseInt(rootStyles.getPropertyValue('--colDividerWidth'))
  const tdPadding = parseInt(rootStyles.getPropertyValue('--tdpadding'))
  const thpadding = parseInt(rootStyles.getPropertyValue('--thpadding'))

  const tdCells =
    columnName === null
      ? [...table.querySelectorAll(`div[class*="${styles['td']}"]`)]
      : [...table.querySelectorAll(`div[class*="${styles['td']}"][data-column-id*=${columnName}]`)]
  const thCells =
    columnName === null
      ? [...table.querySelectorAll(`div[class*="${styles['th']}"]`)]
      : [...table.querySelectorAll(`div[class*="${styles['th']}"][data-column-id*=${columnName}]`)]

  for (const cell of thCells) {
    const columnId = cell.getAttribute('data-column-id')
    if (columnId && !cell.hasAttribute('hidden')) {
      let iconWidth = 0

      const icons = cell.querySelectorAll(`span[class*="material-symbols-outlined"][data-column-id=${columnId}]`)
      icons.forEach((icon) => {
        iconWidth += icon.clientWidth + paddingDiff(icon as HTMLElement)
      })

      const cellCopy = cell.cloneNode(true) as HTMLElement
      const noInputWidth = visualLength(columnId, cellCopy)

      const cellWidth = noInputWidth + paddingDiff(cellCopy) + iconWidth + thpadding

      if (cellWidth > (columnWidths[columnId] || 0)) {
        columnWidths[columnId] = cellWidth
      }
    }
  }

  for (const cell of tdCells) {
    try {
      const columnId = cell.getAttribute('data-column-id')
      let iconWidth = 0
      const isDropdown = !!(cell as HTMLElement).querySelector(`div[class*="${styles['dropdown']}"]`)
      if (isDropdown) continue
      if (columnId && !cell.hasAttribute('hidden')) {
        const icons = [...cell.querySelectorAll('span')]
        for (const icon of icons) {
          iconWidth += paddingDiff(icon)
        }
        const cellCopy = cell.cloneNode(true) as HTMLElement
        const input = cellCopy.querySelector('input')
        const inputWidth = isNaN(visualLength(input?.value, cellCopy))
          ? input?.offsetWidth
          : visualLength(input?.value, cellCopy) + paddingDiff(cellCopy)
        const noInputWidth = visualLength(cellCopy.innerText, cellCopy)
        const cellWidth = Math.max(inputWidth, noInputWidth, iconWidth) - colDividerWidth

        if (cellWidth > (columnWidths[columnId] || 0)) {
          columnWidths[columnId] = cellWidth
        }
      }
    } catch (err) {
      Error(JSON.stringify(err))
    }
  }
  const allCells = [...thCells, ...tdCells]

  columnWidths['STATUS'] = 65

  for (const cell of allCells) {
    const columnId = cell.getAttribute('data-column-id')
    ;(cell as HTMLElement).style.width = columnWidths[columnId] + 'px'
  }
  // for (const dropdown of dropdowns) {
  //   const cell = dropdown.parentElement?.parentElement;
  //   if (cell) {
  //     const columnId = cell.getAttribute('data-column-id');
  //     if (dropdown) {
  //       (dropdown as HTMLElement).style.width = `${columnWidths[columnId] - colDividerWidth}px`;
  //     }
  //   }
  // }
  TimeEnd('setColumnWidths')
  return columnWidths
}

export function setListeners(e: React.MouseEvent<HTMLDivElement, MouseEvent>, tableRef: HTMLDivElement, className?: string) {
  var pageX: number | undefined
  var curCol: HTMLElement | null
  var nxtCol: HTMLElement | null
  var curColWidth: number | undefined
  var nxtColWidth: number | undefined

  const colDivider = e.target as HTMLElement
  // if (!colDivider.classList.contains(className)) return
  const headerDiv = colDivider.parentElement
  const columnId = headerDiv?.dataset.columnId
  const table = tableRef as HTMLElement

  document.onmousedown = function (e) {
    e.preventDefault()
    e.stopPropagation()
    const target = headerDiv
    curCol = target ? target : null
    nxtCol = curCol ? (curCol.nextElementSibling as HTMLElement) : null
    const padding = curCol ? paddingDiff(curCol) : 0

    pageX = e.pageX
    const currentColumnAllCells = [...table.querySelectorAll('[data-column-id*="' + headerDiv.dataset.columnId + '"]')]

    const nextColumnId = (headerDiv as HTMLElement).nextElementSibling?.getAttribute('data-column-id')
    let nextColumnAllCells
    if (nextColumnId) {
      nextColumnAllCells = [...table.querySelectorAll('[data-column-id*="' + nextColumnId + '"]')]
    }

    curColWidth = curCol && curCol.offsetWidth > 0 && curCol.offsetWidth > padding ? curCol.offsetWidth - padding : 0
    nxtColWidth = nxtCol ? nxtCol.offsetWidth : 0

    function onMouseMove(e) {
      const diffX = e.pageX - (pageX ?? 0)

      if (curColWidth !== undefined) {
        const newCurColWidth = curColWidth + diffX
        headerDiv.style.minWidth = newCurColWidth + 'px'
        headerDiv.style.width = newCurColWidth + 'px'

        currentColumnAllCells.forEach((cell) => {
          const td = cell as HTMLElement
          td.style.minWidth = newCurColWidth + 'px'
          td.style.width = newCurColWidth + 'px'
        })
      }

      // if (nxtCol && nxtColWidth !== undefined) {
      //   const newCurColWidth = nxtColWidth + diffX;
      //   headerDiv.style.minWidth = newCurColWidth + 'px'
      //   headerDiv.style.width = newCurColWidth + 'px'

      //   nextColumnAllCells.forEach((cell) => {
      //     const td = cell as HTMLElement
      //     td.style.minWidth = newCurColWidth + 'px'
      //     td.style.width = newCurColWidth + 'px'
      //   })
      // }
    }

    // (2) move the colDivider on mousemove
    document.addEventListener('mousemove', onMouseMove)

    // (3) drop the colDivider, remove unneeded handlers
    document.onmouseup = function (e) {
      document.removeEventListener('mousemove', onMouseMove)
      document.onmousedown = null
    }
  }

  colDivider.ondragstart = function () {
    return false
  }
}

export function setDragListener(
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  tableRef: HTMLDivElement,
  className: string
) {
  let pageX: number | undefined
  let curCol: HTMLElement | null
  let nxtCol: HTMLElement | null
  let curColWidth: number | undefined

  const colDivider = e.target as HTMLElement
  if (!colDivider.classList.contains(className)) return
  const headerDiv = colDivider.parentElement
  const table = tableRef as HTMLElement

  function onDragStart(e) {
    curCol = headerDiv
    nxtCol = curCol ? (curCol.nextElementSibling as HTMLElement) : null
    const padding = curCol ? paddingDiff(curCol) : 0

    pageX = e.pageX
    curColWidth = curCol && curCol.offsetWidth > 0 && curCol.offsetWidth > padding ? curCol.offsetWidth - padding : 0
  }

  function onDrag(e) {
    const diffX = e.pageX - (pageX ?? 0)

    headerDiv.style.minWidth = (curColWidth ?? 0) + diffX + 'px'
    headerDiv.style.width = (curColWidth ?? 0) + diffX + 'px'

    const currentColumnAllCells = [...table.querySelectorAll('[data-column-id*="' + headerDiv.dataset.columnId + '"]')]
    currentColumnAllCells.forEach((cell) => {
      const td = cell as HTMLElement
      td.style.minWidth = (curColWidth ?? 0) + diffX + 'px'
      td.style.width = (curColWidth ?? 0) + diffX + 'px'
    })
  }

  function onDragEnd(e) {
    curCol = null
    nxtCol = null
    curColWidth = undefined

    colDivider.removeEventListener('mousemove', onDrag)
    colDivider.removeEventListener('dragend', onDragEnd)
    colDivider.removeEventListener('dragstart', onDragStart)
  }

  // colDivider.setAttribute('draggable', 'true');
  colDivider.addEventListener('dragstart', onDragStart)
  colDivider.addEventListener('drag', onDrag)
  colDivider.addEventListener('dragend', onDragEnd)

  function onMouseUp() {
    document.removeEventListener('mouseup', onMouseUp)
    colDivider.removeAttribute('draggable')
    colDivider.removeEventListener('dragstart', onDragStart)
  }

  document.addEventListener('mouseup', onMouseUp)
}

export function setAllZIndicesToZero() {
  // Get all elements on the page
  const allElements = document.querySelectorAll('[class*="' + 'td' + '"]')

  // Loop through each element and set its z-index to 0
  allElements.forEach((element) => {
    ;(element as HTMLElement).style.zIndex = '0'
  })
}

export function setAllZIndicesTo1000(doc: HTMLElement) {
  if (!doc) return
  const allElements = doc.querySelectorAll('*')

  // Loop through each element and set its z-index to 0
  allElements.forEach((element, index: number) => {
    ;(element as HTMLElement).style.zIndex = '1000'
  })
}

export function getMaxZIndex() {
  const allElements = document.querySelectorAll('*')
  let maxZIndex = 0

  allElements.forEach((element) => {
    const zIndex = parseInt(window.getComputedStyle(element).getPropertyValue('z-index'), 10)

    if (!isNaN(zIndex) && zIndex > maxZIndex) {
      maxZIndex = zIndex
    }
  })

  return maxZIndex
}

export async function upsertTableData() {
  const table = document.querySelectorAll('[id*="gridjs_"]')[0]

  let rows: any[] | NodeListOf<HTMLElement>

  rows = table && table.querySelectorAll('div[data-row-id]')

  const tableData = {}

  rows.forEach((row, index) => {
    if (index > 0) {
      const rowId = row.getAttribute('data-row-id')

      const cells = row.querySelectorAll('div[class*="td"]')

      tableData[rowId] = {}

      cells.forEach((cell, cellIndex) => {
        const columnId = cell.getAttribute('data-column-id')
        const input = cell.querySelector('input') as HTMLInputElement

        if (input) {
          tableData[rowId][columnId] = input.value.trim()
        } else {
          tableData[rowId][columnId] = (cell as HTMLElement).innerText.trim()
        }
      })
    }
  })

  const dimensions = Object.values(tableData) as Array<Payable>

  const db = await openDB<MyDB>('app-db', 1, {
    upgrade(db) {
      db.createObjectStore('dimensions')

      const dimensionStore = db.createObjectStore('dimension', {
        keyPath: 'Id',
      })
      dimensionStore.createIndex('by-id', 'Id')
    },
  })

  dimensions.forEach((dimension) => {
    return db.put('dimensions', dimension, dimension.Id)
  })

  const result = await putDimensions(JSON.stringify(tableData))

  return result
}

export async function upsertTableData2(data: Payable[]) {
  const tableData = {}

  data.forEach((row: Payable, index: number) => {
    const rowId = row.Id.toString()

    tableData[rowId] = {}

    Object.keys(row).forEach((key) => {
      tableData[rowId][key] = row[key].toString()
    })
  })

  const dimensions = Object.values(tableData) as Array<Payable>

  const db = await openDB<MyDB>('app-db', 1, {
    upgrade(db) {
      db.createObjectStore('dimensions')

      const dimensionStore = db.createObjectStore('dimension', {
        keyPath: 'Id',
      })
      dimensionStore.createIndex('by-id', 'Id')
    },
  })

  dimensions.forEach((dimension) => {
    return db.put('dimensions', dimension, dimension.Id)
  })

  try {
    const result = await putDimensions(JSON.stringify(tableData))
    return result
  } catch (error) {
    return (error as {message?: string})?.message ?? ''
  }
}

export async function exportCsv(data: any[], selectItem: string) {
  const headers = Object.keys(data[0])
  const statusColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'status')
  const idColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'id')

  const filteredHeaders = headers.filter((_, idx) => idx !== statusColumnIndex && idx !== idColumnIndex)

  const formatDate = (value: any) => {
    const dateRegex1 = /^\d{4}[-/]\d{2}[-/]\d{2}/
    const dateRegex2 = /^(\w{3}) (\w{3} \d{2} \d{4})/
    if ((typeof value === 'string' || typeof value === 'object') && (dateRegex1.test(value) || dateRegex2.test(value))) {
      const timestamp = Date.parse(value)
      if (timestamp === undefined) return value
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp)
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
          .getDate()
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`
      }
    }
    return value
  }

  // Map over data rows and format date values
  const rowsData = [
    [`${getEtlFileName(selectItem)}`],
    filteredHeaders,
    ...data.map((row) => filteredHeaders.map((key) => formatDate(row[key]))),
  ]

  const csvData = rowsData.map((row) => row.join(',')).join('\n')
  const csvBlob = new Blob([csvData], {type: 'text/csv'})
  const csvUrl = URL.createObjectURL(csvBlob)

  const downloadLink = document.createElement('a')
  downloadLink.href = csvUrl
  downloadLink.download = `${'FinPayables'}.csv`
  downloadLink.style.display = 'none'

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

export function getCsvData(data: any[], selectItem: string): string {
  const headers = Object.keys(data[0])
  const statusColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'status')
  const idColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'id')

  const filteredHeaders = headers.filter((_, idx) => idx !== statusColumnIndex && idx !== idColumnIndex)

  const formatDate = (value: any) => {
    const dateRegex1 = /^\d{4}[-/]\d{2}[-/]\d{2}/
    const dateRegex2 = /^(\w{3}) (\w{3} \d{2} \d{4})/
    if ((typeof value === 'string' || typeof value === 'object') && (dateRegex1.test(value) || dateRegex2.test(value))) {
      const timestamp = Date.parse(value)
      if (timestamp === undefined) return value
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp)
        return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
          .getDate()
          .toString()
          .padStart(2, '0')}/${date.getFullYear()}`
      }
    }
    return value
  }

  // Map over data rows and format date values
  const rowsData = [
    [`${getEtlFileName(selectItem)}`],
    filteredHeaders,
    ...data.map((row) => filteredHeaders.map((key) => formatDate(row[key]))),
  ]

  const csvData = rowsData.map((row) => row.join(',')).join('\n')
  return csvData
  // const csvBlob = new Blob([csvData], {type: 'text/csv'})
  // const csvUrl = URL.createObjectURL(csvBlob)

  // const downloadLink = document.createElement('a')
  // downloadLink.href = csvUrl
  // downloadLink.download = `${'FinPayables'}.csv`
  // downloadLink.style.display = 'none'

  // document.body.appendChild(downloadLink)
  // downloadLink.click()
  // document.body.removeChild(downloadLink)
}

export const saveFile = async (content, filename) => {
  const blob = new Blob([content], {type: 'text/plain'})
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
  return filename
}

export const formatDate = (value: any) => {
  const dateRegex1 = /^\d{4}[-/]\d{2}[-/]\d{2}/
  const dateRegex2 = /^(\w{3}) (\w{3} \d{2} \d{4})/
  if ((typeof value === 'string' || typeof value === 'object') && (dateRegex1.test(value) || dateRegex2.test(value))) {
    const timestamp = Date.parse(value)
    if (isNaN(timestamp)) return value
    const date = new Date(timestamp)
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }
  return value === null || value === undefined ? '' : trimString(value)
}

export function isInvoice(item: string) {
  return item === 'Post Invoices' || item === ''
}
export async function createCsv(data: any[], selectItem: string, client: string) {
  const headers = Object.keys(data[0])

  // Check if 'trannum' and 'isconsolidatechecks' are already present in the headers array
  const hasTrannum = headers.includes('trannum')
  const hasIsConsolidateChecks = headers.includes('isconsolidatechecks')

  if (!hasIsConsolidateChecks) {
    headers.unshift('isconsolidatechecks')
  }

  // If 'trannum' is not present, add it at the beginning of the headers array
  if (!hasTrannum) {
    headers.unshift('trannum')
  }

  const statusColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'status')
  const idColumnIndex = headers.findIndex((hdr) => hdr.toLowerCase() === 'id')

  const filteredHeaders = headers.filter((_, idx) => idx !== statusColumnIndex && idx !== idColumnIndex)

  const obj = Object.entries(data[0])[0]
  const isObject = typeof obj[1] === 'object'

  if (isObject) {
    if (isInvoice(selectItem)) {
      const objs = Object.values(data)
      objs.forEach((obj) => {
        obj['trannum'] = {value: '1', ischanged: true}
        obj['isconsolidatechecks'] = {value: '1', ischanged: true}
        for (const key in obj) {
          obj[key] = formatDate(obj[key])
        }
      })
    }
    const rowsData = [
      [`${getEtlFileName(selectItem)}`],
      [...filteredHeaders],
      ...data.map((row) => {
        const newRow = [...filteredHeaders]
        for (const key in row) {
          if (!newRow.includes(key)) {
            newRow.push(key)
          }
        }
        return newRow.map((key) => {
          const value = row[key]?.value
          return formatDate(value)
        })
      }),
    ]

    const csvData = rowsData.map((row) => row.map((item) => `"${item}"`).join(',')).join('\n')
    return csvData
  }

  const rowsData = [
    [`${getEtlFileName(selectItem)}`],
    filteredHeaders,
    ...data.map((row) => filteredHeaders.map((key) => formatDate(row[key]))),
  ]

  const csvData = rowsData.map((row) => row.map((item) => `"${item}"`).join(',')).join('\n')
  return csvData
}

export function trimString(value: string | number | null | undefined): string | number | null | undefined {
  return (typeof value === 'string' || typeof value === 'number') && value !== null && value.toString().trim().length > 0
    ? value.toString().trim()
    : value
}

export async function putDimensions(dimension: string | null = null) {
  const jsonObject = JSON.parse(dimension)
  for (const key in jsonObject) {
    delete jsonObject[key].Id
  }
  const parsedJson = Object.values(JSON.parse(JSON.stringify(jsonObject)))

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })
    let url = `https://localhost:5006/api/data/PutDimensions${
      parsedJson ? `?value=${encodeURIComponent(JSON.stringify(parsedJson))}` : ''
    }`
    axios.post(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: agent,
      timeout: 300000,
    })
    const listElem = (document.getElementById('notifications-popup') as HTMLElement).querySelector('ul') as HTMLElement
    const children = listElem.children
    if (children[0].textContent.includes(':(')) listElem.innerHTML = ''
    const li = document.createElement('li')
    li.innerHTML = 'Dimensions added successfully!'
    listElem.appendChild(li)
  } catch (error) {
    return (error as {message?: string})?.message ?? ''
  }
}

export function getDate(dateValue: Date | null = null) {
  const date = dateValue ? new Date(dateValue) : new Date()
  const dateString = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  return dateString
}

export function getDataColumnId(selectItem: string): string | null {
  switch (selectItem) {
    case 'GetVendors':
      return 'Person'.toUpperCase()
    case 'GetPropOptions':
    case 'GetProperties':
      return 'Property'.toUpperCase()
    case 'GetAccounts':
      return 'Account'.toUpperCase()
    case 'GetTenants':
      return 'Tenant'.toUpperCase()
    case 'GetTables':
      return 'Tables'.toUpperCase()
    case 'GetExpenseTypes':
      return 'ExpenseType'.toUpperCase()
    default:
      return null
  }
}

export function getSelectItem(key: string): {lookup: string; columnName: string} {
  switch (key.toUpperCase()) {
    case 'PROPERTY':
      return {lookup: 'GetPropOptions', columnName: key.toUpperCase()}
    case 'ACCOUNT':
    case 'OFFSET':
    case 'ACCRUAL':
      return {lookup: 'GetAccounts', columnName: key.toUpperCase()}
    case 'PERSON':
      return {lookup: 'GetVendors', columnName: key.toUpperCase()}
    case 'TENANT':
      return {lookup: 'GetTenants', columnName: key.toUpperCase()}
    case 'LEASE':
      return {lookup: 'GetLeases', columnName: key.toUpperCase()}
    case 'EXPENSETYPE':
      return {lookup: 'GetExpenseTypes', columnName: key.toUpperCase()}
    default:
      return {lookup: '', columnName: key.toUpperCase()}
  }
}

export function getSelectKey(key: string) {
  switch (key.toUpperCase()) {
    case 'PROPERTY':
      return 'Property'
    case 'ACCOUNT':
      return 'Account'
    case 'PERSON':
      return 'Vendor'
    case 'TENANT':
      return 'Tenant'
    case 'LEASE':
      return 'Lease'
    case 'EXPENSETYPE':
      return 'ExpenseType'
    default:
      return ''
  }
}

export function getMyType(selected: string) {
  switch (selected) {
    case 'GetPropOptions':
    case 'GetProperties':
      return 'Property'
    case 'GetAccounts':
      return 'Account'
    case 'GetVendors':
      return 'Vendor'
    case 'GetTenants':
      return 'Tenant'
    case 'GetLeases':
      return 'Lease'
    case 'CommLeases':
      return 'CommLease'
    case 'GetTables':
      return 'Tables'
    case 'GetExpenseTypes':
      return 'ExpenseType'
    case 'Post Invoices':
      return 'Invoice'
    default:
      return 'Invoice'
  }
}

export function getHeaderValue(selectItem: string): string {
  switch (selectItem) {
    case 'GetVendors':
      return 'Vendors'
    case 'GetPropOptions':
    case 'GetProperties':
      return 'Properties'
    case 'GetAccounts':
      return 'Accounts'
    case 'Post Invoices':
      return 'Dimensions'
    case 'CommLeases':
      return 'EtlLeases'
    case 'GetTenants':
      return 'Tenants'
    case 'GetFromQuery':
      return 'Query'
    case 'GetLeases':
      return 'Leases'
    case 'GetTables':
      return 'Tables'
    case 'GetExpenseTypes':
      return 'ExpenseType'
    default:
      return ''
  }
}

export function getEtlFileName(selectItem: string): string {
  switch (selectItem) {
    case 'GetVendors':
      return 'FinVendors'
    case 'GetPropOptions':
    case 'GetProperties':
      return 'PropOptions'
    case 'GetAccounts':
      return 'FinGLAccounts'
    case 'Post Invoices':
      return 'FinPayables'
    case 'CommLeases':
      return 'CommLeases'
    case 'GetTenants':
      return 'CommTenants'
    case 'GetFromQuery':
      return 'Query'
    case 'GetLeases':
      return 'CommLeases'
    case 'GetTables':
      return 'Tables'
    case 'GetExpenseTypes':
      return 'ExpenseType'
    default:
      return 'FinPayables'
  }
}

export function convertToCommercialEtlLeases(data: any): CommercialEtlLeases {
  const result: CommercialEtlLeases = {} as CommercialEtlLeases

  Object.keys(data).forEach((key) => {
    result[key] = data[key] === '' || data[key] === null ? null : data[key]
  })

  return result
}

export function tryParseDate(dateString: string, defaultValue: string | null = null): string {
  const defaultDate = defaultValue ? new Date(defaultValue) : new Date()
  const timestamp = Date.parse(dateString)
  const result = isNaN(timestamp) ? defaultDate : new Date(timestamp)
  return result.toLocaleDateString('en-US')
}

export interface DataCell {
  value?: string | null
  columnIndex?: number | string | null
  rowIndex?: number | string | null
  ischanged?: boolean
}

import crypto from 'crypto'
import { getFormatSqlDecrypted } from '@/app/api/formatSql'
import config from '@/components/appsettings.json'

export async function encryptAndFormat(text: string, encryption_key: string, enc_iv: string) {
  if (!encryption_key) throw new Error('No encryption key provided')
  const sqlText = text
  const keys = Buffer.from(encryption_key, 'utf8')
  const ivs = Buffer.from(enc_iv, 'utf8')
  const key = keys.subarray(0, 32)
  const iv = ivs.subarray(0, 16)

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  // Encrypt the SQL text
  let encryptedSql = cipher.update(sqlText, 'utf8', 'base64')
  encryptedSql += cipher.final('base64')

  const encrypted = await getFormatSqlDecrypted(encryptedSql)
  const formatted = await decrypt(encrypted)
  return formatted
}

export async function encrypt(text: string) {
  const sqlText = text
  const keys = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8')
  const ivs = Buffer.from(process.env.ENCRYPTION_IV, 'utf8')
  const key = keys.subarray(0, 32)
  const iv = ivs.subarray(0, 16)

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
  // Encrypt the SQL text
  let encryptedSql = cipher.update(sqlText, 'utf8', 'base64')
  encryptedSql += cipher.final('base64')

  const encrypted = await getFormatSqlDecrypted(encryptedSql)
  const formatted = await decrypt(encrypted)
  return formatted
}

export async function decrypt(encryptedText) {
  const keys = Buffer.from(config.SecretKey, 'utf8')
  const ivs = Buffer.from(config.IV, 'utf8')
  const key = keys.subarray(0, 32)
  const iv = ivs.subarray(0, 16)
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  decipher.setAutoPadding(true) // set padding to Zero
  try {
    let decryptedText = decipher.update(encryptedText, 'base64', 'utf8')
    decryptedText += decipher.final('utf8')
    return decryptedText
  } catch (err) {
    return err
  }
}

export function generateInvoiceNumber() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var length = 10
  var result = ''
  for (var i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result.toLowerCase()
}

export interface CsvData {
  ErrorText: string
  ObjectCode: string
  LineNumber: string
  ErrorType: string
  Property_Code: string
  FieldValue: string
  DateExported: string
  sFile: string
}

export interface InterfaceErrors {
  errortext: string
  objectcode: string
  linenumber: string
  errortype: string
  property_code: string
  fieldvalue: string
  dateexported: string
  sfile: string
  userid: string
}

export function getClient(): string {
  if (typeof window === 'undefined') return ''
  const storedFilters = localStorage.getItem('clientFilter')
  const parsedFilters = storedFilters ? (JSON.parse(storedFilters) as Filters) : null
  const client = parsedFilters?.Name
  return client
}
export function getDbType(): string {
  if (typeof window === 'undefined') return ''
  const storedFilters = localStorage.getItem('dbTypeFilter')
  const parsedFilters = storedFilters ? (JSON.parse(storedFilters) as Filters) : null
  const client = parsedFilters?.Name
  return client
}

export interface Filters {
  Id?: number
  Name?: string | null
}

export function nameof(property) {
  if (typeof property === 'string') {
    return property
  } else if (typeof property === 'function') {
    return property.name
  } else if (typeof property === 'object') {
    const match = property.constructor.toString().match(/function\s+(\w+)\(/)
    return match ? match[1] : 'unknown'
  } else {
    return 'unknown'
  }
}

export interface NextResponse {
  result: {}
}

export function isMobile() {
  if (typeof window === 'undefined') {
    return false // or throw an error, depending on your use case
  }

  const userAgent = window.navigator.userAgent.toLowerCase()
  const mobileKeywords = ['android', 'iphone', 'ipod', 'ipad', 'mobile', 'tablet']

  for (let i = 0; i < mobileKeywords.length; i++) {
    if (userAgent.indexOf(mobileKeywords[i]) !== -1) {
      return true
    }
  }

  return false
}

export interface InitialData {
  accounts: Account[]
  vendors: Vendor[]
  properties: property[]
  postinvoices?: Transetl[]
  numitems?: number
}

export function getDataTypes(data: any[]): ColumnDataTypes {
  const colDataTypes: ColumnDataTypes = {}
  const dataLengths = Object.values(data)
  dataLengths.forEach((row) => {
    Object.keys(row).forEach((key) => {
      const value = row[key]
      if (isNumber(value)) {
        colDataTypes[key] = 'number'
      } else if (!isDate(value)) {
        colDataTypes[key] = 'string'
      } else if (isDate(value)) {
        colDataTypes[key] = 'date'
      } else {
        colDataTypes[key] = 'string'
      }
    })
  })
  return colDataTypes
}

export function compareColumnWidths(obj1: ColumnWidths, obj2: ColumnWidths): ColumnWidths {
  const result: ColumnWidths = {}

  for (const key of Object.keys(obj1)) {
    const value1 = obj1[key]
    const value2 = obj2[key]

    result[key] = Math.max(value1, value2)
  }

  return result
}

export function convertObjectKeysToLowercase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const lowercaseKey = key.toLowerCase()
      result[lowercaseKey] = obj[key]
    }
  }

  return result
}

export interface ColumnProps {
  Item: string
  Index: number
  Name: string
  Type: string
  Lookup: string | null
}

export function lowerCaseProperties(obj) {
  const lowercasedObj = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lowercasedObj[key.toLowerCase()] = lowerCaseProperties(value)
      } else {
        lowercasedObj[key.toLowerCase()] = value
      }
    }
  }

  return lowercasedObj
}

export interface UploadFile {
  fileCsv: string | null
  filePdf: string | null
}

export function AppendFormat(format, ...args) {
  let result = format

  for (let i = 0; i < args.length; i++) {
    const placeholder = `{${i}}`
    const value = args[i]
    result = result.replace(placeholder, value)
  }

  return result
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]
      resolve(base64String)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const arrayBuffer = event.target.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer)
      resolve(uint8Array)
    }

    reader.onerror = (event) => {
      reject(event.target.error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export function isNothing(value: any): boolean {
  return value === null || value === undefined || value === 'undefined'
}

export function getScreenPixelWidth() {
  let width = 750
  let pixelValue = 0
  let sidebarwidth = ''
  if (typeof window !== 'undefined') {
    const rootStyles = getComputedStyle(document.documentElement)
    sidebarwidth = rootStyles.getPropertyValue('--sb-width')
    const cssValue = sidebarwidth
    const regex = /(\d+)/ // Regular expression to match integers
    const matches = cssValue.match(regex)
    const intValue = matches ? parseInt(matches[0], 10) : null
    pixelValue = (intValue * window.innerWidth) / 100
    width = window.innerWidth - pixelValue
  }
  return width
}

export interface DataItem {
  x: number | null
  y: number | null
  str: string
  dir: string
  width: number
  height: number
  transform: number[]
  fontName: string
  hasEOL: boolean
}

export interface PdfData {
  chargesArrayoObj: DataItem[]
  totalObject: DataItem[]
}

export function getLastDayOfMonth(year, month) {
  // Create a new Date object for the next month's first day
  // By passing 0 as the day, it will refer to the last day of the previous month
  const nextMonthFirstDay = new Date(year, month + 1, 0)

  // Extract the year, month, and day components from the next month's first day
  const lastDayYear = nextMonthFirstDay.getFullYear()
  const lastDayMonth = nextMonthFirstDay.getMonth() + 1 // Add 1 to the month (0-indexed)
  const lastDay = nextMonthFirstDay.getDate()

  // Format the date components as two-digit strings
  const formattedMonth = String(lastDayMonth).padStart(2, '0')
  const formattedDay = String(lastDay).padStart(2, '0')

  // Return the last day of the month in the desired format
  return `${formattedMonth}/${formattedDay}/${lastDayYear}`
}

export function extractNumberFromText(text) {
  const numberPattern = /\b(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten)\b/gi
  const matches = text.match(numberPattern)

  if (matches) {
    const numberWord = matches[0].toLowerCase()
    const numberMap = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    }

    return numberMap[numberWord]
  }

  return NaN
}

export interface FileData {
  Base64String: string
  FileName: string
}

export function extractHtmlDataTablesToCsv(tables: NodeListOf<HTMLElement>, fileName: string) {
  for (const table of tables) {
    const parent = table.parentElement as HTMLElement
    const etlFileName = parent.getAttribute('data-table-name')
    const rows = Array.from(table.querySelectorAll(`.${datagridstyles['tr']}`))

    const csvRows = [etlFileName]

    // Extract header row
    const headerRow = Array.from(rows[0].querySelectorAll(`.${styles['th']}`))
    const headerValues = headerRow.map((cell) => cell.textContent.trim())
    csvRows.push(headerValues.join(','))

    // Extract data rows
    for (let i = 1; i < rows.length; i++) {
      const dataRow = Array.from(rows[i].querySelectorAll(`.${styles['td']}`))
      const dataValues = dataRow.map((cell) => (cell.querySelector('input') as HTMLInputElement).value)
      csvRows.push(dataValues.join(','))
    }

    // Join rows with newlines
    const csvContent = csvRows.join('\n')

    // Create a download link
    const downloadLink = document.createElement('a')
    downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    downloadLink.download = `${etlFileName}_${fileName}.csv`

    // Trigger the download
    downloadLink.click()
  }
}

export function generateCsvFromHtml(table: HTMLElement, etlName?: string, fileName?: string) {
  const etlFileName = etlName
  if (!table) return
  const rows = Array.from(table.querySelectorAll(`.${datagridstyles['tr']}`))

  const csvRows = [etlFileName]

  // Extract header row
  const headerRow = Array.from(rows[0].querySelectorAll(`.${styles['th']}`))
  const headerValues = headerRow.map((cell) => cell.textContent.trim())
  csvRows.push(headerValues.join(','))

  // Extract data rows
  for (let i = 1; i < rows.length; i++) {
    const dataRow = Array.from(rows[i].querySelectorAll(`.${styles['td']}`))
    const dataValues = dataRow.map((cell) => (cell.querySelector('input') as HTMLInputElement).value)
    csvRows.push(dataValues.join(','))
  }

  // Join rows with newlines
  const csvContent = csvRows.join('\n')

  // Create a download link
  const downloadLink = document.createElement('a')
  downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
  downloadLink.download = `${fileName}.csv`
  // Trigger the download
  downloadLink.click()
}

export const americanStates = [
  {name: 'Alabama', acronym: 'AL'},
  {name: 'Alaska', acronym: 'AK'},
  {name: 'Arizona', acronym: 'AZ'},
  {name: 'Arkansas', acronym: 'AR'},
  {name: 'California', acronym: 'CA'},
  {name: 'Colorado', acronym: 'CO'},
  {name: 'Connecticut', acronym: 'CT'},
  {name: 'Delaware', acronym: 'DE'},
  {name: 'Florida', acronym: 'FL'},
  {name: 'Georgia', acronym: 'GA'},
  {name: 'Hawaii', acronym: 'HI'},
  {name: 'Idaho', acronym: 'ID'},
  {name: 'Illinois', acronym: 'IL'},
  {name: 'Indiana', acronym: 'IN'},
  {name: 'Iowa', acronym: 'IA'},
  {name: 'Kansas', acronym: 'KS'},
  {name: 'Kentucky', acronym: 'KY'},
  {name: 'Louisiana', acronym: 'LA'},
  {name: 'Maine', acronym: 'ME'},
  {name: 'Maryland', acronym: 'MD'},
  {name: 'Massachusetts', acronym: 'MA'},
  {name: 'Michigan', acronym: 'MI'},
  {name: 'Minnesota', acronym: 'MN'},
  {name: 'Mississippi', acronym: 'MS'},
  {name: 'Missouri', acronym: 'MO'},
  {name: 'Montana', acronym: 'MT'},
  {name: 'Nebraska', acronym: 'NE'},
  {name: 'Nevada', acronym: 'NV'},
  {name: 'New Hampshire', acronym: 'NH'},
  {name: 'New Jersey', acronym: 'NJ'},
  {name: 'New Mexico', acronym: 'NM'},
  {name: 'New York', acronym: 'NY'},
  {name: 'North Carolina', acronym: 'NC'},
  {name: 'North Dakota', acronym: 'ND'},
  {name: 'Ohio', acronym: 'OH'},
  {name: 'Oklahoma', acronym: 'OK'},
  {name: 'Oregon', acronym: 'OR'},
  {name: 'Pennsylvania', acronym: 'PA'},
  {name: 'Rhode Island', acronym: 'RI'},
  {name: 'South Carolina', acronym: 'SC'},
  {name: 'South Dakota', acronym: 'SD'},
  {name: 'Tennessee', acronym: 'TN'},
  {name: 'Texas', acronym: 'TX'},
  {name: 'Utah', acronym: 'UT'},
  {name: 'Vermont', acronym: 'VT'},
  {name: 'Virginia', acronym: 'VA'},
  {name: 'Washington', acronym: 'WA'},
  {name: 'West Virginia', acronym: 'WV'},
  {name: 'Wisconsin', acronym: 'WI'},
  {name: 'Wyoming', acronym: 'WY'},
]

export const americanCities = [
  {name: 'New York', acronym: 'NY'},
  {name: 'Los Angeles', acronym: 'CA'},
  {name: 'Chicago', acronym: 'IL'},
  {name: 'Houston', acronym: 'TX'},
  {name: 'Phoenix', acronym: 'AZ'},
  {name: 'Philadelphia', acronym: 'PA'},
  {name: 'San Antonio', acronym: 'TX'},
  {name: 'San Diego', acronym: 'CA'},
  {name: 'Dallas', acronym: 'TX'},
  {name: 'San Jose', acronym: 'CA'},
  {name: 'Austin', acronym: 'TX'},
  {name: 'Jacksonville', acronym: 'FL'},
  {name: 'San Francisco', acronym: 'CA'},
  {name: 'Indianapolis', acronym: 'IN'},
  {name: 'Columbus', acronym: 'OH'},
  {name: 'Fort Worth', acronym: 'TX'},
  {name: 'Charlotte', acronym: 'NC'},
  {name: 'Seattle', acronym: 'WA'},
  {name: 'Denver', acronym: 'CO'},
  {name: 'El Paso', acronym: 'TX'},
  {name: 'Washington', acronym: 'DC'},
  {name: 'Boston', acronym: 'MA'},
  {name: 'Detroit', acronym: 'MI'},
  {name: 'Nashville', acronym: 'TN'},
  {name: 'Memphis', acronym: 'TN'},
  {name: 'Portland', acronym: 'OR'},
  {name: 'Oklahoma City', acronym: 'OK'},
  {name: 'Las Vegas', acronym: 'NV'},
  {name: 'Louisville', acronym: 'KY'},
  {name: 'Baltimore', acronym: 'MD'},
  {name: 'Milwaukee', acronym: 'WI'},
  {name: 'Albuquerque', acronym: 'NM'},
  {name: 'Tucson', acronym: 'AZ'},
  {name: 'Fresno', acronym: 'CA'},
  {name: 'Sacramento', acronym: 'CA'},
  {name: 'Mesa', acronym: 'AZ'},
  {name: 'Kansas City', acronym: 'MO'},
  {name: 'Atlanta', acronym: 'GA'},
  {name: 'Long Beach', acronym: 'CA'},
  {name: 'Colorado Springs', acronym: 'CO'},
  {name: 'Raleigh', acronym: 'NC'},
  {name: 'Miami', acronym: 'FL'},
  {name: 'Virginia Beach', acronym: 'VA'},
  {name: 'Omaha', acronym: 'NE'},
  {name: 'Oakland', acronym: 'CA'},
  {name: 'Minneapolis', acronym: 'MN'},
  {name: 'Tulsa', acronym: 'OK'},
  {name: 'Arlington', acronym: 'TX'},
  {name: 'New Orleans', acronym: 'LA'},
  {name: 'Wichita', acronym: 'KS'},
  {name: 'Cleveland', acronym: 'OH'},
  {name: 'Tampa', acronym: 'FL'},
  {name: 'Bakersfield', acronym: 'CA'},
  {name: 'Aurora', acronym: 'CO'},
  {name: 'Honolulu', acronym: 'HI'},
  {name: 'Anaheim', acronym: 'CA'},
  {name: 'Santa Ana', acronym: 'CA'},
  {name: 'Riverside', acronym: 'CA'},
  {name: 'Corpus Christi', acronym: 'TX'},
  {name: 'Lexington', acronym: 'KY'},
  {name: 'Stockton', acronym: 'CA'},
  {name: 'St. Louis', acronym: 'MO'},
  {name: 'Saint Paul', acronym: 'MN'},
  {name: 'Henderson', acronym: 'NV'},
  {name: 'Pittsburgh', acronym: 'PA'},
  {name: 'Cincinnati', acronym: 'OH'},
  {name: 'Anchorage', acronym: 'AK'},
  {name: 'Greensboro', acronym: 'NC'},
  {name: 'Plano', acronym: 'TX'},
  {name: 'Newark', acronym: 'NJ'},
  {name: 'Lincoln', acronym: 'NE'},
  {name: 'Orlando', acronym: 'FL'},
  {name: 'Irvine', acronym: 'CA'},
  {name: 'Toledo', acronym: 'OH'},
  {name: 'Jersey City', acronym: 'NJ'},
  {name: 'Chula Vista', acronym: 'CA'},
  {name: 'Durham', acronym: 'NC'},
  {name: 'Fort Wayne', acronym: 'IN'},
  {name: 'St. Petersburg', acronym: 'FL'},
  {name: 'Laredo', acronym: 'TX'},
  {name: 'Buffalo', acronym: 'NY'},
  {name: 'Madison', acronym: 'WI'},
  {name: 'Lubbock', acronym: 'TX'},
  {name: 'Chandler', acronym: 'AZ'},
  {name: 'Scottsdale', acronym: 'AZ'},
  {name: 'Reno', acronym: 'NV'},
  {name: 'Glendale', acronym: 'AZ'},
  {name: 'Norfolk', acronym: 'VA'},
  {name: 'Winston-Salem', acronym: 'NC'},
  {name: 'North Las Vegas', acronym: 'NV'},
  {name: 'Irving', acronym: 'TX'},
  {name: 'Chesapeake', acronym: 'VA'},
  {name: 'Gilbert', acronym: 'AZ'},
  {name: 'Hialeah', acronym: 'FL'},
  {name: 'Garland', acronym: 'TX'},
  {name: 'Fremont', acronym: 'CA'},
  {name: 'Richmond', acronym: 'VA'},
  {name: 'Boise', acronym: 'ID'},
  {name: 'San Bernardino', acronym: 'CA'},
]

export const sanDiegoCities = [
  {name: 'San Diego', acronym: 'SD'},
  {name: 'Chula Vista', acronym: 'CV'},
  {name: 'Oceanside', acronym: 'OS'},
  {name: 'Escondido', acronym: 'ES'},
  {name: 'Carlsbad', acronym: 'CB'},
  {name: 'El Cajon', acronym: 'EC'},
  {name: 'Vista', acronym: 'VS'},
  {name: 'San Marcos', acronym: 'SM'},
  {name: 'Encinitas', acronym: 'EN'},
  {name: 'National City', acronym: 'NC'},
  {name: 'La Mesa', acronym: 'LM'},
  {name: 'Santee', acronym: 'ST'},
  {name: 'Poway', acronym: 'PW'},
  {name: 'Imperial Beach', acronym: 'IB'},
  {name: 'Lemon Grove', acronym: 'LG'},
  {name: 'Coronado', acronym: 'CR'},
  {name: 'Del Mar', acronym: 'DM'},
  {name: 'Solana Beach', acronym: 'SB'},
  {name: 'Fallbrook', acronym: 'FB'},
  {name: 'Spring Valley', acronym: 'SV'},
  {name: 'Rancho Santa Fe', acronym: 'RSF'},
  {name: 'Lakeside', acronym: 'LK'},
  {name: 'Ramona', acronym: 'RM'},
  {name: 'Bonita', acronym: 'BN'},
  {name: 'Jamul', acronym: 'JM'},
  {name: 'Alpine', acronym: 'AL'},
  {name: 'Bonsall', acronym: 'BS'},
  {name: 'Campo', acronym: 'CM'},
  {name: 'Valley Center', acronym: 'VC'},
  {name: 'Pauma Valley', acronym: 'PV'},
  {name: 'Descanso', acronym: 'DS'},
  {name: 'Pine Valley', acronym: 'PV'},
  {name: 'Borrego Springs', acronym: 'BS'},
]

export function generateTenantCode(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = 't'

  if (length < 2) {
    return randomString
  }

  for (let i = 1; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }

  return randomString
}

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

export function sortByColumn(data: any[], columnName: string, ascending: boolean = true): any[] {
  if (!data || Object.keys(data).length === 0) return []
  if (data.hasOwnProperty('ids') && Array.isArray(data['ids']) && data['ids'].length === 0) return []
  if (!isIterable(data)) {
    return []
  }
  const copyData = [...data]
  return copyData.sort((a, b) => {
    const valueA = a[columnName]
    const valueB = b[columnName]

    // Check for null or undefined values
    if (valueA === null || valueA === undefined) return 1
    if (valueB === null || valueB === undefined) return -1

    // Compare the values based on the data type of the column
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    } else {
      return ascending ? valueA - valueB : valueB - valueA
    }
  })
}
export function getLastDayOfMonthByString(dateString: string): Date {
  // Step 1: Parse the date string into a Date object
  const dateParts = dateString.split('/')
  const month = parseInt(dateParts[0], 10)
  const year = parseInt(dateParts[2], 10)
  const date = new Date(year, month - 1, 1)

  // Step 2: Set the date to the first day of the next month
  date.setMonth(date.getMonth() + 1)

  // Step 3: Subtract one day to get the last day of the current month
  date.setDate(date.getDate() - 1)

  // Return the last day of the month as a Date object
  return date
}

export function getYardiDateFormat(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export function formDate(date: string): string {
  if (date === '' || !date) return ''
  let splits = date.split('/')

  if (splits.length === 3) {
    let month = splits[0]
    let day = splits[1]
    let year = splits[2]
    if (day.length === 1) day = '0' + day.toString()
    if (month.length === 1) month = '0' + month.toString()
    if (year.length === 2) year = '20' + year.toString()
    return `${month}/${day}/${year}`
  }
}

export type CommSQFTs = Database['public']['Tables']['commsqfts']['Row']
export type CommLeases = Database['public']['Tables']['commetllease']['Row']
export type CommUnits = Database['public']['Tables']['communits']['Row']
export type CommChargeSchedules = Partial<Database['public']['Tables']['commchargeschedules']['Row']>
export type CommUnitXrefs = Database['public']['Tables']['communitxrefs']['Row']
export type CommLeaseRecoveryParams = Database['public']['Tables']['commleaserecoveryparams']['Row']
export type CommOptions = Database['public']['Tables']['commoptions']['Row']
export type ChargeCodes = Database['public']['Tables']['chargecodes']['Row']
export type ExpensePools = Database['public']['Tables']['expensepools']['Row']
export type CommContacts = Database['public']['Tables']['commcontacts']['Row']
export type RecoveryProfiles = Partial<Database['public']['Tables']['recoveryprofiles']['Row']>
export type CommRecoveryExcludes = Partial<Database['public']['Tables']['commrecoveryexcludes']['Row']>
export type CommPropRecoveryExcludes = Partial<Database['public']['Tables']['commproprecoveryexcludes']['Row']>
export type CommPropExpensePoolAccounts = Partial<Database['public']['Tables']['commpropexpensepoolaccounts']['Row']>

export interface SliceFileData {
  uploadFile: File
  ui8array: Uint8Array
  chargeCodes?: Partial<ChargeCodes>[]
  recoveryProfiles?: Partial<RecoveryProfiles>[]
  overridePropertyCode: string
  overrideUnitCode: string
  overrideLeaseCode: string
}
export interface CommercialLeaseObjects {
  // commLeases: CommLease[] | null
  commUnits: Partial<CommUnits>[] | null
}

export const OccypancyType = {
  None: 0,
  OccupiedArea: 1,
  LeasedArea: 2,
}

export enum StatusEnum {
  Loading = 0,
  Running = 1,
  Done = 2,
}

export interface Status {
  value: StatusEnum
}

export const LateFeeCalculationType = {
  InterestIndex: 0,
  PercentageOfChargeAmount: 1,
  LegalInterest: 2,
  PercentageOfNetAmountDays: 3,
  PercentageOfNetAmountMonths: 4,
  FixedPercent: 5,
}

export const AmendmentTypes = {
  OriginalLease: 0,
  Renewal: 1,
  Expansion: 2,
  Contraction: 3,
  Termination: 4,
  Holdover: 5,
  Component: 11,
}

export const DueDayAfterMethod = {
  None: 0,
  InvoiceDate: 1,
  ChargeBeginDateWorkingDays: 2,
  ChargeBeginDate: 3,
  InvoiceDateWorkingDays: 4,
}

export enum OptionType {
  Renewal = 0,
  Expansion = 1,
  Contraction = 2,
  Termination = 3,
  RightOfFirstOffer = 4,
  RightOfFirstRefusal = 5,
  Custom = 6,
}

export enum OptionStatus {
  Active = 0,
  Exercised = 1,
  Declined = 2,
  Expired = 3,
  Canceled = 4,
}

export const ProposalType = {
  OriginalDeal: 0,
  Renewal: 1,
  Expansion: 2,
  Contraction: 3,
  HoldOver: 5,
  Assignment: 9,
  Remeasure: 12,
  Relocation: 15,
  LicenseAgreement: 20,
}

export const AmendmentStatus = {
  Inprocess: 0,
  Activated: 1,
  Suspended: 2,
  Ready: 3,
}

export const Contact_Type_Association = {
  Customer: 478,
  Owner: 2,
  Property: 3,
  CommercialLease: 542,
  Entity: 460,
  Vendor: 5,
  Employee: 79,
  Job: 65,
  InvestorCRMClient: 21005,
  InvestorCRMProposal: 21006,
  InvestorCRMLead: 21007,
  InvestorCRMCommitment: 21008,
  Lead: 1783,
}

export interface ChargeCodesShort {
  ChargeCode: string
  ChargeDescription: string
  ChargeGL: string
  GLDescription: string
}

export function getChargeCodes(worksheet: XLSX.WorkSheet): ChargeCodesShort[] {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 3
  let haveFirstRow = false
  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    const column: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue.toLowerCase().includes('charge code')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row + 1
        haveFirstRow = true
      }

      if (haveFirstRow && column === 1) {
        if (cellValue.split(' ').length > 1) {
          const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
          lastRow = row - 1
        }
      }
    } catch (error) {
      throw error
    }
  }
  // Extracting data row by row from the specified range
  const data: ChargeCodesShort[] = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData: ChargeCodesShort = {
        ChargeCode: '',
        ChargeDescription: '',
        ChargeGL: '',
        GLDescription: '',
      }
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        switch (col) {
          case 0:
            rowData.ChargeCode = cellValue
            break
          case 1:
            rowData.ChargeDescription = cellValue
            break
          case 2:
            rowData.ChargeGL = cellValue
            break
          case 3:
            rowData.GLDescription = cellValue
            break
        }
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => Object.values(rowData).some((value) => value !== ''))

  return filteredData
}

export interface ProgressStep {
  value: string
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export type Row = {
  [columnName: string]: Cell
}

export type Cell = {
  rowIndex: number
  columnIndex: number
  value: string | number | Date | null
  isChecked: boolean
}

export interface CheckedRows {
  [id: number]: boolean
}

export function convertDateFormat(dateStr) {
  const parts = dateStr.split('/')
  let month = parts[0]
  let day = parts[1]
  let year = parts[2]

  // If the year is in the "yy" format, prefix it with "20"
  if (year.length === 2) {
    year = '20' + year
  }

  return `${month}/${day}/${year}`
}

export const filterColumns = (rows, columnsToRemove) => {
  return rows.map((row) => {
    return Object.keys(row)
      .filter((key) => !columnsToRemove.includes(key))
      .reduce((obj, key) => {
        obj[key] = row[key]
        return obj
      }, {})
  })
}

export const sortByColumn2 = (column, isAscending = true) => {
  return (a, b) => {
    if (isAscending === null) {
      // Sort by 'id' if isAscending is null
      return a['id'] - b['id']
    }
    const valueA = a[column];
    const valueB = b[column];

    // If both values are null or undefined, consider them equal
    if (valueA == null && valueB == null) return 0;

    // If one value is null or undefined, consider it to be less than the other
    if (valueA == null) return isAscending ? -1 : 1;
    if (valueB == null) return isAscending ? 1 : -1;

    // If all values are numbers represented as strings, compare as numbers
    if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
      const numberA = Number(valueA);
      const numberB = Number(valueB);
      return isAscending ? numberA - numberB : numberB - numberA;
    }

    // Compare as strings
    const comparison = String(valueA).localeCompare(String(valueB));
    return isAscending ? comparison : -comparison;
  };
};

interface CheckedRowState {
  tableName: string;
  rows: boolean[];
}

export type CheckedRowsState = CheckedRowState[];

export function formatDateMMddyyyy(dateString: string): string {
  const mm = dateString.substring(0, 2);
  const dd = dateString.substring(2, 4);
  const yyyy = dateString.substring(4, 8);
  return `${mm}/${dd}/${yyyy}`;
}

export const randomLeaseCode = () => {
  return generateTenantCode(8)
}

export function toTypeScriptType(dataType: string): string {
  switch (dataType) {
    case 'bigint': return 'number';
    case 'boolean': return 'boolean';
    case 'character varying': return 'string';
    case 'date': return 'Date';
    case 'integer': return 'number';
    case 'jsonb': return 'any';
    case 'numeric': return 'number';
    case 'smallint': return 'number';
    case 'text': return 'string';
    case 'timestamp with time zone': return 'Date';
    case 'timestamp without time zone': return 'Date';
    case 'uuid': return 'string';
    default: return 'unknown';
  }
}
