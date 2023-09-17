import {useEffect, useId, useState, useRef} from 'react'
import styles from '@/components/dropdown/GenericDropdown.module.scss'
import {
  Log,
  getDate,
  headerize,
  setColumnWidths,
  ColumnDataTypes,
  getSelectItem,
} from '@/components/utils'
import {v4 as uuidv4} from 'uuid'
import {NumberInput} from '@/components/NumberInput'
import cn from 'classnames'
import Button from '@/components/Button'
import SDatePicker from '@/components/SDatePicker'
import {useRouter} from 'next/router'
import {Database} from '@/components/types/supabase'
import {useUser, useSupabaseClient, Session, useSession} from '@supabase/auth-helpers-react'
import DropdownTemplateRedux from '@/components/dropdown/DropdownTemplateRedux'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'

type filters = Database['public']['Tables']['filters']['Row']

interface Props {
  children?: React.ReactNode
  columnName: string
  columnDataType?: ColumnDataTypes
  onSortClick?: (event: any, columnName: string, columnIndex: number) => void
  onClickDelete?: (event: any, columnName: string) => void
  onFunctionAmountClick?: (event: any, columnName: string, value: number) => void
  onFunctionDateClick?: (event: any, columnName: string, value: Date) => void
  onFunctionTextClick?: (event: any, columnName: string, value: string) => void
  handleSort?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    columnName: string,
    sortState: 'asc' | 'desc' | null
  ) => void
  initialState?: boolean
  initialWidth?: string | null
  includeDelete?: boolean
  ItemsPerPage?: number
  tableRef?: React.MutableRefObject<HTMLDivElement>
  dataType?: string
  initialSortOrder?: 'asc' | 'desc' | null
  includeFunctions?: boolean
  doHeaderize?: boolean
  columnIndex?: number
  includeSettings?: boolean
}

