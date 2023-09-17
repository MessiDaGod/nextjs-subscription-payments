import React, {HTMLAttributes, useEffect, useRef, useState} from 'react'
import {Pagination} from '@/components/pagination'
import styles from '@/components/DataGrid/DataGrid.module.scss'
import {
  ColumnWidths,
  ColumnDataTypes,
  isNumber,
  isDate,
  setListeners,
  getVisualLength,
  sortByColumn,
  isColumnHidden,
  toTypeScriptType,
} from '@/components/utils'
import type {
  RecoveryProfiles,
  ExpensePools,
  ChargeCodes,
  CheckedRowsState,
  CommChargeSchedules,
  CommLeaseRecoveryParams,
  CommUnits,
  CommOptions,
  CommUnitXrefs,
  CommSQFTs,
  CommRecoveryExcludes,
  CommLeases,
} from '@/components/utils'
import cn from 'classnames'
import 'react-datepicker/dist/react-datepicker.css'
import {MeissnerGridHeaderCell} from '@/components/DataGrid/MeissnerGridHeaderCell'
import {DynamicGridTableCell} from '@/components/grid/DynamicGridTableCell'
import Spinner from '@/components/Spinner'
import {useRouter} from 'next/router'
import {Session} from '@supabase/auth-helpers-react'
import Spinner2 from '@/components/Spinner2'
import {MeissnerGridCell} from '@/components/DataGrid/MeissnerGridCell'
import datagridstyles from '@/components/DataGrid/DataGrid.module.scss'
import {
  handleFileUpload,
  setLeaseCode,
  setOverridePropertyCode,
  setOverrideUnitCode,
  setOverrideLeaseCode,
  setProgress,
  commUnitAdded,
  commUnitsAdded,
  commUnitUpdated,
  commUnitRemoved,
  commUnitsCleared,
  setCommUnits,
  commChargeScheduleAdded,
  commChargeSchedulesAdded,
  commChargeScheduleUpdated,
  commChargeScheduleRemoved,
  commChargeSchedulesCleared,
  setCommChargeSchedules,
  useGetValuesFromSupabaseQuery,
  selectAllcommUnits,
  selectAllCommChargeSchedules,
  selectAllCommLeases,
  commLeaseAdded,
  commLeasesAdded,
  commLeaseUpdated,
  commLeaseRemoved,
  commLeasesCleared,
  selectAllCommUnitXrefs,
  commUnitXRefAdded,
  commUnitXrefsAdded,
  commUnitXRefUpdated,
  commUnitXRefRemoved,
  commUnitXrefsCleared,
  selectAllcommSQFTs,
  selectAllcommLeaseRecoveryParams,
  selectAllcommOptions,
  commOptionsAdded,
  commOptionAdded,
  commOptionsUpdated,
  commOptionsRemoved,
  commOptionsCleared,
  commLeaseRecoveryParamsCleared,
  commLeaseRecoveryParamAdded,
  commLeaseRecoveryParamRemoved,
  clearUnitCodes,
  commLeaseRecoveryParamsAdded,
  setProgressStep,
  commLeaseRecoveryParamsUpdated,
  commSQFTUpdated,
  setItemsPerPage,
  setTotalItems,
  setChargeCodes,
  setSearchValue,
  commSQFTAdded,
  commSQFTRemoved,
  setSearchValueExpensePool,
  setActiveTab,
  setCheckedRows,
  filterChargeCodes,
  setCommChargeSchedulesCurrentPage,
  setCommChargeSchedulesSortOrder,
  setCommChargeSchedulesColumnId,
  setHeaderCheckboxChecked,
  setHaveChangesBeenMade,
  commLeaseRecoveryParamUpdated,
  sortcommChargeSchedules,
  setTimesClickedCommChargeSchedules,
  setSortState,
  sortCommLeaseRecoveryParams,
  setTimesClickedCommLeaseRecoveryParams,
  sortcommUnits,
  setTimesClickedcommUnits,
  setRecoveryProfiles,
  selectAllcommExcludes,
  commOptionUpdated,
  setCurrentPage,
  setTimesClickedcommOptions,
  sortcommOptions,
  setTimesClickedcommUnitXrefs,
  sortcommUnitXrefs,
  setTimesClickedcommSQFTs,
  sortcommSQFTs,
  setTimesClickedcommRecoveryExcludes,
  sortcommRecoveryExcludes,
  selectAllColumnsInformation,
  columnsInformationAdded,
  setTimesClickedcommLeases,
  sortcommLeases,
} from '@/app/excelFileSlice'
import {useDispatch, useSelector} from 'react-redux'
import {RootState, AppDispatch} from '@/app/store'
import Checkbox from '@/components/Checkbox'
import {
  Log,
} from '@/components/utils'

