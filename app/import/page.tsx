'use client'

import React, {useEffect} from 'react'
import axios from 'axios'
import MeissnerDataGrid from '@/components/DataGrid/MeissnerDataGrid'
import datagridstyles from '@/components/DataGrid/DataGrid.module.scss'
import * as XLSX from 'xlsx'
import {
  Contact_Type_Association,
  SliceFileData,
} from '@/components/utils'
import PopupBox from '@/components/grid/PopupBox'
import styles from '@/components/dropdown/GenericDropdown.module.scss'
import {useUser} from '@supabase/auth-helpers-react'
import {createClient} from '@supabase/supabase-js'
import LoadingBar from '@/components/LoadingBar'
import {useDispatch, useSelector} from 'react-redux'

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
  setCurrentPage,
  setItemsPerPage,
  setTotalItems,
  setChargeCodes,
  setSearchValue,
  commSQFTAdded,
  commSQFTRemoved,
  setSearchValueExpensePool,
  setActiveTab,
  setCheckedRows,
  setUserName,
  filterData,
  commUnitsUpdated,
  commChargeSchedulesUpdated,
  commLeaseRecoveryParamUpdated,
  commUnitXrefsUpdated,
  commSQFTsUpdated,
  resetSortState,
  setSearchValueRecoveries,
  selectAllcommExcludes,
  setCommLeases,
  commSQFTsCleared,
  commExcludesAdded,
  commExcludeAdded,
  commExcludesUpdated,
  commExcludesRemoved,
  commExcludesCleared,
  setFile,
  setRecoveryProfiles,
  commRecoveryProfilesAdded,
  commRecoveryProfileAdded,
  commRecoveryProfilesUpdated,
  commRecoveryProfilesRemoved,
  commRecoveryProfilesCleared,
  selectAllcommRecoveryProfiles,
  setPropertyCode,
  commLeasesUpdated,
  commOptionUpdated,
  commExcludeUpdated,
  commExcludeRemoved,
  selectAllColumnsInformation,
  setsearchValuePropExpensePoolAccounts,
} from '@/app/excelFileSlice'
import {AuthUser} from '@supabase/supabase-js'
import settingsJson from '@/components/appsettings.json'
import type {
  RecoveryProfiles,
  CommRecoveryExcludes,
  CommUnitXrefs,
  CommUnits,
  CommOptions,
  CommLeaseRecoveryParams,
  ChargeCodes,
  ExpensePools,
  CommLeases,
  CommChargeSchedules,
  CommSQFTs,
  CommPropRecoveryExcludes,
  CommPropExpensePoolAccounts,
} from '@/components/utils'
import { RootState } from '../store'

const sttngs = JSON.parse(JSON.stringify(settingsJson))
let settings = []
settings.push(...sttngs)
const meissnerGridItemsPerPageObj = settings.find((item) => item.name === 'MeissnerGridItemsPerPage')

// Access the value if the object is found
let meissnerGridItemsPerPageValue
if (meissnerGridItemsPerPageObj) {
  meissnerGridItemsPerPageValue = meissnerGridItemsPerPageObj.value
}

const supabaseUrl = 'https://rhsukgckhrdjzbribahe.supabase.co'
const supabase = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoc3VrZ2NraHJkanpicmliYWhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MzM0NTk0NiwiZXhwIjoxOTk4OTIxOTQ2fQ.yZGNqfRqBLpn0Ma00IxsOd_GiVX_96R_86yAw5vU2iI'
)

function getTableNameFromActiveTab(activeTab: number): string {
  switch (activeTab) {
    case 1:
      return 'CommLeases'
    case 2:
      return 'CommChargeSchedules'
    case 3:
      return 'CommUnits'
    case 4:
      return 'CommUnitXrefs'
    case 5:
      return 'CommSQFTs'
    case 6:
      return 'CommLeaseRecoveryParams'
    case 7:
      return 'CommOptions'
    case 8:
      return 'ChargeCodes'
    case 9:
      return 'ExpensePools'
    case 10:
      return 'RecoveryProfiles'
    case 11:
      return 'CommRecoveryExcludes'
    case 12:
      return 'PropExpensePoolAccounts'
    default:
      throw new Error('Invalid activeTab value')
  }
}