export function DynamicGridHeaderCell({
  children,
  columnName,
  includeDelete,
  ItemsPerPage,
  initialWidth,
  tableRef,
  dataType,
  initialSortOrder,
  columnDataType,
  onSortClick,
  onClickDelete,
  onFunctionAmountClick,
  onFunctionDateClick,
  onFunctionTextClick,
  includeFunctions = false,
  doHeaderize = false,
  columnIndex,
  includeSettings = true,
  handleSort,
}: Props) {
  const [sortState, setSortState] = useState(
    initialSortOrder === null ? null : initialSortOrder === 'asc' ? true : false
  )

  const [sortOrderByColumn, setSortOrderByColumn] = useState<{[key: string]: boolean}>({})
  // const sortState = initialSortOrder
  const [numberValue, setNumberValue] = useState(0)
  const [dateValue, setDateValue] = useState(new Date())
  const [textValue, setTextValue] = useState('')
  const [showAmountFunction, setShowAmountFunction] = useState(false)
  const [showDateFunction, setShowDateFunction] = useState(false)
  const [showTextFunction, setShowTextFunction] = useState(false)
  const [isShowing, setIsShowing] = useState(false)
  const [dropdownValue, setDropdownValue] = useState(null)
  const [focus, setFocus] = useState(false)

  const inputRef = useRef(null)

  const supabase = createPagesBrowserClient<Database>()
  const user = useUser()
  const session = useSession()

  const router = useRouter()

  // useEffect(() => {
  //   if (!user) return

  //   async function initInsert() {
  //     const count = await supabase
  //       .from('filters')
  //       .select('*', {head: true, count: 'exact'})
  //       .eq('userid', user.id)
  //       .eq('page', router.pathname)

  //     if (count.count === 0) {
  //       await supabase.from('filters').upsert(
  //         [
  //           {
  //             userid: user.id,
  //             updated_at: new Date().toISOString(),
  //             page: router.pathname,
  //             query_params: '',
  //           },
  //         ],
  //         {onConflict: 'userid, page'}
  //       )
  //     }
  //   }
  //   initInsert()
  // }, [user, session?.user])

  function handleSortByColumn(e, columnIndex) {
    setSortOrderByColumn((prevState) => ({
      ...prevState,
      [columnIndex]: !prevState[columnIndex],
    }))
  }

  async function handleUpdateQueryParam(param, newParamValue) {
    const {query} = router
    const existingParamValue = query[param]

    let updatedParamValue

    if (existingParamValue) {
      if (Array.isArray(existingParamValue)) {
        updatedParamValue = [...existingParamValue, newParamValue]
      } else {
        updatedParamValue = [existingParamValue, newParamValue]
      }
    } else {
      updatedParamValue = [newParamValue]
    }

    const queryString = Object.entries(query)
      .filter(([key]) => key !== param)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${key}=${v}`).join('&')
        }
        return `${key}=${value}`
      })
      .join('&')

    const updatedQuery = queryString
      ? `${queryString}&${param}=${updatedParamValue.join(',')}`
      : `${param}=${updatedParamValue.join(',')}`

    const upsertResponse = await supabase.from('filters').upsert(
      [
        {
          userid: user.id,
          updated_at: new Date().toISOString(),
          page: router.pathname,
          query_params: JSON.parse(JSON.stringify(updatedQuery)),
        },
      ],
      {onConflict: 'userid, page'}
    )

    router.push({
      pathname: router.pathname,
      search: `?${updatedQuery}`,
    })
  }

  function handleNumberInputChange(value) {
    setNumberValue(value)
  }

  function handleDateInputChange(date) {
    const fmtDate = date.toString('MM/dd/yyyy')
    setDateValue(new Date(fmtDate))
  }

  function handleTextInputChange(text) {
    setTextValue(text)
  }

  function handleSettingsButtonClicked(e, columnName) {
    if (!e.target.classList.contains('MuiSvgIcon-root')) return
    setIsShowing(!isShowing)
  }

  function handleSetShowTextFunction(e) {
    setShowTextFunction(!showTextFunction)
  }

  // function onSort(e, name) {
  //   handleSort(e, name)
  // }

  function handleFunctionTextClick(e, columnName, val) {
    const table = tableRef.current
    const value = (table.querySelector(`input[name="${columnName}"]`) as HTMLInputElement).value
    const valuesToUpdate = table.querySelectorAll(`div[data-column-id="${columnName}"]`)

    if (valuesToUpdate.length > 0) {
      ;[
        valuesToUpdate.forEach((val, index: number) => {
          if (index === 0) return
          const input = val.querySelector('input')
          if (input) {
            ;(input as HTMLInputElement).value = value
          }
        }),
      ]
    }
    onFunctionTextClick(e, columnName, value)
  }

  function handleSetSortOrderByColumn(e, columnIndex) {
    setSortOrderByColumn((prevState) => ({
      ...prevState,
      [columnIndex]: !prevState[columnIndex],
    }))
    Log(sortOrderByColumn)
  }

  function ColumnSettings({columnName}) {
    if (columnName === 'STATUS') return null
    return (
      <>
        <div
          className="MuiDataGrid-menuIcon MuiDataGrid-menuOpen"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 1000,
            position: 'relative',
          }}>
          <button
            className="more_vert"
            tabIndex={-1}
            type="button"
            aria-label="Menu"
            title="Menu"
            aria-haspopup="true"
            style={{display: 'flex', fontSize: '14px'}}
            aria-controls={useId()}
            aria-expanded={'true'}
            onClick={(e) => handleSettingsButtonClicked(e, columnName)}>
            <svg
              className={cn('MuiSvgIcon-root MuiSvgIcon-fontSizeSmall clicked')}
              focusable="true"
              aria-hidden="false"
              viewBox="0 0 24 24"
              data-testid="TripleDotsVerticalIcon"
              style={{
                paddingLeft: '5px',
                paddingRight: '5px',
                width: '1em',
                height: '1em',
                fontSize: '10px',
                color: 'white',
                zIndex: 1000,
              }}>
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
            <span className="MuiTouchRipple-root css-w0pj6f"></span>
          </button>
        </div>
        <div style={{display: isShowing ? 'flex' : 'none', marginTop: '15px'}}>
          <div
            style={{
              opacity: isShowing ? '1' : '0',
              transitionDelay: '.1s',
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: isShowing ? 'auto' : 'none',
              position: 'fixed',
              zIndex: 100000000000,
              transform: 'translateX(-100%)',
            }}>
            <div
              className="flex-container-settings"
              style={{
                flexDirection: 'column',
                width: '200px',
                flexWrap: 'wrap',
                alignContent: 'space-around',
                flexFlow: 'column-wrap',
                backgroundColor: 'black',
              }}>
              {includeDelete && (
                <>
                  <span
                    style={{fontSize: '18px', paddingLeft: '5px', paddingRight: '5px'}}
                    className="material-symbols-outlined white">
                    delete
                  </span>
                  Delete Column
                </>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 'inherit',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => {
                  setSortState(true)
                  onSortClick(e, columnName, columnIndex)
                }}>
                <span
                  style={{fontSize: '18px', paddingLeft: '5px', paddingRight: '5px'}}
                  className="material-symbols-outlined white">
                  arrow_upward
                </span>
                Sort by ASC
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 'inherit',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => {
                  setSortState(false)
                  onSortClick(e, columnName, columnIndex)
                }}>
                <span
                  style={{fontSize: '18px', paddingLeft: '5px', paddingRight: '5px'}}
                  className="material-symbols-outlined white">
                  arrow_downward
                </span>
                Sort by DESC
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 'inherit',
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <span style={{fontSize: '18px'}} className="material-symbols-outlined white">
                  filter_alt
                </span>
                Filter
              </div>
              {columnDataType[columnName] === 'number' &&
                (columnName.toUpperCase() === 'ACCRUAL' ||
                  columnName.toUpperCase() === 'OFFSET' ||
                  columnName.toUpperCase() === 'ACCOUNT' ||
                  columnName.toUpperCase() === 'PERSON' ||
                  columnName.toUpperCase() === 'PROPERTY') && (
                  <div
                    className={cn('expand-item expanded')}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: 'inherit',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                    <span
                      style={{fontSize: '18px'}}
                      className="material-symbols-outlined white"
                      onClick={() => setShowAmountFunction(!showAmountFunction)}>
                      functions
                    </span>
                    Update {doHeaderize ? headerize(columnName) : columnName}
                    <div className="func">
                      {(columnName.toUpperCase() === 'ACCRUAL' ||
                        columnName.toUpperCase() === 'OFFSET' ||
                        columnName.toUpperCase() === 'ACCOUNT' ||
                        columnName.toUpperCase() === 'PERSON' ||
                        columnName.toUpperCase() === 'PROPERTY') && (
                        <DropdownTemplateRedux
                          selectItem={getSelectItem(columnName).lookup}
                          showPagination={true}
                          showCheckbox={true}
                          rowIndex={0}
                          columnName={columnName}
                          onClick={(e) => {
                            setTextValue(e.target.value)
                          }}
                          fontSize="13px"
                          ItemsPerPage={ItemsPerPage}
                          isAll={true}
                        />
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        handleFunctionTextClick(e, columnName, textValue)
                        setIsShowing(false)
                      }}
                      Name="Submit"
                      title="Click to push Text Value out to details..."
                    />
                  </div>
                )}
              {columnDataType[columnName] === 'number' &&
                columnName.toUpperCase() !== 'ACCRUAL' &&
                columnName.toUpperCase() !== 'OFFSET' &&
                columnName.toUpperCase() !== 'ACCOUNT' &&
                columnName.toUpperCase() !== 'PERSON' &&
                columnName.toUpperCase() !== 'PROPERTY' && (
                  <div
                    className={cn('expand-item expanded')}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: 'inherit',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                    <span
                      style={{fontSize: '18px'}}
                      className="material-symbols-outlined white"
                      onClick={() => setShowAmountFunction(!showAmountFunction)}>
                      functions
                    </span>
                    Update {doHeaderize ? headerize(columnName) : columnName}
                    <div className="func">
                      <input
                        id={`${columnName}`}
                        name={columnName ?? 'myInput'}
                        type="number"
                        style={{display: 'inline-flex', width: `${'100%'}`, height: '100%'}}
                        readOnly={false}
                        value={numberValue}
                        onChange={(e) => {
                          setNumberValue(parseInt(e.target.value))
                        }}
                      />
                    </div>
                    <Button
                      onClick={(e) => {
                        onFunctionAmountClick(e, columnName, e.target.value)
                        setIsShowing(false)
                      }}
                      Name="Submit"
                      title="Click to push Date out to details..."
                    />
                  </div>
                )}
              {columnDataType[columnName] === 'date' && (
                <div
                  className={cn('expand-item expanded')}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: 'inherit',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <span
                    style={{fontSize: '18px'}}
                    className="material-symbols-outlined white"
                    onClick={() => setShowDateFunction(!showDateFunction)}>
                    calendar_month
                  </span>
                  Update {doHeaderize ? headerize(columnName) : columnName}
                  <div className="func">
                    <SDatePicker
                      dateString={dateValue as unknown as string}
                      columnId={columnName}
                      rowIndex={-1}
                      onDateChange={(date) => handleDateInputChange(date)}
                    />
                  </div>
                  <Button
                    onClick={(e) => {
                      onFunctionDateClick(e, columnName, dateValue)
                      setIsShowing(false)
                    }}
                    Name="Submit"
                    title="Click to push Date out to details..."
                  />
                </div>
              )}
              {columnDataType[columnName] === 'string' &&
                /^ACCRUAL$|^OFFSET$|^ACCOUNT$|^PERSON$|^PROPERTY$/i.test(columnName) && (
                  <div
                    className={cn('expand-item expanded')}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: 'inherit',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                    <span
                      style={{fontSize: '18px'}}
                      className="material-symbols-outlined white"
                      onClick={handleSetShowTextFunction}>
                      edit_note
                    </span>
                    Update {doHeaderize ? headerize(columnName) : columnName}
                    <div className="func">
                      <DropdownTemplateRedux
                        selectItem={getSelectItem(columnName).lookup}
                        showPagination={true}
                        showCheckbox={true}
                        rowIndex={0}
                        columnName={columnName}
                        onClick={(e) => {
                          setTextValue(e.target.value)
                        }}
                        fontSize="13px"
                        ItemsPerPage={ItemsPerPage}
                        isAll={true}
                      />
                      {/^ACCRUAL$|^OFFSET$|^ACCOUNT$|^PERSON$|^PROPERTY$/i.test(columnName) && (
                        <DropdownTemplateRedux
                          selectItem={getSelectItem(`${columnName}_code`).lookup}
                          showPagination={true}
                          showCheckbox={true}
                          rowIndex={0}
                          columnName={`${columnName}_code`}
                          onClick={(e) => {
                            setTextValue(e.target.value)
                          }}
                          fontSize="13px"
                          ItemsPerPage={ItemsPerPage}
                          isAll={true}
                        />
                      )}
                      {!/^ACCRUAL$|^OFFSET$|^ACCOUNT$|^PERSON$|^PROPERTY$/i.test(columnName) && (
                        <input
                          id={`${columnName}`}
                          name={columnName ?? 'myInput'}
                          type="text"
                          style={{display: 'inline-flex', width: '100%', height: '100%'}}
                          readOnly={false}
                          defaultValue={''}
                          // value={textValue}
                          // onChange={(e) => { setTextValue(e.target.values)}}
                        />
                      )}
                    </div>
                    <Button
                      onClick={(e) => {
                        handleFunctionTextClick(e, columnName, textValue)
                        setIsShowing(false)
                      }}
                      Name="Submit"
                      title="Click to push Text Value out to details..."
                    />
                  </div>
                )}

              {columnDataType[columnName] === 'string' &&
                columnName.toUpperCase() !== 'ACCRUAL' &&
                columnName.toUpperCase() !== 'OFFSET' &&
                columnName.toUpperCase() !== 'ACCOUNT' &&
                columnName.toUpperCase() !== 'PERSON' &&
                columnName.toUpperCase() !== 'PROPERTY' && (
                  <div
                    className={cn('expand-item expanded')}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: 'inherit',
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1000,
                    }}>
                    <span
                      style={{fontSize: '18px'}}
                      className="material-symbols-outlined white"
                      onClick={handleSetShowTextFunction}>
                      edit_note
                    </span>
                    Update {doHeaderize ? headerize(columnName) : columnName}
                    <div className="func">
                      <input
                        id={`${columnName}`}
                        name={columnName ?? 'myInput'}
                        type="text"
                        style={{display: 'inline-flex', width: `${'100%'}`, height: '100%'}}
                        readOnly={false}
                        defaultValue={''}
                        // value={textValue}
                        // onChange={(e) => { setTextValue(e.target.values)}}
                      />
                    </div>
                    <Button
                      onClick={(e) => {
                        handleFunctionTextClick(e, columnName, textValue)
                        setIsShowing(false)
                      }}
                      Name="Submit"
                      title="Click to push Text Value out to details..."
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </>
    )
  }

  function handleDivThSortClick(e, columnName, columnIndex) {
    const target = e.target as HTMLElement
    if (!target.classList.contains(styles['th']) && e.target.localName !== 'span') return
    if (target instanceof HTMLInputElement) {
      return
    }
    if (e.target.localName === 'svg') {
      setIsShowing(!isShowing)
      return
    }
    setSortState(sortState === null ? true : !sortState)
    handleSortByColumn(e, columnIndex)
    Log(sortOrderByColumn)
    handleSort(
      e,
      columnName,
      sortOrderByColumn[columnIndex] === null
        ? 'asc'
        : sortOrderByColumn[columnIndex] === true
        ? 'asc'
        : 'desc'
    )
  }

  function render({columnName, columnIndex}) {
    const sort = sortOrderByColumn[columnIndex] || false
    const isObjectEmpty = Object.keys(sortOrderByColumn).length === 0
    return (
      <div
        key={uuidv4()}
        className={styles['th']}
        data-column-id={columnName}
        style={{
          width: initialWidth,
          display: 'flex',
          alignItems: 'left',
          paddingLeft: '5px',
          paddingRight: '5px',
          minWidth: 'content',
        }}
        onClick={(e) => handleDivThSortClick(e, columnName, columnIndex)}>
        <span style={{flex: '0 0 auto', color: 'white'}}>
          {doHeaderize ? headerize(columnName) : columnName}
        </span>
        <span
          className={`${'material-symbols-outlined'} white`}
          style={{
            backgroundColor: 'transparent',
            display: columnName.toUpperCase() === 'status' ? 'none' : 'flex',
            paddingRight: '5px',
            paddingLeft: '5px',
            boxSizing: 'content-box',
            fontSize: '10px',
            flexShrink: 0,
          }}
          data-column-id={columnName}>
          {isObjectEmpty === true ? '' : sort === true ? 'expand_more' : 'expand_less'}
        </span>
        {includeSettings && <ColumnSettings columnName={columnName} />}
        {children}
      </div>
    )
  }

  const Result = render({columnName, columnIndex})

  return <>{Result}</>
}