interface DataGridProps extends HTMLAttributes<HTMLDivElement> {
  tableName: string
  selectItem?: string
  style?: React.CSSProperties
  showPagination?: boolean
  numItems?: number | undefined
  dropdownValue?: string
  refreshData?: any[] | any | null
  DynamicGridLoaded?: boolean
  ItemsPerPage?: number
  columnWidths?: ColumnWidths | null
  errorFileRef?: React.RefObject<HTMLDivElement>
  isForErrorFile?: boolean
  dateFormat?: string
  height?: string
  includeDelete?: boolean
  session?: Session
  includeSettings?: boolean
  includeStatus?: boolean
  isPosting?: boolean
  success?: boolean
  rowIndex?: number
  initialSortColumn?: string
  hideBlankColumns?: boolean
  doHeaderize?: boolean
  includeCheckbox?: boolean
  recoveryProfiles?: Partial<RecoveryProfiles>[] | null
  chargeCodes?: Partial<ChargeCodes>[]
  readOnly?: boolean
  screenWidth?: number
  customFilterFunction?: (datas: any[]) => any[]
  onLoad?: (event?: any) => void
  onClick?: (event?: any, val?: string, columnId?: string, rowIndex?: number) => void
  onDateChange?: (date: Date) => void
  onUpdate?: (
    actionType: string,
    e: React.ChangeEvent<HTMLInputElement>,
    newValue: string | number | Date | null,
    rowIndex: number,
    columnIndex: number,
    columnName: string,
    objectType: string
  ) => Promise<void>
}

