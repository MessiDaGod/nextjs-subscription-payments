/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {Pagination} from '@/components/pagination'
import styles from '@/components/dropdown/GenericDropdown.module.scss'
import {
  CustomError,
  Log,
  getMyType,
  isColumnHidden,
  ColumnWidths,
  getVisualLength,
  DataCell,
  headerize,
  isMobile,
  nameof,
} from '@/components/utils'
import cn from 'classnames'
import GoodColumns from './GoodColumns.json'
import {DropdownInput} from '@/components/dropdown/DropdownInput'
import DropdownTemplateData from '@/components/dropdown/DropdownTemplateData'
import {GridCell} from '@/components/grid/GridCell'
import {useRouter} from 'next/router'
import Spinner2 from '@/components/Spinner2'
import {useUser, useSession, useSupabaseClient} from '@supabase/auth-helpers-react'
import type { Database } from '@/types_db'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

export interface DropdownTemplateReduxProps {
  selectItem?: string
  style?: React.CSSProperties
  showPagination?: boolean
  showCheckbox?: boolean
  itemsPerPage?: number | null
  numItems?: number | null
  columns?: string[] | null
  dropdownValue?: string | null
  getHasValue?: boolean | null
  children?: React.ReactNode
  rowIndex?: number | null
  fontSize?: string
  ItemsPerPage?: number
  columnWidths?: ColumnWidths
  inputMaxWidth?: string
  isAll?: boolean
  columnName?: string
  width?: string | number
  columnIndex?: number
  columnType?: string
  inputId?: string
  client?: string
  initialData?: Array<any>
  isPosting?: boolean
  onUpdate?: (
    newValue: string | number | Date,
    rowIndex: number,
    columnIndex: string | number
  ) => void
  onClick?: (
    e: any,
    value: string,
    rowIndex: string | number | null,
    columnIndex: string | number | null,
    isAll?: boolean
  ) => void
}

let numRenders = 0