export default function MeissnerImportPage() {
  const dispatch = useDispatch()

  const user: AuthUser = useUser()
  const userEmail = user?.email

  const userName = useSelector((state: RootState) => state.excelFile.userName)
  const etlfile = useSelector((state: RootState) => state.excelFile.file)
  const activeTab = useSelector((state: RootState) => state.excelFile.activeTab)
  const checkedRowsState = useSelector((state: RootState) => state.excelFile.checkedRows)

  const tableName = getTableNameFromActiveTab(activeTab)
  const checkedRows = (checkedRowsState as Array<any>).find((row) => row.tableName === tableName)?.rows || []
  const searchValue = useSelector((state: RootState) => state.excelFile.searchValue)
  const searchValueExpensePool = useSelector((state: RootState) => state.excelFile.searchValueExpensePool)
  const searchValueRecoveries = useSelector((state: RootState) => state.excelFile.searchValueRecoveries)
  const searchValuePropExpensePoolAccounts = useSelector((state: RootState) => state.excelFile.searchValuePropExpensePoolAccounts)
  const overridePropertyCode = useSelector((state: RootState) => state.excelFile.overridePropertyCode)
  const overrideUnitCode = useSelector((state: RootState) => state.excelFile.overrideUnitCode)
  const overrideLeaseCode = useSelector((state: RootState) => state.excelFile.overrideLeaseCode)
  const leaseCode = useSelector((state: RootState) => state.excelFile.leaseCode)
  const itemsPerPage = useSelector((state: RootState) => state.excelFile.itemsPerPage)
  const status = useSelector((state: RootState) => state.excelFile.status)
  const progress = useSelector((state: RootState) => state.excelFile.progress)
  const step = useSelector((state: RootState) => state.excelFile.progressStep)

  const commUnits = useSelector(selectAllcommUnits)
  const commLeases = useSelector(selectAllCommLeases)
  const commUnitXrefs = useSelector(selectAllCommUnitXrefs)
  const commChargeSchedules = useSelector(selectAllCommChargeSchedules)
  const commSQFTs = useSelector(selectAllcommSQFTs)
  const commLeaseRecoveryParams = useSelector(selectAllcommLeaseRecoveryParams)
  const commOptions = useSelector(selectAllcommOptions)
  const recoveryExcludes = useSelector(selectAllcommExcludes)
  const commRecoveryProfiles = useSelector(selectAllcommRecoveryProfiles)
  const propertyCode = commUnits[0]?.property_code
  const originalPropertyCode = useSelector((state: RootState) => state.excelFile.originalPropertyCode)
  const originalUnitCodes = useSelector((state: RootState) => state.excelFile.originalUnitCodes)
  const originalLeaseCode = useSelector((state: RootState) => state.excelFile.originalLeaseCode)
  const ChargeCodes = useSelector((state: RootState) => state.excelFile.chargeCodes)
  let screenWidth = 0

  // if (window !== undefined) {
  //   screenWidth =  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // }

  const {data: propExpensePoolAccounts  } = useGetValuesFromSupabaseQuery({tableName: 'commpropexpensepoolaccounts', searchValue: searchValuePropExpensePoolAccounts, specificColumn: 'propertycode', propertyCode: propertyCode})

  const {
    data: chargeCodes,
    error: chargeCodesError,
    isLoading: chargeCodesLoading,
  } = useGetValuesFromSupabaseQuery({tableName: 'chargecodes', searchValue: searchValue})

  const {
    data: expensePools,
  } = useGetValuesFromSupabaseQuery({tableName: 'expensepools', searchValue: searchValueExpensePool, specificColumn: 'propertycode', propertyCode: propertyCode})

  const {
    data: recoveryProfiles,
    // error: recoveryProfilesError,
    isLoading,
  } = useGetValuesFromSupabaseQuery({tableName: 'recoveryprofiles', searchValue: searchValueExpensePool, specificColumn: 'propertycode', propertyCode: propertyCode})

  useEffect(() => {
    if (userEmail === 'joeshakely@gmail.com' && !overrideUnitCode) {
      dispatch(setOverrideUnitCode('test'))
    }
    !userName && dispatch(setUserName(userName))
    !itemsPerPage && dispatch(setItemsPerPage(meissnerGridItemsPerPageValue))
  }, [userEmail, overrideUnitCode])

  useEffect(() => {
    if (status !== 'succeeded') return
    if (!overrideUnitCode && overrideUnitCode !== '') return
    const updateItem = !overrideUnitCode ? originalUnitCodes : overrideUnitCode

    // Prepare the update objects with id and changes for each commUnit
    const commUnitsToUpdate = commUnits.map((unit) => ({
      id: unit.id, // Assuming the commUnit has an 'id' property
      changes: {
        unit_code: updateItem === '' ? null : updateItem,
      },
    }))

    const commChargeSchedulesToUpdate = commChargeSchedules.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        unit_code: updateItem === '' ? null : updateItem,
      },
    }))

    const xrefupdate = commUnitXrefs.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        unit_code: updateItem === '' ? null : updateItem,
      },
    }))

    const sqftsupdated = commSQFTs.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        unit_code: updateItem === '' ? null : updateItem,
      },
    }))

    dispatch(commUnitsUpdated(commUnitsToUpdate))
    dispatch(commChargeSchedulesUpdated(commChargeSchedulesToUpdate))
    dispatch(commUnitXrefsUpdated(xrefupdate))
    dispatch(commSQFTsUpdated(sqftsupdated))
  }, [overrideUnitCode, originalUnitCodes])

  useEffect(() => {
    if (status !== 'succeeded') return
    if (!overridePropertyCode && overridePropertyCode !== '') return
    const updateItem = !overridePropertyCode ? originalPropertyCode : overridePropertyCode
    // Prepare the update objects with id and changes for each commUnit
    const commUnitsToUpdate = commUnits.map((unit) => ({
      id: unit.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
      },
    }))

    const commChargeSchedulesToUpdate = commChargeSchedules.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
        lease_code:
          (leaseCode === '' || !leaseCode) && (overrideLeaseCode === '' || !overrideLeaseCode)
            ? originalLeaseCode
            : leaseCode,
      },
    }))

    const recoveryParamsToUpdate = commLeaseRecoveryParams.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
      },
    }))

    const xrefupdate = commUnitXrefs.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
      },
    }))

    const sqftsupdated = commSQFTs.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
      },
    }))
    const leaseupdated = commLeases.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        property_code: updateItem === '' ? null : updateItem,
      },
    }))

    dispatch(commLeasesUpdated(leaseupdated))
    dispatch(commUnitsUpdated(commUnitsToUpdate))
    dispatch(commChargeSchedulesUpdated(commChargeSchedulesToUpdate))
    dispatch(commLeaseRecoveryParamsUpdated(recoveryParamsToUpdate))
    dispatch(commUnitXrefsUpdated(xrefupdate))
    dispatch(commSQFTsUpdated(sqftsupdated))
  }, [overridePropertyCode, originalPropertyCode, overrideLeaseCode, leaseCode])

  useEffect(() => {
    if (status !== 'succeeded') return
    if (!overrideLeaseCode && overrideLeaseCode !== '') return
    const updateItem = !overrideLeaseCode ? originalLeaseCode : overrideLeaseCode
    const commChargeSchedulesToUpdate = commChargeSchedules.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        lease_code: updateItem === '' ? null : updateItem,
      },
    }))

    const recoveryParamsToUpdate = commLeaseRecoveryParams.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        lease_code: updateItem === '' ? null : updateItem,
      },
    }))

    const xrefupdate = commUnitXrefs.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        lease_code: updateItem === '' ? null : updateItem,
      },
    }))

    const leaseupdated = commLeases.map((item) => ({
      id: item.id, // Assuming the commUnit has an 'id' property
      changes: {
        lease_code: updateItem === '' ? null : updateItem,
      },
    }))
    dispatch(commChargeSchedulesUpdated(commChargeSchedulesToUpdate))
    dispatch(commLeaseRecoveryParamsUpdated(recoveryParamsToUpdate))
    dispatch(commUnitXrefsUpdated(xrefupdate))
    dispatch(commLeasesUpdated(leaseupdated))
  }, [overrideLeaseCode, originalLeaseCode])

  // // this is a workaround to get the data from the html tables to be updated so if no changes are made the recoery profiles export correctly
  // useEffect(() => {
  //   commLeaseRecoveryParams && commLeaseRecoveryParams.length > 0 && handleTabClick(6)
  //   commLeaseRecoveryParams && commLeaseRecoveryParams.length === 0 && handleTabClick(8)
  // }, [commLeaseRecoveryParams])

  useEffect(() => {
    handleTabClick(1)
  }, [etlfile])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setsearchValuePropExpensePoolAccounts(null))
    dispatch(setSearchValue(null))
    dispatch(setSearchValueExpensePool(null))
    dispatch(setSearchValueRecoveries(null))
    dispatch(commLeasesCleared())
    dispatch(commUnitsCleared())
    dispatch(commUnitXrefsCleared())
    dispatch(commChargeSchedulesCleared())
    dispatch(commLeaseRecoveryParamsCleared())
    dispatch(commOptionsCleared())
    dispatch(commExcludesCleared())
    dispatch(setRecoveryProfiles([]))
    dispatch(commSQFTsCleared())
    dispatch(resetSortState())
    dispatch(setFile(null))
    localStorage.removeItem('commChargeSchedules')
    localStorage.removeItem('commLeaseRecoveryParams')
    localStorage.removeItem('commUnitXrefs')
    localStorage.removeItem('commUnits')
    localStorage.removeItem('commLeases')
    localStorage.removeItem('commSQFTs')
    localStorage.removeItem('commOptions')
    localStorage.removeItem('commRecoveryExcludes')
    localStorage.removeItem('recoveryExcludes')
    localStorage.removeItem('CommChargeSchedules')
    localStorage.removeItem('CommLeaseRecoveryParams')
    localStorage.removeItem('CommUnitXrefs')
    localStorage.removeItem('CommUnits')
    localStorage.removeItem('CommLeases')
    localStorage.removeItem('CommSQFTs')
    localStorage.removeItem('CommOptions')
    localStorage.removeItem('CommRecoveryExcludes')
    localStorage.removeItem('RecoveryExcludes')
    const uploadFile = event.target.files[0] as File
    const reader = new FileReader()
    if (!uploadFile) return

    reader.onload = async (e) => {
      const ui8array = new Uint8Array(e.target.result as ArrayBuffer)

      const fileData: SliceFileData = {
        uploadFile,
        ui8array,
        chargeCodes: ChargeCodes,
        recoveryProfiles: recoveryProfiles,
        overridePropertyCode: overridePropertyCode,
        overrideUnitCode: overrideUnitCode,
        overrideLeaseCode: overrideLeaseCode,
      }

      // @ts-ignore
      dispatch(handleFileUpload(fileData)).then(() => {
        dispatch(setUserName(user?.email))
      })
    }
    // Read the file as an ArrayBuffer
    reader.readAsArrayBuffer(uploadFile)
  }

  // useEffect(() => {
  //   if (activeCell) {
  //     const id = `${(activeCell.rowIndex ?? 0)+ 1}:${activeCell.columnIndex}`
  //     const input = document.getElementById(id);
  //     input && input.focus()
  //   }
  // }, [activeCell])

  async function generateEtlFiles() {
    //@ts-ignore
    const commcontacts: Partial<CommContacts>[] = commLeases.map((lease) => {
      console.log(lease.lease_name)
      return {
        contact_type_association: Contact_Type_Association.CommercialLease,
        record_code: lease.lease_code,
        role_description: 'Billing',
        last_name: lease.lease_name,
        is_primary: -1,
        contact_code: '',
      }
    })

    const allData = await setDataFromHtmlTables()

    await saveDataBeforeSwitchingTabs(allData.etlFileName)
    let CommUnits, CommLeases, CommUnitXrefs, CommSQFTs, CommChargeSchedules, CommLeaseRecoveryParams, CommOptions, CommRecoveryExcludes;

      switch (allData.etlFileName) {
        case 'CommUnits':
          CommUnits = JSON.parse(localStorage.getItem('CommUnits'))
          break;
        case 'CommLeases':
          CommLeases = JSON.parse(localStorage.getItem('CommLeases'))
          break;
        case 'CommUnitXrefs':
          CommUnitXrefs = JSON.parse(localStorage.getItem('CommUnitXrefs'))
          break;
        case 'CommSQFTs':
          CommSQFTs = JSON.parse(localStorage.getItem('CommSQFTs'))
          break;
        case 'CommChargeSchedules':
          CommChargeSchedules = JSON.parse(localStorage.getItem('CommChargeSchedules'))
          break;
        case 'CommLeaseRecoveryParams':
          CommLeaseRecoveryParams = JSON.parse(localStorage.getItem('CommLeaseRecoveryParams'))
          break;
        case 'CommOptions':
          CommOptions = JSON.parse(localStorage.getItem('CommOptions'))
          break;
        case 'CommRecoveryExcludes':
          CommRecoveryExcludes = JSON.parse(localStorage.getItem('CommRecoveryExcludes'))
          break;
        default:
          return;
      }
    await generateCsv(CommUnits ?? commUnits, 'CommUnits')
    await generateCsv(CommLeases ?? commLeases, 'CommLeases')
    await generateCsv(CommUnitXrefs ?? commUnitXrefs, 'CommUnitXrefs')
    await generateCsv(CommSQFTs ?? commSQFTs, 'CommSQFTs')
    await generateCsv(CommChargeSchedules ?? commChargeSchedules, 'CommChargeSchedules')
    await generateCsv(CommRecoveryExcludes ?? recoveryExcludes, 'CommRecoveryExcludes')
    await generateCsv(CommLeaseRecoveryParams ?? commLeaseRecoveryParams, 'CommLeaseRecoveryParams')
    await generateCsv(CommOptions ?? commOptions, 'CommOptions')
    await generateCsv(commcontacts, 'CommContacts')

    // //@ts-ignore
    // await generateCsv(allData.etlFileName.object, allData.etlFileName);
  }



  async function generateCsv(initialData, type: string) {
    if (Array.isArray(initialData) && initialData.length === 0) return
    const columnNames = Object.keys(Array.isArray(initialData) ? initialData[0] : initialData).filter(
      (name) => name !== 'id' && name !== 'objectName' && name !== 'rowIndex'
    )
    if (columnNames.length === 0) return
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      `${type}\n` +
      columnNames.map((name) => `${name}`).join(',') +
      '\n' +
      initialData
        .map((row) => {
          return columnNames
            .map((name) => {
              const value = row[name]
              if (value === null || value === undefined || value === '') {
                return '' // Leave the cell empty for null, undefined, or empty string values
              }
              // Wrap other non-empty values in double quotes
              return typeof value === 'string' && value.includes(',') ? `"${value}"` : `${value}`
            })
            .join(',')
        })
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${type}_${(overrideLeaseCode ?? leaseCode).replace(',', '').replace('.', '')}.csv`)
    document.body.appendChild(link) // Required for Firefox
    link.click()
    document.body.removeChild(link)
  }

  const handleEtlParse = (event) => {
    const file = event.target.files[0]
    dispatch(setFile(file))
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      // let binaryString = ''
      // data.forEach((byte) => {
      //   binaryString += String.fromCharCode(byte)
      // })
      // const base64String = btoa(binaryString)
      const workbook = XLSX.read(data, {type: 'array'})
      let sheets = workbook.SheetNames
      let sheetIndex = -1
      let sampleSheetIndex = -1
      for (let i = 0; i < sheets.length; i++) {
        if (sheets[i] === 'Template') {
          sheetIndex = i
          continue
        }
        if (sheets[i] === 'Sample_CSV') {
          sampleSheetIndex = i
          continue
        }
      }

      if (sheetIndex === -1) {
        alert('No Template Sheet Found')
        return
      }
      if (sampleSheetIndex === -1) {
        alert('No Sample_CSV Sheet Found')
        return
      }
      const sheetName = workbook.SheetNames[sheetIndex]
      const sampleSheetName = workbook.SheetNames[sampleSheetIndex]
      const worksheet = workbook.Sheets[sheetName]
      const sampleWorksheet = workbook.Sheets[sampleSheetName]
      let minCol: number = XLSX.utils.decode_col('ZZZ') // Set initial minimum column to a high value
      let maxCol: number = 0 // Set initial maximum column to a low value

      for (const cell in worksheet) {
        if (cell[0] === '!') continue // Skip metadata

        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, '')) // Extract column number
        if (col < minCol) minCol = col
        if (col > maxCol) maxCol = col
      }

      // const minColLetter: string = XLSX.utils.encode_col(minCol) // Convert minimum column to letter
      // const maxColLetter: string = XLSX.utils.encode_col(maxCol) // Convert maximum column to letter

      // const columnIndex = {}
      // const columnName = {}
      // const dataType = {}
      const columnData = {}

      for (const cell in worksheet) {
        if (cell[0] === '!') continue // Skip metadata

        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, '')) // Extract column number
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        if (row !== 4 && row !== 6) continue // Skip rows that are not 4 or 6
        const columnName: string = XLSX.utils.encode_col(col) // Convert column number to letter
        const cellValue = worksheet[cell].v // Retrieve cell value
        const columnIndex: number = XLSX.utils.decode_col(columnName)

        if (row === 4) {
          columnData[columnIndex] = {
            columnIndex: col,
            columnName: cellValue,
          }
        }

        if (row === 6) {
          columnData[columnIndex].dataType = cellValue + ' NULL '
        }
      }
      // Assign columnData to combinedData
      Object.keys(columnData).forEach((columnName) => {
        columnData[columnName] = columnData[columnName]
      })
      const arr = Object.entries(columnData)

      // Sort the array based on the columnIndex property
      //@ts-ignore
      arr.sort(([, a], [, b]) => a.columnIndex - b.columnIndex)
      createPostgresTable(sampleWorksheet, columnData)
    }

    reader.readAsArrayBuffer(file)
  }

  function createPostgresTable(worksheet, columnData) {
    const cellA1 = worksheet['A1'].v // Retrieve the value of cell A1

    const tableName = (cellA1.replace(/\s+/g, '_') as string).toLowerCase() // Replace whitespace with underscore for the table name

    let createTableQuery = `DROP TABLE IF EXISTS ${tableName};\n`
    createTableQuery += `CREATE TABLE IF NOT EXISTS ${tableName} (\nid serial primary key not null,\n`

    // Iterate over the columnData object to generate the column definitions
    for (const columnName in columnData) {
      const {columnName: columnDisplayName, dataType} = columnData[columnName]
      let sqlDataType = ''

      if (!dataType) {
        sqlDataType = 'VARCHAR'
      } else if (dataType.toLowerCase().includes('character')) {
        sqlDataType = 'VARCHAR'
      } else if (dataType.toLowerCase().includes('number')) {
        sqlDataType = 'NUMERIC'
      } else if (dataType.toLowerCase().includes('date')) {
        sqlDataType = 'DATE'
      } else if (dataType.toLowerCase().includes('bit')) {
        sqlDataType = 'BOOLEAN'
      } else {
        sqlDataType = 'VARCHAR'
      }

      const columnDefinition = `"${columnDisplayName.toLowerCase()}" ${sqlDataType}`
      createTableQuery += `${columnDefinition},\n`
    }

    // Remove the trailing comma and newline character
    createTableQuery = createTableQuery.slice(0, -2)

    createTableQuery += `\n);`

    const textFile = new Blob([createTableQuery], {type: 'text/plain'})
    const url = URL.createObjectURL(textFile)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${tableName}.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function clearAbstract() {
    const inputElement = document.getElementById('abstractParseInputId') as HTMLInputElement
    inputElement.value = ''
    dispatch(setsearchValuePropExpensePoolAccounts(null))
    dispatch(setSearchValue(null))
    dispatch(setSearchValueExpensePool(null))
    dispatch(setSearchValueRecoveries(null))
    dispatch(commLeasesCleared())
    dispatch(commUnitsCleared())
    dispatch(commUnitXrefsCleared())
    dispatch(commChargeSchedulesCleared())
    dispatch(commLeaseRecoveryParamsCleared())
    dispatch(commOptionsCleared())
    dispatch(commExcludesCleared())
    dispatch(setRecoveryProfiles([]))
    dispatch(commSQFTsCleared())
    dispatch(resetSortState())
    dispatch(setFile(null))
    localStorage.removeItem('commChargeSchedules')
    localStorage.removeItem('commLeaseRecoveryParams')
    localStorage.removeItem('commUnitXrefs')
    localStorage.removeItem('commUnits')
    localStorage.removeItem('commLeases')
    localStorage.removeItem('commSQFTs')
    localStorage.removeItem('commOptions')
    localStorage.removeItem('commRecoveryExcludes')
    localStorage.removeItem('recoveryExcludes')
    localStorage.removeItem('CommChargeSchedules')
    localStorage.removeItem('CommLeaseRecoveryParams')
    localStorage.removeItem('CommUnitXrefs')
    localStorage.removeItem('CommUnits')
    localStorage.removeItem('CommLeases')
    localStorage.removeItem('CommSQFTs')
    localStorage.removeItem('CommOptions')
    localStorage.removeItem('CommRecoveryExcludes')
    dispatch(setProgress({ value: 0 }))
  }

  function clearETL() {
    dispatch(setFile(null))
    const inputElement = document.getElementById('etlParseInput') as HTMLInputElement
    inputElement.value = ''
  }

  function getWorkTime() {
    axios
      .get('/api/WorkTime')
      .then((response) => {
        const fileCountsByDate = response.data.fileCountsByDate

        if (!Array.isArray(fileCountsByDate)) {
          const numberOfFiles = fileCountsByDate.fileCount
          const minutesPerFile = 10
          const totalMinutes = numberOfFiles * minutesPerFile
          const totalHours = totalMinutes / 60
          const dollars = totalHours * 175

          alert(
            'Total Hours: ' +
              Number(totalHours).toFixed(2) +
              ' on ' +
              fileCountsByDate.date +
              ', amounting to $' +
              Number(dollars).toFixed(2)
          )
        } else {
          for (let i = 0; i < fileCountsByDate.length; i++) {
            const numberOfFiles = fileCountsByDate[i].fileCount
            const minutesPerFile = 10
            const totalMinutes = numberOfFiles * minutesPerFile
            const totalHours = totalMinutes / 60
            const dollars = totalHours * 175

            alert(
              'Total Hours: ' +
                Number(totalHours).toFixed(2) +
                ' as of ' +
                fileCountsByDate[i].date +
                ', amounting to $' +
                Number(dollars).toFixed(2)
            )
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        // Handle the error
      })
  }

  async function getWorkTimeFilesNeedToDelete() {
    axios
    try {
      const response = await axios.get('/api/ParseWorkFiles')
      const totalFilesSum = response.data.totalFiles
      alert('Out of ' + totalFilesSum + ' files, only ' + response.data.files.length + ' should count towards work time')
    } catch (error) {
      console.error('An error occurred while fetching the data:', error)
    }
  }

  async function generateWorkTimeCsv() {
    axios
      .get('/api/WorkTimeCsv')
      .then((response) => {
        const summary = response.data

        const csvContent =
          'data:text/csv;charset=utf-8,' +
          'description,date,duration,hourly,amount\n' +
          summary
            .map((folder) => {
              const date = folder.date
              const duration = folder.duration
              const hourly = folder.hourly
              const amount = folder.amount
              return `,${date},${duration},${hourly},${amount}`
            })
            .join('\n')

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'WorkTime.csv') // Adjust the filename as needed
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      .catch((error) => console.error('An error occurred:', error))
  }

  async function handleTabClick(tabNumber: number) {
    dispatch(setActiveTab(tabNumber))

    const allData = await setDataFromHtmlTables()

    allData && (await saveDataBeforeSwitchingTabs(allData.etlFileName))
  }

  async function handleCellUpdate(
    actionType: string,
    event: any,
    newValue: string | number | Date | null,
    rowIndex: number,
    columnIndex: number,
    columnName: string,
    objectType: string
  ) {
    if (objectType === '') {
      return
    }
    const fmt = objectType.charAt(0).toUpperCase() + objectType.slice(1)
    const element = document.querySelector(`[data-table-name='${fmt}']`)
    const htmlData = await handleSetDataFromHtmlTables(element as HTMLElement)
    const id = getId(element as HTMLElement, rowIndex, columnIndex)
    htmlData.object[rowIndex][columnName] = newValue

    const existingData = localStorage.getItem(objectType)
    let currentData: Array<any> = existingData ? [...JSON.parse(existingData)] : []

    // Find the existing entry with the specific id
    let existingEntry = currentData.find((item: any) => item.id === id)

    if (!existingEntry) {
      // Create a new entry if not found
      existingEntry = {
        id: id,
        objectName: objectType,
        rowIndex: rowIndex,
      }
      currentData.push(existingEntry)
    }
    // Update only the properties that have changed
    existingEntry[columnName] = newValue

    // Save the updated data back to localStorage
    localStorage.setItem(objectType, JSON.stringify(currentData))
    if (actionType === 'clear') {
      await saveDataBeforeSwitchingTabs(objectType)
    }
    if (actionType === 'change') {
      const allData = await setDataFromHtmlTables()
      console.log(allData)

      // switch (allData.etlFileName) {
      //   case 'CommUnits':
      //     dispatch(commUnitsUpdated(allData.object))
      //     break;
      //   case 'CommLeases':
      //     dispatch(commLeasesUpdated(allData.object))
      //     break;
      //   case 'CommUnitXrefs':
      //     dispatch(commUnitXrefsUpdated(allData.object))
      //     break;
      //   case 'CommSQFTs':
      //     dispatch(commSQFTsUpdated(allData.object))
      //     break;
      //   case 'CommChargeSchedules':
      //     dispatch(commChargeSchedulesUpdated(allData.object))
      //     break;
      //   case 'CommLeaseRecoveryParams':
      //     dispatch(commLeaseRecoveryParamsUpdated(allData.object))
      //     break;
      //   case 'CommOptions':
      //     dispatch(commOptionsUpdated(allData.object))
      //     break;
      //   case 'CommRecoveryExcludes':
      //     dispatch(commExcludesUpdated(allData.object))
      //     break;
      //   default:
      //     return;
      // }
    }
  }

  async function handleChargeCodesImport(e) {
    const file = e.target.files[0]

    const fileReader = new FileReader()

    fileReader.onload = async (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = XLSX.read(data, {type: 'array'})
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets['ChargeCodes']

      if (!worksheet) {
        alert('No ChargeCodes worksheet found!')
        const input = document.getElementById('loadChargeCodes') as HTMLInputElement
        input && (input.value = '')
        return
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1})

      // // Assuming headers are in the second row (index 1)
      // const headers = jsonData[0];
      const rows = jsonData.slice(1)

      // Process the jsonData and upsert it into the 'chargecodes' table
      rows.map(async (u_item, index) => {
        const item = u_item as ChargeCodes

        try {
          const updates = {
            id: item[0], // Assuming ID is in the first column (index 0)
            code: item && item[1] ? item[1].toString().trim() : '',
            chargecodeid: item[2],
            description: item[3],
            type: item[4],
            tax: item[5],
            account: item[6],
            accountdesc: item[7],
            segment0: item[8],
            segment1: item[9],
            segment2: item[10],
            segment3: item[11],
            segment4: item[12],
            segment5: item[13],
            segment6: item[14],
            segment7: item[15],
            segment8: item[16],
            segment9: item[17],
            segment10: item[18],
            segment11: item[19],
          }

          const {error} = await supabase.from('chargecodes').upsert([updates], {onConflict: 'code'})
          if (error) {
            console.error(`Error upserting data at index ${index}:`, error.message)
          }
        } catch (error) {
          console.error(`Error processing data at index ${index}:`, error)
        }
      })
    }

    fileReader.readAsArrayBuffer(file)
  }

  async function handleRecoveryGroupDetailsImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const fileReader = new FileReader()

    fileReader.onload = async (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = XLSX.read(data, {type: 'array'})
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets['Groups']

      if (!worksheet) {
        alert('No ChargeCodes worksheet found!')
        const input = document.getElementById('loadRecoveries') as HTMLInputElement
        input && (input.value = '')
        return
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1})

      // // Assuming headers are in the second row (index 1)
      // const headers = jsonData[0];
      const rows = jsonData.slice(1)

      // Process the jsonData and upsert it into the 'chargecodes' table
      rows.map(async (u_item, index) => {
        const item = u_item as RecoveryProfiles

        try {
          const updates = {
            id: parseInt(item[0].trim()),
            leasetypecode: item[1] ? item[1].trim() : item[1],
            leasetypedesc: item[2] ? item[2].trim() : item[2],
            groupid: item[3] ? item[3].trim() : item[3],
            groupcode: item[4] ? item[4].trim() : item[4],
            propertyid: item[5] ? item[5].trim() : item[5],
            propertycode: item[6] ? item[6].trim() : item[6],
            expensepoolcode: item[7] ? item[7].trim() : item[7],
            expensepooldescription: item[8] ? item[8].trim() : item[8],
            estimatechargecode: item[9] ? item[9].trim() : item[9],
            reconcilechargecode: item[10] ? item[10].trim() : item[10],
            recovcostsetid: item[11] ? item[11].trim() : item[11],
            leasetypeid: item[12] ? item[12].trim() : item[12],
            adminfeepercentage: item[13] ? item[13].trim() : item[13],
            adminchargeid: item[14] ? item[14].trim() : item[14],
            estimatechargeid: item[15] ? item[15].trim() : item[15],
            miscchargeid: item[16] ? item[16].trim() : item[16],
            trueupchargeid: item[17] ? item[17].trim() : item[17],
            baseamount: item[18] ? item[18].trim() : item[18],
            maximumamount: item[19] ? item[19].trim() : item[19],
            frequencyreconciliation: item[20] ? item[20].trim() : item[20],
            frequencycalculation: item[21] ? item[21].trim() : item[21],
            endofyearmonth: item[22] ? item[22].trim() : item[22],
            useoccupancydate: item[23] ? item[23].trim() : item[23],
            occupancydate: item[24] ? item[24].trim() : item[24],
            cpiid: item[25] ? item[25].trim() : item[25],
            minamounttype: item[26] ? item[26].trim() : item[26],
            maxamounttype: item[27] ? item[27].trim() : item[27],
            maximumincrease: item[28] ? item[28].trim() : item[28],
            minimumincrease: item[29] ? item[29].trim() : item[29],
            ceilingamount: item[30] ? item[30].trim() : item[30],
            ceilingtype: item[31] ? item[31].trim() : item[31],
            cpifactor: item[32] ? item[32].trim() : item[32],
            cpimonth: item[33] ? item[33].trim() : item[33],
            baserule: item[34] ? item[34].trim() : item[34],
            capincreasepct: item[35] ? item[35].trim() : item[35],
            capincreasebasis: item[36] ? item[36].trim() : item[36],
            capincreaseoveryr: item[37] ? item[37].trim() : item[37],
            capappliesto: item[38] ? item[38].trim() : item[38],
            isexcludereconciliation: item[39] ? item[39].trim() : item[39],
            taxchargecodeid: item[40] ? item[40].trim() : item[40],
            taxrate: item[41] ? item[41].trim() : item[41],
            donotcreatecharges: item[42] ? item[42].trim() : item[42],
            isbaseamountcredit: item[43] ? item[43].trim() : item[43],
            issalestaxadmin: item[44] ? item[44].trim() : item[44],
            parentgroupid: item[45] ? item[45].trim() : item[45],
            adminfeetype: item[46] ? item[46].trim() : item[46],
            dcfrecoverytype: item[47] ? item[47].trim() : item[47],
            dcfareacolumn: item[48] ? item[48].trim() : item[48],
            dcfoverride: item[49] ? item[49].trim() : item[49],
          }

          const {error} = await supabase.from('recoveryprofiles').upsert([updates])
          if (error) {
            console.error(`Error upserting data at index ${index}:`, error.message)
          }
        } catch (error) {
          console.error(`Error processing data at index ${index}:`, error)
        }
      })
    }

    fileReader.readAsArrayBuffer(file)
  }



  async function handleExpensePoolImport(e) {
    const file = e.target.files[0]
    if (!file) return

    const fileReader = new FileReader()

    fileReader.onload = async (e) => {
      const data = new Uint8Array(e.target.result as ArrayBuffer)
      const workbook = XLSX.read(data, {type: 'array'})
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      if (!worksheet) {
        alert('No Pools worksheet found!')
        const input = document.getElementById('loadExpensePoolsInput') as HTMLInputElement
        input && (input.value = '')
        return
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1})

      // // Assuming headers are in the second row (index 1)
      // const headers = jsonData[0];
      const rows = jsonData.slice(1)
      const {data: dataCount, error} = await supabase.from('commpropexpensepoolaccounts').select('acctid')
      const count = dataCount.length
      // Process the jsonData and upsert it into the 'chargecodes' table
      rows.map(async (u_item, index: number) => {
        if (index <= count) return
        const item = u_item as CommPropExpensePoolAccounts

        try {
          const updates = {
            propertycode: item[0] ?? null,
            acctid: item[1] ?? null,
            acctcode: item[2] ?? null,
            acctdescription: item[3] ?? null,
            isexclude: item[4] ?? null,
            excludeid: item[5] ?? null,
            expensepoolcode: item[6] ?? null,
          }
          await supabase.from('commpropexpensepoolaccounts').insert(updates)

          // if (error) {
          //   console.log('error')
          // }

          // if (error) {
          //   console.error(`Error upserting data at index ${index}:`, error.message)
          // }
        } catch (error) {
          // console.error(`Error processing data at index ${index}:`, error)
          // ignore
        }
      })
    }

    fileReader.readAsArrayBuffer(file)
  }

  async function setDataFromHtmlTables() {
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
      localStorage.setItem(etlFileName, JSON.stringify(jsonData))

      return dataObject
    }
    // }
  }

  async function saveDataBeforeSwitchingTabs(objectType: string) {
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

        commChargeSchedulesdata.forEach((item) => {
          dispatch(commChargeScheduleUpdated({id: parseInt(item.id), changes: changesById[item.id]}))
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

        commOptionsdata.forEach((item) => {
          dispatch(commOptionUpdated({id: item.id, changes: changesById[item.id]}))
        })
        break
      default:
        // Object type not recognized
        break
    }
    // }
  }

  function getId(element: HTMLElement, rowIndex: number, columnIndex: number) {
    const index = rowIndex + 1
    const cell = element.querySelector(`input[data-column-name="id"][data-row-id="${index}"]`) as HTMLInputElement

    const id = cell.value
    return id
  }

  async function handleSetDataFromHtmlTables(table: HTMLElement) {
    const parent = table.parentElement as HTMLElement
    const etlFileName = parent.getAttribute('data-table-name')
    const rows = Array.from(table.querySelectorAll(`.${datagridstyles['tr']}`))

    const jsonData = []

    // Extract header row
    const headerRow = Array.from(rows[0].querySelectorAll(`.${styles['th']}`))
    const headerValues = headerRow.map((cell) =>
      cell.textContent.trim().replaceAll(' expand_more', '').replaceAll(' expand_less', '')
    )

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

  function handleUnitCodeOverrideChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value === '' ? null : e.target.value
    localStorage.setItem('overrideUnitCode', value)
    dispatch(setOverrideUnitCode(value))
    // since the charge schedules grid is so long, it freezes the ui so it's best to switch to the lease tab first so UI doesn't freeze
    if (activeTab === 2) {
      handleTabClick(1)
    }
  }

  function handleLeaseCodeOverrideChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value === '' ? null : e.target.value
    localStorage.setItem('overrideLeaseCode', value)
    dispatch(setOverrideLeaseCode(e.target.value))
    if (activeTab === 2) {
      handleTabClick(1)
    }
  }

  const handlePropertyCodeOverrideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : e.target.value
    localStorage.setItem('overridePropertyCode', value)
    dispatch(setOverridePropertyCode(e.target.value))
    if (activeTab === 2) {
      handleTabClick(1)
    }
  }

  function handleRowAdd(objectName: string) {
    saveDataBeforeSwitchingTabs(objectName)
    if (objectName === 'commLeases') {
      const add = commLeases[commLeases.length - 1] as Partial<CommLeases>
      const maxId = Math.max(...commLeases.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commLeaseAdded(newItem))
    }
    if (objectName === 'commLeaseRecoveryParams') {
      const add = commLeaseRecoveryParams[commLeaseRecoveryParams.length - 1] as Partial<CommLeaseRecoveryParams>
      const maxId = Math.max(...commLeaseRecoveryParams.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commLeaseRecoveryParamAdded(newItem))
    }
    if (objectName === 'commUnits') {
      const add = commUnits[commUnits.length - 1] as Partial<CommUnits>
      const maxId = Math.max(...commUnits.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commUnitAdded(newItem))
    }

    if (objectName === 'commOptions') {
      const add = commOptions[commOptions.length - 1] as Partial<CommOptions>
      const maxId = Math.max(...commOptions.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commOptionAdded(newItem))
    }

    if (objectName === 'commChargeSchedules') {
      const add = commChargeSchedules[commChargeSchedules.length - 1] as Partial<CommChargeSchedules>
      const maxId = Math.max(...commChargeSchedules.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commChargeScheduleAdded(newItem))
    }
    if (objectName === 'commSQFTs') {
      const add = commSQFTs[commSQFTs.length - 1] as Partial<CommSQFTs>
      const maxId = Math.max(...commSQFTs.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commSQFTAdded(newItem))
    }

    if (objectName === 'commUnitXrefs') {
      const add = commUnitXrefs[commUnitXrefs.length - 1] as Partial<CommUnitXrefs>
      const maxId = Math.max(...commUnitXrefs.map((lease) => lease.id))
      const newItem = {...add, id: maxId + 1}
      dispatch(commUnitXRefAdded(newItem))
    }
  }

  function handleRowDelete(objectName: string) {
    if (objectName === 'commLeases') {
      const idsToRemove = commLeases
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commLeases.length) {
        idsToRemove.shift()
      }
      if (idsToRemove.length === 0) {
        if (commLeases.length === 1) return
        const maxId = Math.max(...commLeases.map((lease) => lease.id))
        dispatch(commLeaseRemoved(maxId))
      }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commLeaseRemoved(id))
        })
      }
      const newCheckedRows = [...checkedRows]
      newCheckedRows.fill(false)
      dispatch(setCheckedRows({tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows}))
    }
    if (objectName === 'commLeaseRecoveryParams') {
      const idsToRemove = commLeaseRecoveryParams
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commLeaseRecoveryParams.length) {
        idsToRemove.shift()
      }
      // if (idsToRemove.length === 0) {
      //   if (commLeaseRecoveryParams.length === 1) return
      //   const maxId = Math.max(...commLeaseRecoveryParams.map((lease) => lease.id))
      //   dispatch(commLeaseRecoveryParamRemoved(maxId))
      // }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commLeaseRecoveryParamRemoved(id))
        })
      }
      // const newCheckedRows = [...checkedRows]
      // newCheckedRows.fill(false)
      //     dispatch(setCheckedRows({ tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows }));
    }
    if (objectName === 'recoveryExcludes') {
      const idsToRemove = recoveryExcludes
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === recoveryExcludes.length) {
        idsToRemove.shift()
      }
      // if (idsToRemove.length === 0) {
      //   if (commLeaseRecoveryParams.length === 1) return
      //   const maxId = Math.max(...commLeaseRecoveryParams.map((lease) => lease.id))
      //   dispatch(commLeaseRecoveryParamRemoved(maxId))
      // }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commExcludeRemoved(id))
        })
      }
      // const newCheckedRows = [...checkedRows]
      // newCheckedRows.fill(false)
      //     dispatch(setCheckedRows({ tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows }));
    }
    if (objectName === 'commOptions') {
      const idsToRemove = commOptions
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commOptions.length) {
        idsToRemove.shift()
      }
      if (idsToRemove.length === 0) {
        if (commOptions.length === 1) return
        const maxId = Math.max(...commOptions.map((lease) => lease.id))
        dispatch(commOptionsRemoved(maxId))
      }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commOptionsRemoved(id))
        })
      }
      const newCheckedRows = [...checkedRows]
      newCheckedRows.fill(false)
      dispatch(setCheckedRows({tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows}))
    }

    if (objectName === 'commUnits') {
      const idsToRemove = commUnits
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commUnits.length) {
        idsToRemove.shift()
      }
      if (idsToRemove.length === 0) {
        if (commUnits.length === 1) return
        const maxId = Math.max(...commUnits.map((lease) => lease.id))
        dispatch(commUnitRemoved(maxId))
      }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commUnitRemoved(id))
        })
      }
      const newCheckedRows = [...checkedRows]
      newCheckedRows.fill(false)
      dispatch(setCheckedRows({tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows}))
    }
    if (objectName === 'commChargeSchedules') {
      const idsToRemove = commChargeSchedules
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commChargeSchedules.length) {
        idsToRemove.shift()
      }
      if (idsToRemove.length === 0) {
        if (commChargeSchedules.length === 1) return
        const maxId = Math.max(...commChargeSchedules.map((lease) => lease.id))
        dispatch(commChargeScheduleRemoved(maxId))
      }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commChargeScheduleRemoved(id))
        })
      }
      const newCheckedRows = [...checkedRows]
      newCheckedRows.fill(false)
      dispatch(setCheckedRows({tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows}))
    }
    if (objectName === 'commSQFTs') {
      const idsToRemove = commSQFTs
        .filter((_, index) => checkedRows[index]) // Filter the checked rows
        .map((lease) => lease.id) // Get the IDs to remove

      if (idsToRemove.length === commSQFTs.length) {
        idsToRemove.shift()
      }
      if (idsToRemove.length === 0) {
        if (commSQFTs.length === 1) return
        const maxId = Math.max(...commSQFTs.map((lease) => lease.id))
        dispatch(commSQFTRemoved(maxId))
      }
      if (idsToRemove.length > 0) {
        idsToRemove.forEach((id) => {
          dispatch(commSQFTRemoved(id))
        })
      }
      const newCheckedRows = [...checkedRows]
      newCheckedRows.fill(false)
      dispatch(setCheckedRows({tableName: objectName.charAt(0).toLowerCase() + objectName.slice(1), rows: newCheckedRows}))
    }

    if (objectName === 'commUnitXrefs') {
      if (commUnitXrefs.length === 1) return
      const maxId = Math.max(...commUnitXrefs.map((lease) => lease.id))
      dispatch(commUnitXRefRemoved(maxId))
    }
  }

  function handleSearchValueClear(objectName: string) {
    if (objectName === 'expensePools') {
      dispatch(setSearchValueExpensePool(''))
    }
    if (objectName === 'chargeCodes') {
      dispatch(setSearchValue(''))
    }
    if (objectName === 'recoveryProfiles') {
      dispatch(setSearchValueRecoveries(''))
    }
  }

  function handleItemsPerPageChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setItemsPerPage(parseInt(e.target.value)))
  }

  function handleExcelImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async (e) => {
      let data = []
      let tableName = ''

      if (file.name.endsWith('.csv')) {
        const csvContent = e.target.result as string
        const rows = csvContent.split('\n').filter((row) => row.trim() !== '')
        tableName = rows[0].trim().replaceAll(',', '')
        const headers = rows[1].split(',').map((header) => header.trim())

        for (let i = 2; i < rows.length; i++) {
          const cells = rows[i].split(',').map((cell) => cell.trim())

          let rowData = {}
          headers.forEach((header, index) => {
            rowData[header] = cells[index] || null
          })

          data.push(rowData)
        }
      } else {
        // Handle .xls and .xlsx
        const ui8array = new Uint8Array(e.target.result as ArrayBuffer)
        const workbook = XLSX.read(ui8array, {type: 'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        tableName = worksheet['A1'] ? worksheet['A1'].v : ''
        const headers: string[] = []

        for (let col = 0; col <= 25; col++) {
          const cellRef = XLSX.utils.encode_cell({r: 1, c: col})
          if (worksheet[cellRef]) {
            headers.push(worksheet[cellRef].v)
          } else {
            break
          }
        }

        let rowIndex = 2
        while (true) {
          let rowData = {}
          let emptyRow = true

          headers.forEach((header, col) => {
            const cellRef = XLSX.utils.encode_cell({r: rowIndex, c: col})
            if (worksheet[cellRef]) {
              rowData[header] = worksheet[cellRef].v
              emptyRow = false
            } else {
              rowData[header] = null
            }
          })

          if (emptyRow) break

          data.push(rowData)
          rowIndex++
        }
      }

      // Process data and dispatch updates
      const updates = []
      data.forEach((row, index: number) => {
        const id = recoveryExcludes[index]?.id || index
        const update = {
          id: id,
          changes: {},
        }

        for (const columnName of Object.keys(row)) {
          if (columnName === 'acctcode') {
            update.changes['account'] = row[columnName]
            continue
          }
          update.changes[columnName] = row[columnName]
        }
        updates.push(update)
      })

      if (tableName.toLowerCase() === 'commoptions') {
        dispatch(commOptionsUpdated(updates))
      } else if (tableName.toLowerCase() === 'commleases') {
        dispatch(commLeasesUpdated(updates))
      } else if (tableName.toLowerCase().includes('recoveryexcludes')) {
        dispatch(commExcludesUpdated(updates))
      }
    }
    ;(document.getElementById('loadFromExcelInput') as HTMLInputElement).value = ''
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  return (

    <div>
      <section
        style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          placeContent: 'flex-start',
          alignItems: 'flex-start',
          marginTop: '10px',
          paddingTop: '10px',
        }}>
        {process.env.NODE_ENV === 'development' && userEmail === 'joeshakely@gmail.com' && (
          <div className="dropdown2">
            <button className="button" style={{backgroundColor: 'blue'}} onClick={getWorkTime}>
              Work Time
            </button>
            <div className="dropdown-content2">
              <button className="button" style={{backgroundColor: 'blue'}} onClick={getWorkTimeFilesNeedToDelete}>
                Files need to delete
              </button>
              <button className="button" style={{backgroundColor: 'blue'}} onClick={generateWorkTimeCsv}>
                Generate CSV
              </button>
            </div>
          </div>
        )}
        {commChargeSchedules && Object.keys(commChargeSchedules).length > 0 && (
          <button
            style={{
              order: '0',
              zIndex: 0,
              position: 'relative',
              backgroundColor: 'blue',
              paddingRight: '10px',
            }}
            className="button"
            onClick={generateEtlFiles}
            disabled={status !== 'succeeded'}>
            Generate ETL Files
          </button>
        )}
        <button
          style={{
            order: 0,
            zIndex: 0,
            position: 'relative',
            backgroundColor: 'blue',
            paddingRight: '10px',
          }}
          className="button"
          onClick={clearAbstract}>
          Clear
        </button>
        <PopupBox id="abstractParse" message={'Upload the lease abstract and all necessary ETL files will be generated'} />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="abstractParseInputId">Abstract Parse</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <input id="abstractParseInputId" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
          </div>{' '}
        </div>
        {user && userEmail === 'joeshakely@gmail.com' && (
          <div style={{display: 'flex'}}>
            <button
              style={{
                order: '0',
                zIndex: 0,
                position: 'relative',
                backgroundColor: 'blue',
                paddingRight: '10px',
              }}
              className="button"
              onClick={clearETL}
              disabled={(document.getElementById('abstractParseInputId') as HTMLInputElement)?.value === ''}>
              Clear
            </button>
            <PopupBox
              id="etlParsePopup"
              message="Upload Yardi ETL Templates, and a .txt file will be generated with the postgres SQL to create the table"
            />
            <div style={{display: 'flex'}}>
              <label htmlFor="etlParseInput">ETL Parse</label>
              <input id="etlParseInput" type="file" accept=".xlsx, .xls" onChange={handleEtlParse} />
            </div>{' '}
          </div>
        )}
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="itemsPerPageInputId">Items/Page</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <input
              id="itemsPerPageInputId"
              type="number"
              style={{width: '50px'}}
              onChange={handleItemsPerPageChange}
              className="oppo"
              readOnly={false}
              defaultValue={itemsPerPage}
            />
          </div>{' '}
        </div>
        <PopupBox
          id="propertyCodeOverride"
          message="Property Override.  Will use entered value instead of value from abstract. Re-upload file after changing to take effect."
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="propertyCodeOverrideInput">Prop Override</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <input
              id="propertyCodeOverrideInput"
              type="text"
              onChange={handlePropertyCodeOverrideChange}
              className="oppo"
              readOnly={false}
            />
          </div>{' '}
        </div>
        <PopupBox
          id="unitCodeOverride"
          message="Unit Override.  Will use entered value instead of value from abstract. Re-upload file after changing to take effect."
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="unitCodeOverride">Unit Override</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <input
              id="unitCodeOverride"
              type="text"
              onChange={handleUnitCodeOverrideChange}
              className="oppo"
              defaultValue={overrideUnitCode ?? ''}
            />
          </div>
        </div>
        <PopupBox
          id="leaseCodeOverride"
          message="Lease Override.  Will use entered value instead of value from abstract. Re-upload file after changing to take effect."
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label htmlFor="leaseCodeOverride">Lease Override</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <input id="leaseCodeOverride" type="text" onChange={handleLeaseCodeOverrideChange} className="oppo" />
          </div>
        </div>
        {user && userEmail === 'joeshakely@gmail' && (
          <div style={{display: 'flex'}}>
            <PopupBox id="loadChargeCodesPopup" message="Load Charge Codes" />
            <div style={{display: 'flex'}}>
              <label htmlFor="loadChargeCodes">Charge Codes Import</label>
              <input id="loadChargeCodes" type="file" accept=".xlsx, .xls" onChange={handleChargeCodesImport} />
            </div>{' '}
          </div>
        )}
        {user && userEmail === 'joeshakely@gmail' && (
          <div style={{display: 'flex'}}>
            <label htmlFor="loadRecoveries">Recoveries Import</label>
            <input id="loadRecoveries" type="file" accept=".xlsx, .xls" onChange={handleRecoveryGroupDetailsImport} />
          </div>
        )}
        {user && userEmail === 'joeshakely@gmail.com' && (
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <label htmlFor="loadExpensePoolsInput">Expense Pools Import</label>
              <input id="loadExpensePoolsInput" type="file" accept=".xlsx, .xls" onChange={handleExpensePoolImport} />
            </div>
          </div>
        )}
        <PopupBox
          id="excel"
          message="Upload a file where cell A1 is the table name (commLeases, commChargeSchedules, commUnits, commUnitXrefs, commSQFTs, commLeaseRecoveryParams, commOptions, recoveryExcludes), row 2 are the column names, and row 3 and greater have the values, and the tab will be updated. You can generate the CSV files to get the column names if needed."
        />
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label htmlFor="loadFromExcelInput">Update from Excel</label>
            <input id="loadFromExcelInput" type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelImport} />
          </div>
        </div>
      </section>
      {etlfile && <h1>{etlfile}</h1>}
      <div>
        <LoadingBar
          progress={progress}
          display={status !== 'succeeded' && progress.value !== 0}
          total={8}
          progressStep={step}
        />
        {progress?.value === 100 && (
          <div className="tab-buttons">
            {commLeases && commLeases.length > 0 && (
              <button type="button" className={activeTab === 1 ? 'active' : ''} onClick={() => handleTabClick(1)}>
                Leases ({commLeases.length})
              </button>
            )}
            {commChargeSchedules && commChargeSchedules.length > 0 && (
              <button type="button" className={activeTab === 2 ? 'active' : ''} onClick={() => handleTabClick(2)}>
                Charge Schedules  <strong>({commChargeSchedules.length})</strong>
              </button>
            )}
            {commUnits && commUnits.length > 0 && (
              <button type="button" className={activeTab === 3 ? 'active' : ''} onClick={() => handleTabClick(3)}>
                Units ({commUnits.length})
              </button>
            )}
            {commUnitXrefs && commUnitXrefs.length > 0 && (
              <button type="button" className={activeTab === 4 ? 'active' : ''} onClick={() => handleTabClick(4)}>
                UnitXrefs ({commUnitXrefs.length})
              </button>
            )}
            {commSQFTs && commSQFTs.length > 0 && (
              <button type="button" className={activeTab === 5 ? 'active' : ''} onClick={() => handleTabClick(5)}>
                SQFTs ({commSQFTs.length})
              </button>
            )}
            {commLeaseRecoveryParams && commLeaseRecoveryParams.length > 0 && (
              <button
                style={{fontSize: '12px'}}
                type="button"
                className={activeTab === 6 ? 'active' : ''}
                onClick={() => handleTabClick(6)}>
                Lease Recovery Params ({commLeaseRecoveryParams.length})
              </button>
            )}
            {commOptions && commOptions.length > 0 && (
              <button type="button" className={activeTab === 7 ? 'active' : ''} onClick={() => handleTabClick(7)}>
                Options <strong>({commOptions.length})</strong>
              </button>
            )}
            {recoveryExcludes && recoveryExcludes.length > 0 && (
              <button type="button" className={activeTab === 11 ? 'active' : ''} onClick={() => handleTabClick(11)}>
                Recovery Excludes <strong>({recoveryExcludes.length})</strong>
              </button>
            )}
            {etlfile && (
              <button type="button" className={activeTab === 8 ? 'active' : ''} onClick={() => handleTabClick(8)}>
                Charge Codes <strong>({searchValue && chargeCodes.length > 0 ? chargeCodes.length : ChargeCodes.length})</strong>
              </button>
            )}
            {etlfile && expensePools.length > 0 && (
              <button type="button" className={activeTab === 9 ? 'active' : ''} onClick={() => handleTabClick(9)}>
                Expense Pools ({expensePools.length})
              </button>
            )}
            {etlfile && recoveryProfiles && recoveryProfiles.length > 0 && (
              <button type="button" className={activeTab === 10 ? 'active' : ''} onClick={() => handleTabClick(10)}>
                Recovery Profiles ({recoveryProfiles.length})
              </button>
            )}
            {propExpensePoolAccounts && propExpensePoolAccounts.length > 0 && (
              <button type="button" className={activeTab === 12 ? 'active' : ''} onClick={() => handleTabClick(12)}>
                Expense Pool Accounts ({propExpensePoolAccounts.length})
              </button>
            )}
          </div>
        )}
        {etlfile && progress.value === 100 && (
          <div className="tab-content">
            {activeTab === 1 && Object.keys(commLeases).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center', flexDirection: 'row'}}>
                  <h1>CommLeases</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px', userSelect: 'none'}}
                    onClick={() => handleRowAdd('commLeases')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commLeases && commLeases.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commLeases')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommLeases'}
                  refreshData={commLeases}
                  includeStatus={false}
                  includeCheckbox={true}
                />
              </>
            )}
            {activeTab === 2 &&
              commChargeSchedules &&
              Object.keys(commChargeSchedules).length > 0 &&
              commChargeSchedules && (
                <>
                  <div style={{display: 'flex', alignContent: 'center'}}>
                    <h1>CommChargeSchedules</h1>
                    <span
                      className="material-symbols-outlined lime"
                      style={{fontSize: '28px', userSelect: 'none'}}
                      onClick={() => handleRowAdd('commChargeSchedules')}>
                      add_circle
                    </span>
                    {[...checkedRows].find((item) => item === true) && (
                      <span
                        className="material-symbols-outlined red"
                        style={{
                          fontSize: '28px',
                          display: commChargeSchedules && commChargeSchedules.length > 1 ? 'flex' : 'none',
                        }}
                        onClick={() => handleRowDelete('commChargeSchedules')}>
                        cancel
                      </span>
                    )}
                  </div>
                  <MeissnerDataGrid
                    onUpdate={handleCellUpdate}
                    tableName={'CommChargeSchedules'}
                    refreshData={commChargeSchedules}
                    includeStatus={false}
                    includeCheckbox={true}
                    hideBlankColumns={false}
                    ItemsPerPage={itemsPerPage}
                    chargeCodes={ChargeCodes}
                    screenWidth={screenWidth}
                  />
                </>
              )}
            {activeTab === 3 && commUnits && Object.keys(commUnits).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>CommUnits</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px'}}
                    onClick={() => handleRowAdd('commUnits')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commUnits && commUnits.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commUnits')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommUnits'}
                  refreshData={commUnits}
                  includeStatus={false}
                  includeCheckbox={true}
                />
              </>
            )}
            {activeTab === 4 && commUnitXrefs && Object.keys(commUnitXrefs).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>CommUnitXrefs</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px', userSelect: 'none'}}
                    onClick={() => handleRowAdd('commUnitXrefs')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commUnitXrefs && commUnitXrefs.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commUnitXrefs')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommUnitXrefs'}
                  refreshData={commUnitXrefs}
                  includeStatus={false}
                  includeCheckbox={true}
                />{' '}
              </>
            )}
            {activeTab === 5 && commSQFTs && Object.keys(commSQFTs).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>CommSQFTs</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px', userSelect: 'none'}}
                    onClick={() => handleRowAdd('commSQFTs')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commSQFTs && commSQFTs.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commSQFTs')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommSQFTs'}
                  refreshData={commSQFTs}
                  includeStatus={false}
                  includeCheckbox={true}
                />
              </>
            )}
            {activeTab === 6 && commLeaseRecoveryParams && Object.keys(commLeaseRecoveryParams).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>Lease Recovery Params</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px'}}
                    onClick={() => handleRowAdd('commLeaseRecoveryParams')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commLeaseRecoveryParams && commLeaseRecoveryParams.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commLeaseRecoveryParams')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommLeaseRecoveryParams'}
                  refreshData={commLeaseRecoveryParams}
                  includeStatus={false}
                  includeCheckbox={true}
                  //@ts-ignore
                  recoveryProfiles={recoveryProfiles}
                  chargeCodes={ChargeCodes}
                />
              </>
            )}
            {activeTab === 7 && commOptions && Object.keys(commOptions).length > 0 && commOptions.length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>CommOptions</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px', userSelect: 'none'}}
                    onClick={() => handleRowAdd('commOptions')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: commOptions && commOptions.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('commOptions')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  onUpdate={handleCellUpdate}
                  tableName={'CommOptions'}
                  refreshData={commOptions}
                  includeStatus={false}
                  includeCheckbox={true}
                />
              </>
            )}
            {etlfile && activeTab === 8 && ChargeCodes && Object.keys(ChargeCodes).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <label htmlFor="chargeCodeSearchInputId">Search</label>
                  <input
                    id="chargeCodeSearchInputId"
                    type="text"
                    className="oppo"
                    onChange={(event) => {
                      dispatch(setSearchValue(event.target.value))
                    }}
                    value={searchValue ?? ''}
                    readOnly={false}
                  />
                  {searchValue && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: searchValue && searchValue !== '' ? 'flex' : 'none',
                      }}
                      onClick={() => handleSearchValueClear('chargeCodes')}>
                      cancel
                    </span>
                  )}
                </div>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <h1>Charge Codes</h1>
                </div>
                <MeissnerDataGrid tableName={'ChargeCodes'} refreshData={searchValue && chargeCodes.length > 0 ? chargeCodes : ChargeCodes} includeStatus={false} readOnly={true}  />
              </>
            )}
            {activeTab === 9 && expensePools && Object.keys(expensePools).length > 0 && expensePools.length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <label htmlFor="expensePoolsSearchId">Search</label>
                  <input
                    id="expensePoolsSearchId"
                    type="text"
                    className="oppo"
                    onChange={(event) => dispatch(setSearchValueExpensePool(event.target.value))}
                    value={searchValueExpensePool}
                    readOnly={false}
                  />
                  <span
                    className="material-symbols-outlined red"
                    style={{
                      fontSize: '28px',
                      display: searchValueExpensePool && searchValueExpensePool !== '' ? 'flex' : 'none',
                    }}
                    onClick={() => handleSearchValueClear('expensePools')}>
                    cancel
                  </span>
                </div>
                <div style={{display: 'flex', alignContent: 'center'}}></div>
                <h1>Expense Pools</h1>
                <MeissnerDataGrid tableName={'ExpensePools'} refreshData={expensePools} includeStatus={false} readOnly={true} />
              </>
            )}
            {activeTab === 10 && recoveryProfiles && recoveryProfiles.length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <label htmlFor="recoveryProfileSearchId">Search</label>
                  <input
                    id="recoveryProfileSearchId"
                    type="text"
                    className="oppo"
                    onChange={(event) => dispatch(setSearchValueRecoveries(event.target.value))}
                    value={searchValueRecoveries}
                    readOnly={false}
                  />
                  <span
                    className="material-symbols-outlined red"
                    style={{
                      fontSize: '28px',
                      display: searchValueRecoveries && searchValueRecoveries !== '' ? 'flex' : 'none',
                    }}
                    onClick={() => handleSearchValueClear('recoveryProfiles')}>
                    cancel
                  </span>
                </div>
                <div style={{display: 'flex', alignContent: 'center'}}></div>
                <h1>Recovery Profiles</h1>
                <MeissnerDataGrid tableName={'RecoveryProfiles'} refreshData={recoveryProfiles} includeStatus={false} readOnly={true} />
              </>
            )}
            {activeTab === 11 && recoveryExcludes && Object.keys(recoveryExcludes).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center', flexDirection: 'row'}}>
                  <h1>Recovery Excludes</h1>
                  <span
                    className="material-symbols-outlined lime"
                    style={{fontSize: '28px', userSelect: 'none'}}
                    onClick={() => handleRowAdd('recoveryExcludes')}>
                    add_circle
                  </span>
                  {[...checkedRows].find((item) => item === true) && (
                    <span
                      className="material-symbols-outlined red"
                      style={{
                        fontSize: '28px',
                        display: recoveryExcludes && recoveryExcludes.length > 1 ? 'flex' : 'none',
                      }}
                      onClick={() => handleRowDelete('recoveryExcludes')}>
                      cancel
                    </span>
                  )}
                </div>
                <MeissnerDataGrid
                  tableName={'CommRecoveryExcludes'}
                  refreshData={recoveryExcludes}
                  includeStatus={false}
                  includeCheckbox={true}
                  readOnly={true}
                />
              </>
            )}
            {activeTab === 12 && propExpensePoolAccounts && Object.keys(propExpensePoolAccounts).length > 0 && (
              <>
                <div style={{display: 'flex', alignContent: 'center'}}>
                  <label htmlFor="recoveryProfileSearchId">Search</label>
                  <input
                    id="searchValuePropExpensePoolAccountsId"
                    type="text"
                    className="oppo"
                    onChange={(event) => dispatch(setsearchValuePropExpensePoolAccounts(event.target.value))}
                    value={searchValuePropExpensePoolAccounts}
                    readOnly={false}
                  />
                  <span
                    className="material-symbols-outlined red"
                    style={{
                      fontSize: '28px',
                      display: searchValuePropExpensePoolAccounts && searchValuePropExpensePoolAccounts !== '' ? 'flex' : 'none',
                    }}
                    onClick={() => {
                      dispatch(setsearchValuePropExpensePoolAccounts(null))
                      const id = document.getElementById('searchValuePropExpensePoolAccountsId') as HTMLInputElement
                      id.value = ''
                    }
                    }>
                    cancel
                  </span>
                </div>
                <div style={{display: 'flex', alignContent: 'center'}}></div>
                <h1>Expense Pool Accounts</h1>
                <MeissnerDataGrid
                  tableName={'CommPropExpensePoolAccounts'}
                  refreshData={propExpensePoolAccounts}
                  includeStatus={false}
                  readOnly={true}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