function MeissnerDataGrid({
  className,
  refreshData,
  height,
  showPagination = true,
  includeDelete,
  includeStatus = true,
  isPosting,
  success,
  rowIndex,
  tableName,
  recoveryProfiles,
  initialSortColumn = 'id',
  hideBlankColumns = false,
  doHeaderize = false,
  includeCheckbox = false,
  ItemsPerPage = null,
  chargeCodes,
  readOnly = false,
  screenWidth,
  onUpdate,
}: DataGridProps) {

  const dispatch = useDispatch()
  const commUnits = useSelector(selectAllcommUnits)
  const commChargeSchedules = useSelector(selectAllCommChargeSchedules)
  const commLeases = useSelector(selectAllCommLeases)
  const commUnitXrefs = useSelector(selectAllCommUnitXrefs)
  const commSQFTs = useSelector(selectAllcommSQFTs)
  const commLeaseRecoveryParams = useSelector(selectAllcommLeaseRecoveryParams)
  const commOptions = useSelector(selectAllcommOptions)
  const recoveryExcludes = useSelector(selectAllcommExcludes)
  const checkedRowsState = useSelector((state: RootState) => state.excelFile.checkedRows)
  const checkedRows = (checkedRowsState as Array<any>).find((row) => row.tableName === tableName)?.rows || []
  const itemsPerPageState = useSelector((state: RootState) => state.excelFile.itemsPerPage)
  const itemsPerPage = ItemsPerPage ?? itemsPerPageState ?? 20
  const headerCheckboxChecked = useSelector((state: RootState) => state.excelFile.headerCheckboxChecked)
  const currentSortState = useSelector((state: RootState) => {
    const formattedTableName = tableName ? tableName.charAt(0).toLowerCase() + tableName.slice(1) : ''
    const tableSortState = state.sortState[formattedTableName]
    return (tableSortState && tableSortState[0]) || null
  })

  const columnsInformation = JSON.parse(sessionStorage.getItem('columnsInformation'))
  const functionInfo = JSON.parse(sessionStorage.getItem('GetChargeCodesInfo'))


  if (window !== undefined) {
    screenWidth =  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    let table = document.querySelector(`.${datagridstyles['divTable']}`);
    if (table) {
      let headers = table.querySelectorAll(`.${styles['th']}`);
      let totalWidth = 0;

      headers.forEach(header => {
        //@ts-ignore
        Log('Header: ' + header?.offsetWidth)
        //@ts-ignore
        totalWidth += header?.offsetWidth;
      });

      Log('Total Table Width:' + totalWidth);
    }
  }

  // Attach scroll listener
  useEffect(() => {
    const table = document.querySelector(`.${datagridstyles['divTable']}`);
    table.addEventListener('scroll', handleScroll);
    handleScroll(); // Call initially to set visibility

    return () => {
      // Cleanup
      table.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let data, filteredRows
  const filterColumns = (rows, columnsToKeep) => {
    return rows.map((row) => {
      return Object.keys(row)
        .filter((key) => columnsToKeep.includes(key))
        .reduce((obj, key) => {
          obj[key] = row[key]
          return obj
        }, {})
    })
  }


  const properties = commLeases.map((x) => x.property_code.trim())
  let filtered

  if (recoveryProfiles && recoveryProfiles.length === 0) {
    filtered = recoveryProfiles.filter((x) => properties.includes(x.propertycode.trim()))
    filteredRows = filterColumns(filtered, [
      'leasetypecode',
      'leasetypedesc',
      'groupcode',
      'propertycode',
      'estimatechargecode',
      'expensepoolcode',
      'expensepooldescription',
      'reconcilechargecode',
    ])

    var moreFiltered = filteredRows.filter(
      (x) => x.expensepoolcode && typeof x.expensepoolcode === 'string' /*&& !x.expensepoolcode.trim().startsWith('x')*/
    )
    recoveryProfiles.length === 0 && dispatch(setRecoveryProfiles(moreFiltered))
  }

  switch (tableName) {
    case 'CommUnits':
      data = commUnits
      break
    case 'CommChargeSchedules':
      data = commChargeSchedules
      break
    case 'CommLeases':
      data = commLeases
      break
    case 'CommUnitXrefs':
      data = commUnitXrefs
      break
    case 'CommSQFTs':
      data = commSQFTs
      break
    case 'CommOptions':
      data = commOptions
      break
    case 'CommRecoveryExcludes':
      data = recoveryExcludes
      break
    case 'ChargeCodes':
      const sortedData = sortByColumn(refreshData, 'code', true)
      const onemore = [...sortedData]
      filteredRows = filterColumns(onemore, ['code', 'description', 'account_code', 'accountdesc'])
      data = filteredRows
      break
    case 'ExpensePools':
      data = refreshData
      break
    case 'RecoveryProfiles':
      filtered = refreshData.filter((x) => properties.length === 0 || properties.includes(x.propertycode.trim()))
      filteredRows = filterColumns(filtered, [
        'leasetypecode',
        'leasetypedesc',
        'groupcode',
        'propertycode',
        'estimatechargecode',
        'expensepoolcode',
        'expensepooldescription',
        'reconcilechargecode',
      ])
      var moreFiltered = filteredRows.filter(
        (x) => x.expensepoolcode && typeof x.expensepoolcode === 'string' /* && !x.expensepoolcode.trim().startsWith('x')*/
      )
      data = moreFiltered
      break
    case 'CommLeaseRecoveryParams':
      // filtered = recoveryProfiles.filter((x) => properties.includes(x.propertycode.trim()))
      // filteredRows = filterColumns(filtered, [
      //   'leasetypecode',
      //   'leasetypedesc',
      //   'groupcode',
      //   'propertycode',
      //   'estimatechargecode',
      //   'expensepoolcode',
      //   'expensepooldescription',
      //   'reconcilechargecode',
      // ])

      // var moreFiltered = filteredRows.filter(
      //   (x) => x.expensepoolcode && typeof x.expensepoolcode === 'string' /* && !x.expensepoolcode.trim().startsWith('x')*/
      // )

      // const newCommLeaseRecoveryParams = commLeaseRecoveryParams
      // const numToAdd = moreFiltered.length - newCommLeaseRecoveryParams.length
      // for (let i = 0; i < numToAdd; i++) {
      //   moreFiltered.push(newCommLeaseRecoveryParams[0])
      // }
      // const temp = newCommLeaseRecoveryParams
      // const updatedRecoveries = temp.map((newCommLeaseRecoveryParam, index: number) => {
      //   const item = moreFiltered[index]

      //   return {
      //     ...newCommLeaseRecoveryParam, // This will copy existing properties
      //     recovery_group: item.groupcode,
      //     charge_code: item.estimatechargecode,
      //     expense_pool: item.expensepoolcode,
      //     reconcile_charge_code: item.reconcilechargecode,
      //   }
      // })
      data = refreshData
      // saveDataBeforeSwitchingTabs('commLeaseRecoveryParams')
      break
    case 'PropExpensePoolAccounts':
      filtered = refreshData.filter((x) => properties.length === 0 || properties.includes(x.propertycode.trim()))
      filteredRows = filterColumns(filtered, [
        'id',
        'propertycode',
        'acctcode',
        'acctdescription',
        'isexclude',
        'excludeid',
        'expensepoolcode',
      ])

      data = filteredRows

      break
    default:
      data = refreshData
      break
  }

  function saveDataBeforeSwitchingTabs(objectType?: string) {
    const loweredObjectType = objectType.charAt(0).toLowerCase() + objectType.slice(1)
    const forlog = JSON.parse(localStorage.getItem(loweredObjectType))
    if (!forlog || !Array.isArray(forlog)) return

    const changesById = Object.fromEntries(forlog.map((change) => [change.id, change]))
    // Update the state variable based on the objectType parameter
    switch (loweredObjectType) {
      case 'commLeases':
        // dispatch(commLeaseUpdated({id: item[id], changes: {[columnName]: newValue ?? ''}}))

        // Map through existing data and apply changes where ids match
        const updatedData = commLeases.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })
        localStorage.setItem('CommLeases', JSON.stringify(updatedData))
        updatedData.forEach((item) => {
          dispatch(commLeaseUpdated({id: item.id, changes: changesById[item.id]}))
        })

        break
      case 'commSQFTs':
        // Map through existing data and apply changes where ids match
        const commSQFTsdata = commSQFTs.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })
        localStorage.setItem('CommSQFTs', JSON.stringify(commSQFTsdata))
        commSQFTsdata.forEach((item) => {
          dispatch(commSQFTUpdated({id: item.id, changes: changesById[item.id]}))
        })
        break
      case 'commUnits':
        // Map through existing data and apply changes where ids match
        const commUnitsdata = commUnits.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })

        commUnitsdata.forEach((item) => {
          // Map through existing data and apply changes where ids match
          const updatedData = commLeases.map((item) => {
            const changesForThisItem = changesById[item.id]
            if (changesForThisItem) {
              // Merge changes into this item
              return {...item, ...changesForThisItem}
            } else {
              // No changes for this item, leave as-is
              return item
            }
          })
          localStorage.setItem('CommUnits', JSON.stringify(commUnitsdata))
          commUnitsdata.forEach((item) => {
            dispatch(commUnitUpdated({id: item.id, changes: changesById[item.id]}))
          })
        })
        break
      case 'commChargeSchedules':
        const columnsToRemove = ['objectName', 'rowIndex']
        const filterColumns = (rows, columnsToRemove) => {
          return rows.map((row) => {
            return Object.keys(row)
              .filter((key) => !columnsToRemove.includes(key))
              .reduce((obj, key) => {
                obj[key] = row[key]
                return obj
              }, {})
          })
        }

        const filteredRows = filterColumns(commChargeSchedules, columnsToRemove)
        const commChargeSchedulesdata = filteredRows.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })
        localStorage.setItem('CommChargeSchedules', JSON.stringify(commChargeSchedulesdata))
        commChargeSchedulesdata.forEach((item) => {
          dispatch(commChargeScheduleUpdated({id: item.id, changes: changesById[item.id]}))
        })
        break
      case 'commUnitXrefs':
        // Map through existing data and apply changes where ids match
        const commUnitXrefsdata = commUnitXrefs.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })
        localStorage.setItem('CommUnitXrefs', JSON.stringify(commUnitXrefsdata))
        commUnitXrefsdata.forEach((item) => {
          dispatch(commUnitXRefUpdated({id: item.id, changes: changesById[item.id]}))
        })
        break
      case 'commLeaseRecoveryParams':
        // Map through existing data and apply changes where ids match
        const commLeaseRecoveryParamsdata = commLeaseRecoveryParams.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })

        localStorage.setItem('CommLeaseRecoveryParams', JSON.stringify(commLeaseRecoveryParamsdata))

        commLeaseRecoveryParamsdata.forEach((item) => {
          dispatch(commLeaseRecoveryParamUpdated({id: item.id, changes: changesById[item.id]}))
        })
        break
      case 'commOptions':
        // Map through existing data and apply changes where ids match
        const commOptionsdata = commOptions.map((item) => {
          const changesForThisItem = changesById[item.id]
          if (changesForThisItem) {
            // Merge changes into this item
            return {...item, ...changesForThisItem}
          } else {
            // No changes for this item, leave as-is
            return item
          }
        })

        localStorage.setItem('CommOptions', JSON.stringify(commOptionsdata))

        commOptionsdata.forEach((item) => {
          dispatch(commOptionUpdated({id: parseInt(item.id), changes: changesById[parseInt(item.id)]}))
        })
        break
      default:
        // Object type not recognized
        break
    }
    // }
  }

  if (tableName !== 'ChargeCodes' && tableName !== 'ExpensePools' && tableName !== 'RecoveryProfiles') {
    const onemore = data && Array.isArray(data) ? [...data] : []
    const columnsToRemove = ['objectName', 'rowIndex']
    const filterColumns = (rows, columnsToRemove) => {
      return rows.map((row) => {
        return Object.keys(row)
          .filter((key) => !columnsToRemove.includes(key))
          .reduce((obj, key) => {
            obj[key] = row[key]
            return obj
          }, {})
      })
    }

    const filteredRows = filterColumns(onemore, columnsToRemove)
    data = filteredRows
  }

  /**
   * This is the function that sets initial column width
   */

  const tableRef = useRef<HTMLDivElement | null>(null)
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const currentPage = useSelector((state: RootState) => state.excelFile.currentPage)
  const router = useRouter()
  const {query} = router

  var headerWidths: ColumnWidths = {}
  var dataWidths: ColumnWidths = {}
  var columnOrder: string[] | null

  if (!data) return null
  // useEffect(() => {
  columnOrder = data && Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : Object.keys(data)
  // columnsWidths = setColumnWidths(tableRef.current, null);
  // Time('getVisualLengths');
  const rootStyles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : 0
  const colDividerWidth =
    rootStyles && typeof window !== 'undefined' ? parseInt(rootStyles.getPropertyValue('--colDividerWidth')) : 0
  const tdPadding = rootStyles && data ? parseInt(rootStyles.getPropertyValue('--tdpadding')) : 0
  const thpadding = rootStyles && data ? parseInt(rootStyles.getPropertyValue('--thpadding')) : 0

  const headerLengths = !data || data.length === 0 ? Object.keys(data) : Object.keys(data[0])

  if (headerLengths) {
    Object.values(headerLengths).forEach((value) => {
      value.replace(' expand_more', '').replace(' expand_less', '')
      headerWidths[value] = getVisualLength(value) + colDividerWidth + thpadding + 30
    })
  }

  const dataLengths = data ? Object.values(data) : null

  if (data) {
    dataLengths.forEach((row) => {
      Object.keys(row).forEach((key) => {
        const value = row[key]
        const visualLength = getVisualLength(value)
        dataWidths['checkbox'] = 13
        if (dataWidths[key] && dataWidths[key] < visualLength) {
          dataWidths[key] = visualLength + colDividerWidth + thpadding
        } else if (!dataWidths[key]) {
          dataWidths[key] = visualLength + colDividerWidth + tdPadding
        }
      })
    })
  }

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

  const [columnVisibility, setColumnVisibility] = useState(
    Object.keys(headerWidths).reduce((acc, columnName) => {
      acc[columnName] = false;
      return acc;
    }, {})
  )

  const handleScroll = () => {
    const table = document.querySelector(`.${datagridstyles['divTable']}`)
    const scrollLeft = table.scrollLeft;
    let runningTotalWidth = 0;

    const newColumnVisibility = { ...columnVisibility };

    Object.keys(headerWidths).forEach((columnName) => {
      runningTotalWidth += headerWidths[columnName];
      newColumnVisibility[columnName] = runningTotalWidth <= (scrollLeft + screenWidth);
    });

    setColumnVisibility(newColumnVisibility);
  }


  function onClickDelete(e, columnName) {
    const newObjs = [...data]
    newObjs.forEach((row) => {
      delete row[columnName]
    })
    // setData(newObjs)
  }

  function setDataFromHtmlTables() {
    const tables = document.querySelectorAll(`.${datagridstyles['divTable']}`)
    for (const table of tables) {
      const parent = table.parentElement as HTMLElement
      const etlFileName = parent.getAttribute('data-table-name')
      const rows = Array.from(table.querySelectorAll(`.${datagridstyles['tr']}`))

      const jsonData = []

      // Extract header row
      const headerRow = Array.from(rows[0].querySelectorAll(`.${styles['th']}`))
      const headerValues = headerRow.map((cell) => cell.textContent.trim())

      // Extract data rows
      for (let i = 1; i < rows.length; i++) {
        const dataRow = Array.from(rows[i].querySelectorAll(`.${styles['td']}`))
        const dataValues = dataRow.map((cell) => (cell.querySelector('input') as HTMLInputElement).value)
        const rowData = Object.fromEntries(headerValues.map((header, index) => [header, dataValues[index]]))
        jsonData.push(rowData)
      }

      const dataObject = {etlFileName: etlFileName, object: jsonData}

      return dataObject
    }
  }

  async function handleDataUpdate() {
    const allData = setDataFromHtmlTables()

    allData && saveDataBeforeSwitchingTabs('CommLeaseRecoveryParams')
  }

  const handleColumnClick = (column: string) => {
    if (tableName === 'CommChargeSchedules') {
      dispatch(setTimesClickedCommChargeSchedules({column: column as keyof CommChargeSchedules}))
      dispatch(
        sortcommChargeSchedules({data, column: column as keyof CommChargeSchedules, sortState: currentSortState?.sortState})
      )
    }
    if (tableName === 'CommLeaseRecoveryParams') {
      dispatch(setTimesClickedCommLeaseRecoveryParams({column: column as keyof CommLeaseRecoveryParams}))
      dispatch(
        sortCommLeaseRecoveryParams({
          data,
          column: column as keyof CommLeaseRecoveryParams,
          sortState: currentSortState?.sortState,
        })
      )
    }

    if (tableName === 'CommUnits') {
      dispatch(setTimesClickedcommUnits({column: column as keyof CommUnits}))
      dispatch(
        sortcommUnits({
          data,
          column: column as keyof CommUnits,
          sortState: currentSortState?.sortState,
        })
      )
    }
    // Code block for handling tableName logic
    if (tableName === 'CommOptions') {
      dispatch(setTimesClickedcommOptions({column: column as keyof CommOptions}))
      dispatch(
        sortcommOptions({
          data,
          column: column as keyof CommOptions,
          sortState: currentSortState?.sortState,
        })
      )
    }
    // Code block for handling tableName logic
    if (tableName === 'CommUnitXrefs') {
      dispatch(setTimesClickedcommUnitXrefs({column: column as keyof CommUnitXrefs}))
      dispatch(
        sortcommUnitXrefs({
          data,
          column: column as keyof CommUnitXrefs,
          sortState: currentSortState?.sortState,
        })
      )
    }
    // Code block for handling tableName logic
    if (tableName === 'CommSQFTs') {
      dispatch(setTimesClickedcommSQFTs({column: column as keyof CommSQFTs}))
      dispatch(
        sortcommSQFTs({
          data,
          column: column as keyof CommSQFTs,
          sortState: currentSortState?.sortState,
        })
      )
    }
    // Code block for handling tableName logic
    if (tableName === 'CommRecoveryExcludes') {
      dispatch(setTimesClickedcommRecoveryExcludes({column: column as keyof CommRecoveryExcludes}))
      dispatch(
        sortcommRecoveryExcludes({
          data,
          column: column as keyof CommRecoveryExcludes,
          sortState: currentSortState?.sortState,
        })
      )
    }
    if (tableName === 'CommLeases') {
      dispatch(setTimesClickedcommLeases({ column: column as keyof CommLeases }))
      dispatch(
        sortcommLeases({
          data,
          column: column as keyof CommLeases,
          sortState: currentSortState?.sortState,
        })
      )
    }
  }

  function Header({columnsOrder, objectType}) {
    const header = includeStatus
      ? [
          <MeissnerGridHeaderCell
            key={'status'}
            columnName={'status'}
            includeDelete={false}
            tableRef={tableRef}
            doHeaderize={doHeaderize}
            includeSettings={false}
            columnIndex={0}
            tableName={tableName}
          />,
        ]
      : []

    const headerCellCheckbox =
      includeCheckbox && data.length > 1 ? (
        <Checkbox
          key={'headerCheckbox'}
          label={''}
          checked={headerCheckboxChecked[tableName]}
          onChange={(e) => handleCheckboxChange(e, -1)}
        />
      ) : null
    if (includeCheckbox && data.length > 1 && headerCellCheckbox) {
      header.push(headerCellCheckbox)
    }

    if (!columnsOrder) return <Spinner />

    const remainingHeaders = columnsOrder.map((cols: string, index: number) => {
      const hide = isColumnHidden(data, cols) && hideBlankColumns
      if (hide) {
        return null
      }
      const indexWithCheckbox = includeCheckbox ? index + 1 : index
      const columnIndex = indexWithCheckbox + (includeStatus ? 1 : 0)

      const columnsInformation = useSelector(selectAllColumnsInformation)
      const dataType = columnsInformation.find(
        (x) => x.column_name === cols && x.table_name === tableName.toLowerCase()
      )?.data_type
      const tsDataType = toTypeScriptType(dataType)

      const chargeCodeDataType = tableName === 'ChargeCodes' ? functionInfo.find((x) => x.columnName === cols) : null

      const colName = chargeCodeDataType ? chargeCodeDataType.columnName : cols

      return (
        headerWidths && (
          <MeissnerGridHeaderCell
            key={colName}
            columnName={colName}
            includeDelete={includeDelete}
            ItemsPerPage={itemsPerPage}
            initialWidth={`${headerWidths[colName]}px`}
            tableRef={tableRef}
            columnDataType={chargeCodeDataType ? chargeCodeDataType.dataType : tsDataType}
            handleSort={() => handleColumnClick(colName)}
            onClickDelete={onClickDelete}
            includeSettings={false}
            columnIndex={columnIndex}
            tableName={tableName}
            // hide={columnVisibility[colName]}
            doHeaderize={doHeaderize}>
            <div
              className={styles['coldivider']}
              onMouseDown={(e) => {
                const curColWidth = setListeners(e, tableRef.current, styles['coldivider'])
              }}></div>
          </MeissnerGridHeaderCell>
        )
      )
    })

    remainingHeaders.forEach((x: any) => {
      if (x) {
        header.push(x)
      }
    })

    return <>{header}</>
  }

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number | null) => {
    saveDataBeforeSwitchingTabs(tableName)
    const newCheckedRows = {tableName: tableName, rows: [...(checkedRows || [])]}

    if (rowIndex === -1 && newCheckedRows.rows.length < data.length) {
      if (newCheckedRows.rows.length < data.length) {
        const numRows = data.length - newCheckedRows.rows.length
        for (let i = 0; i < numRows; i++) {
          newCheckedRows.rows.push(event.target.checked)
        }
      }
      dispatch(setHeaderCheckboxChecked({tableName: tableName, checked: headerCheckboxChecked[tableName]}))
    } else if (rowIndex === -1 && newCheckedRows.rows.length === data.length) {
      newCheckedRows.rows.forEach((x, i) => {
        newCheckedRows.rows[i] = !newCheckedRows.rows[i]
      })
      dispatch(setHeaderCheckboxChecked({tableName: tableName, checked: headerCheckboxChecked[tableName]}))
    }

    if (rowIndex !== -1) {
      newCheckedRows.rows[rowIndex] = !newCheckedRows.rows[rowIndex]
    }

    dispatch(setCheckedRows({tableName: tableName, rows: newCheckedRows.rows}))

    await handleDataUpdate()
  }

  // const handleCheckboxChangeHeader = async (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number | null) => {
  //   dispatch(setHeaderCheckboxChecked({tableName: tableName, checked: !headerCheckboxChecked[tableName]}))

  //   await handleDataUpdate()
  // }

  type RowListProps = {
    onCheckedChange: (checked: Array<boolean>) => void
  }

  function RowList({}: RowListProps) {

    if (Array.isArray(data) && data.length === 0) {
      return <></>
    }

    const rowList = [...data].slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const StatusCellValue = isPosting ? (
      <Spinner2 />
    ) : includeStatus ? (
      <span
        className={cn('material-symbols-outlined', !success ? 'white' : success ? 'green' : 'red')}
        style={{width: '53px'}}
        data-row-id={rowIndex + 1}>
        send
      </span>
    ) : null

    function checkboxCellValue(rowIndex: number) {
      return isPosting ? (
        <Spinner2 />
      ) : includeCheckbox && data.length > 1 ? (
        <Checkbox label={''} checked={checkedRows[rowIndex]} onChange={(e) => handleCheckboxChange(e, rowIndex)} />
      ) : null
    }

    return (
      headerWidths && (
        <>
          {rowList.map((row, rowIdx) => (
            <div key={rowIdx} className={cn(styles['tr'])} data-row-id={rowIdx + 1} role="row">
              {StatusCellValue}
              {checkboxCellValue(rowIdx)}
              {Object.entries(row).map(([key, value], idx) => {
                let val = value && value.hasOwnProperty('value') ? (value as any).value : value
                // if (val === null || val === undefined) val = ''
                const objectType = tableName ? tableName.charAt(0).toLowerCase() + tableName.slice(1) : ''
                const hide = isColumnHidden(rowList, key) && hideBlankColumns
                if (hide) {
                  return null
                }
                const columnName = key.toLowerCase()
                const columnIndex = idx
                if (columnsInformation && columnsInformation.length === 0) {
                  throw new Error('columnsInformation is empty')
                }
                const dataType = columnsInformation.find(
                  (x) => x.column_name === columnName && x.table_name === tableName.toLowerCase()
                )?.data_type
                const tsDataType = toTypeScriptType(dataType)

                return (
                  <DynamicGridTableCell
                    key={`${rowIdx}_${idx}`}
                    columnName={key}
                    rowIndex={`${rowIdx}_${idx}`}
                    width={`${!headerWidths ? '55px' : headerWidths[key] + 'px'}`}
                    minWidth={`${!headerWidths ? '55px' : headerWidths[key] + 'px'}`}
                    style={key.toLowerCase() === 'id' ? {display: 'none'} : undefined}>
                    <MeissnerGridCell
                      key={key.toLowerCase()}
                      value={val as any}
                      columnName={key.toLowerCase()}
                      columnIndex={idx}
                      columnType={tsDataType}
                      rowIndex={rowIdx}
                      className={styles['td']}
                      isLookup={false}
                      step={100}
                      width={headerWidths[key]}
                      tableContainerRef={tableContainerRef}
                      chargeCodes={chargeCodes}
                      readOnly={readOnly}
                      //@ts-ignore
                      onUpdate={(actionType, event, newValue, rowIdx, key) => {
                        onUpdate && onUpdate(actionType, event, newValue, rowIdx, columnIndex, columnName, objectType)
                      }}
                    />
                  </DynamicGridTableCell>
                )
              })}
            </div>
          ))}
        </>
      )
    )
  }

  function handlePageChange(page: number) {
    dispatch(setCurrentPage(page))
  }

  function Render({columnsOrder}) {
    const handleCheckedChange = (checked) => {
      dispatch(setCheckedRows(checked))
    }

    if (Array.isArray(data)) {
      const totalPages = Math.ceil(data.length / itemsPerPage)
      return (
        headerWidths && (
          <div
            className={cn(styles['table-container'])}
            data-table-name={tableName ?? ''}
            ref={tableContainerRef}
            style={{overflow: 'scroll', maxWidth: query.collapsed ? '95vw' : '90vw'}}>
            <div ref={tableRef} className={datagridstyles['divTable']}>
              <div className={`${cn('rdg-header-row', styles['thead'])} ${styles['rdg-header-row']}`}>
                <div className={styles['tr']} data-row-id="0">
                  <Header columnsOrder={columnsOrder} objectType={tableName} />
                </div>
              </div>
              <div key={'tbody'} className={styles['tbody']}>
                <RowList key={'RowList'} onCheckedChange={handleCheckedChange} />
              </div>
            </div>

            {showPagination && (
              <Pagination
                id="pagination1"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={data.length}
              />
            )}
          </div>
        )
      )
    }
  }

  return (
    headerWidths && (
      <div className={className} style={{height: height ?? 'auto'}}>
        <Render columnsOrder={columnOrder} />
      </div>
    )
  )
}

export default MeissnerDataGrid