function DropdownTemplateRedux({
  selectItem,
  showCheckbox,
  numItems,
  dropdownValue,
  rowIndex,
  fontSize,
  ItemsPerPage,
  isAll,
  columnName,
  columnWidths,
  width,
  columnIndex,
  columnType,
  inputId,
  initialData,
  client,
  isPosting,
  onClick,
  onUpdate,
}: DropdownTemplateReduxProps) {
  const user = useUser()
  const supabase = createPagesBrowserClient<Database>()
  const [data, setData] = useState(initialData)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showSearchBox, setShowSearchBox] = useState(false)
  const hasPagination = true
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(isMobile() ? 5 : ItemsPerPage)
  const [query, setQuery] = useState('')
  const [inputValue, setInputValue] = useState<DataCell>({value: dropdownValue, ischanged: true})
  const [dataCellState, setMyDataCellState] = useState<DataCell>({
    value: null,
    columnIndex: null,
    rowIndex: null,
  })

  const router = useRouter()

  useEffect(() => {
    if (!initialData || initialData.length === 0) return
    setData(initialData)
  }, [initialData, selectItem])

  useEffect(() => {
    setInputValue({value: dropdownValue, ischanged: true})
  }, [dropdownValue])

  const containerRef = useRef(null)
  var headerWidths: ColumnWidths = {}
  var dataWidths: ColumnWidths = {}
  var columnOrder: string[] | null

  const searchInputRef = useRef(null)
  const myType = getMyType(selectItem)
  const myColumns = GoodColumns[myType]
  const columnKeys = myColumns
    ? Object.entries(myColumns).map(([key, value], index: number) => {
        return {Item: myType, Index: index, Name: value['Name']}
      })
    : null

  const filteredColumns = useMemo(() => {
    return myType && columnKeys.map((col) => col.Name)
  }, [myType, columnKeys])

  numItems = numItems ?? 100

  function handleMouseEnter() {
    const container = containerRef.current
    if (container) {
      if (!isPosting) container.style.display = ''
      if (isPosting) container.style.display = 'none'
      if (isPosting) setShowSearchBox(false)
      if (!isPosting) setShowSearchBox(true)
    }
  }
  function handleMouseLeave() {
    setShowSearchBox(false)
    const container = containerRef.current
    if (container) {
      container.style.display = 'none'
    }
  }

  function handleDropdownEnterListener(e) {
    const dropdown = dropdownRef?.current as HTMLElement
    dropdown.addEventListener('mouseenter', handleMouseEnter)
    dropdown.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      dropdown.removeEventListener('mouseenter', handleMouseEnter)
      dropdown.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  const isLoaded = Array.isArray(data) && data.length > 0 && showSearchBox
  columnOrder = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : null
  if (isLoaded) {
    const rootStyles = getComputedStyle(document.documentElement)
    const colDividerWidth = parseInt(rootStyles.getPropertyValue('--colDividerWidth'))
    const tdPadding = parseInt(rootStyles.getPropertyValue('--tdpadding'))
    const thpadding = parseInt(rootStyles.getPropertyValue('--thpadding'))
    const headerLengths = Object.keys(data[0])

    Object.values(headerLengths).forEach((value) => {
      headerWidths[value] = getVisualLength(value) + colDividerWidth + thpadding + 30
    })
    const dataLengths = Object.values(data)
    dataLengths.forEach((row, rowNumber: number) => {
      Object.keys(row).forEach((key) => {
        if (rowNumber > ItemsPerPage) return
        const value = row[key]
        const visualLength = getVisualLength(value)
        if (dataWidths[key] && dataWidths[key] < visualLength) {
          dataWidths[key] = visualLength + colDividerWidth + tdPadding + thpadding
        } else if (!dataWidths[key]) {
          dataWidths[key] = visualLength + colDividerWidth + tdPadding
        }
      })
    })
    function compareColumnWidths(obj1: ColumnWidths, obj2: ColumnWidths): ColumnWidths {
      const result: ColumnWidths = {}

      for (const key of Object.keys(obj1)) {
        const value1 = obj1[key]
        const value2 = obj2[key]

        result[key] = Math.max(value1, value2)
      }

      return result
    }
    headerWidths = compareColumnWidths(headerWidths, dataWidths)
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
  }

  const handleInputSearchChange = async (event) => {
    const userid = user.id
    event.preventDefault()
    // event.stopPropagation();
    setQuery(event.target.value)
    if (
      event.target.value === '' ||
      event.target.value === undefined ||
      event.target.value === null
    ) {
      setQuery('')
      const result = await DropdownTemplateData({supabase, client, userid, selectItem, numItems})
      setData(result)
      return
    }
    if (event.target.value !== '') {
      setQuery(event.target.value)
      handleSearch(event.target.value)
    }
  }

  useEffect(() => {
    if (showSearchBox) {
      const container = containerRef.current
      if (!container) return
      // Get the bounding rectangle of the container
      const containerRect = container.getBoundingClientRect()
      var shiftAmountX = 0
      var shiftAmountY = 0
      // Check if the container is off the right edge of the viewport
      if (Math.round(containerRect.right - window.innerWidth) > 0) {
        // Calculate the amount to shift the container to the left
        shiftAmountX = Math.round(-(containerRect.right - window.innerWidth))
      }
      if (Math.round(containerRect.bottom - window.innerHeight) > 0) {
        // Calculate the amount to shift the container to the left
        shiftAmountY = Math.round(-(containerRect.bottom - window.innerHeight))
      }
      const yShift = shiftAmountY
      const xShift = shiftAmountX
      if (yShift.toString() !== '0' || xShift.toString() !== '0')
        container.style.transform =
          yShift.toString() !== '0' && xShift.toString() !== '0'
            ? `translateY(${yShift}px) translateX(${xShift}px)`
            : yShift.toString() !== '0'
            ? `translateY(${yShift}px)`
            : `translateX(${xShift}px)`
      searchInputRef?.current?.focus()
    }
  }, [showSearchBox])

  function handleSearch(searchValue: string) {
    const filterData = [...data]

    const rowsWithData = []

    filterData.forEach((item) => {
      const rowMatches = []
      ;[...Object.values(item)].forEach((value) => {
        const val = value ? value.toString().toLowerCase() : ''
        const matchIndex = val.indexOf(searchValue.toLowerCase())
        if (matchIndex !== -1) {
          rowMatches.push(matchIndex)
        }
      })
      if (rowMatches.length > 0) {
        rowsWithData.push({item, rowMatches})
      }
    })

    const filteredData = [
      ...rowsWithData
        .sort((a, b) => {
          // Sort by the index of the first match for the whole word
          const wholeWordMatchA = a.rowMatches.find((index) => index === 0)
          const wholeWordMatchB = b.rowMatches.find((index) => index === 0)
          if (wholeWordMatchA !== undefined && wholeWordMatchB === undefined) {
            return -1
          } else if (wholeWordMatchA === undefined && wholeWordMatchB !== undefined) {
            return 1
          } else if (wholeWordMatchA !== undefined && wholeWordMatchB !== undefined) {
            if (wholeWordMatchA < wholeWordMatchB) {
              return -1
            } else if (wholeWordMatchA > wholeWordMatchB) {
              return 1
            } else {
              // If the whole word matches are equal, sort by the index of the first partial match
              const partialMatchA = Math.min(...a.rowMatches.filter((index) => index > 0))
              const partialMatchB = Math.min(...b.rowMatches.filter((index) => index > 0))
              if (partialMatchA < partialMatchB) {
                return -1
              } else if (partialMatchA > partialMatchB) {
                return 1
              }
            }
          }
          // If there are no matches, don't change the order
          return 0
        })
        .map((itemWithMatches) => itemWithMatches.item),
    ]
    filteredData.length > 0 && setData(filteredData)
  }

  function handleInputValueChange(
    value?: string | number | Date,
    rowIndex?: number,
    columnIndex?: number
  ) {
    setMyDataCellState((prevState) => ({
      ...prevState,
      data: {
        val: value,
        columnId: columnIndex,
        rowIndex: rowIndex,
      },
    }))
  }

  function handleSort(e, columnName: string) {
    try {
      if (Array.isArray(data)) {
        const sorted = [...data]
        sorted.sort((a, b) => {
          const aVal = a[columnName]
          const bVal = b[columnName]

          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          } else {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0
          }
        })

        setData(sorted)
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      }
    } catch (error) {
      console.error(error)
    }
  }

  function Header({}) {
    if (!columnKeys) return <Spinner2 />
    const header = columnOrder.map((header, columnIndex: number) => {
      return (
        <div
          data-column-id={columnIndex}
          key={columnIndex}
          style={{
            width: `${
              columnIndex + 1 === columnKeys.length ? '100%' : headerWidths[header] + 'px'
            }`,
          }}>
          <input
            type="text"
            readOnly={true}
            value={headerize(header)}
            style={{
              fontWeight: 'bold',
              userSelect: 'none',
              border: 'transparent',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          />
        </div>
      )
    })

    return <>{header}</>
  }

  function handleClick(
    e: any,
    value: string | number | Date,
    rowIndex: number,
    columnIndex: number,
    isAll?: boolean
  ) {
    const row = (e.target as HTMLInputElement).parentElement.parentElement
    const input = row.querySelectorAll('input')[1] as HTMLInputElement
    if (isAll) {
      const {query} = router
      const col = headerize(nameof(columnName))
      router.push({
        pathname: router.pathname,
        query: {
          ...query,
          [col]: input?.value,
        },
      })
    }
    setInputValue({value: input?.value, ischanged: true})
    handleMouseLeave()
  }

  function RowList({rows}) {
    if (!columnKeys) return <Spinner2 />
    let filteredData = []
    if (client !== 'Blanton Turner') {
      filteredData =
      filteredColumns &&
      rows.map((obj) => {
        const filteredProps = {}
        Object.keys(obj).forEach((key) => {
          if (filteredColumns.includes(key)) {
            filteredProps[key] = obj[key]
          }
        })
        return filteredProps
      })
    }
    else {
      filteredData =
      rows.map((obj) => {
        const filteredProps = {}
        Object.keys(obj).forEach((key) => {
          filteredProps[key] = obj[key]
        })
        return filteredProps
      })
    }


    const rowList = [...filteredData]
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((row, rowIndex: number) => {
        return (
          <div key={rowIndex} data-row-id={rowIndex + 1} className={cn(styles['tr'])}>
            <div className={styles['rowdivider']}></div>
            {Object.entries(row).map(
              ([key, val], idx: number) =>
                !isColumnHidden(data, key) && (
                  <GridCell
                    key={key}
                    value={val as string}
                    columnName={columnName}
                    columnIndex={columnIndex}
                    columnType={columnType}
                    rowIndex={rowIndex}
                    width={`${idx + 1 === columnKeys.length ? '100%' : headerWidths[key] + 'px'}`}
                    className={styles['td']}
                    isLookup={true}
                    handleClick={(event, value) => {
                      handleClick(event, value, rowIndex, columnIndex, isAll)
                      onClick && onClick(event, value ? typeof value === 'string' ? value.toString() : '0' : '01/01/2000', rowIndex, columnIndex, isAll)
                    }}
                    readOnly={true}
                    isAll={isAll}
                  />
                )
            )}
          </div>
        )
      })
    if (rowList.length === 0) return <div className={styles['tr']}>No results found</div>
    return <div key={'rowList'}>{rowList}</div>
  }

  interface DropdownTemplateInputProps {
    value?: string | null
    columnId?: string
    inputMaxWidth?: string
    columnIndex?: number
    rowIndex?: number
  }
  function DropdownTemplateInput({
    value,
    columnIndex,
    rowIndex,
    columnId,
    inputMaxWidth,
  }: DropdownTemplateInputProps) {
    return (
      <DropdownInput
        inputId={inputId}
        selectItem={selectItem}
        value={value ?? ''}
        columnId={columnId}
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        width={inputMaxWidth}
        handleInputChange={(e) =>
          handleInputValueChange(value, rowIndex, columnIndex)
        }></DropdownInput>
    )
  }

  function Render() {
    if (Array.isArray(data) && data.length > 0) {
      try {
        const totalPages = Math.ceil(data.length / itemsPerPage)
        return (
          <>
            <div className={cn(styles['dd-container'], 'containerRef')} ref={containerRef}>
              <div id={'gridjs_0'} key={'gridjs_0'} className={styles['ddTable']}>
                <div className={styles['thead']}>
                  {
                    <div className={'search-panel'}>
                      <input
                        id="search-input"
                        ref={searchInputRef}
                        type="search"
                        className={cn(styles['search-input'], styles['findcomponent'])}
                        placeholder={`${'Search...'}`}
                        autoComplete="off"
                        onChange={handleInputSearchChange}
                        value={query}
                        readOnly={false}
                        style={{height: '30px', userSelect: 'text'}}></input>
                      <span className={cn('material-symbols-outlined', styles['searchicon'])}>
                        {'search'}
                      </span>
                    </div>
                  }
                </div>
                <div className={cn(styles['th'], styles['tr'])} data-row-id="0">
                  <Header />
                </div>

                <div key={'tbody'} className={styles['tbody']}>
                  <RowList rows={data} />
                </div>
                {hasPagination && (
                  <div className={cn(styles['tr'], 'tr', 'tfoot')}>
                    <Pagination
                      id="pagination"
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      style={{
                        width: '100%',
                        verticalAlign: 'center',
                        textAlign: 'center',
                        backgroundColor: 'black',
                      }}
                      totalItems={data.length}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )
      } catch (error) {
        if (error instanceof CustomError) {
          return <>{error.message}</>
        } else {
          // handle other types of errors
          throw error
        }
      }
    }
  }

  function handleClear(
    event: any,
    columnName: string | number | null,
    rowIndex: string | number | null
  ) {
    setInputValue({value: '', columnIndex: columnName, rowIndex: rowIndex, ischanged: true})
    onClick(event, '', columnName, rowIndex, false)
    setShowSearchBox(false)
  }

  const table = Render()

  if (data && data.length === 0) {
    return <Spinner2 />
  }

  if (table && Array.isArray(data) && data.length > 0) {
    return (
      <div
        key={selectItem}
        className="flexdiv"
        ref={dropdownRef}
        tabIndex={0}
        onMouseEnter={handleDropdownEnterListener}
        style={{width: width}}
        data-column-id={columnName}>
        <div className={cn(styles['dropdown'])}>
          <DropdownTemplateInput
            value={inputValue.value}
            columnId={columnName}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
          {inputValue && inputValue.value !== '' && inputValue.value !== null && inputValue.value !== undefined && !isPosting && (
            <span
              className={cn('material-symbols-outlined', 'red')}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize ?? '12px',
              }}
              onClick={(event) => handleClear(event, columnName, rowIndex)}>
              close
            </span>
          )}
        </div>
        {table}
      </div>
    )
  }
}

export default DropdownTemplateRedux
