import {
  createSlice,
  PayloadAction,
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  EntityId,
  AnyAction,
  ThunkDispatch,
} from '@reduxjs/toolkit'
import {useSelector} from 'react-redux'
import * as XLSX from 'xlsx'
import {
  Log,
  getLastDayOfMonth,
  extractNumberFromText,
  generateTenantCode,
  americanStates,
  generateCsvFromHtml,
  getLastDayOfMonthByString,
  getYardiDateFormat,
  americanCities,
  sanDiegoCities,
  formDate,
  SliceFileData,
  DueDayAfterMethod,
  AmendmentTypes,
  AmendmentStatus,
  OccypancyType,
  OptionType,
  OptionStatus,
  ProposalType,
  ProgressStep,
  delay,
  sortByColumn,
  convertDateFormat,
  isDate,
  isNumber,
  filterColumns,
  sortByColumn2,
  randomLeaseCode,
} from '@/components/utils'
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
} from '@/components/utils'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {current} from '@reduxjs/toolkit'
import {createPagesBrowserClient} from '@supabase/auth-helpers-nextjs'
import {openDB} from 'idb'
import { RootState } from './store'
import { Database } from '@/components/types/supabase'


let leaseStartDate = ''
let leaseEndDate = ''
let tenantName = ''
let city = ''
let zip = ''
let unitCodes = []
let leaseType = 'offnet'
let unitSqft = '0'
let gracePeriod = '0'
let lastDayStartMonth = ''
let hasRenewalOptions = false
let lastRowOptions = 0
let optionTerms = []
let firstRowOptions: number = 0
let numOptions: number = 0
let grossUpPercent = 0
// let chargeCodeSheetName = ''
let extractedOptionTermYears = -1
let extractedOptionTermMonths = -1
let multipleUnits = false
let worksheetName = ''
let yardiPropertyId = ''
let americanState = 'CA'
const progressUnits = 100 / 9
const delayInMilliseconds = 200
// let leaseCode = null

const baseUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api' : 'https://nextjs-ts-jpc1.vercel.app/api'

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fetchBaseQuery({baseUrl}),
  endpoints: (builder) => ({
    getValuesFromSupabase: builder.query<Partial<any>[], {tableName: string; specificColumn?: string; searchValue?: string; propertyCode?: string}>({
      query: ({tableName, specificColumn = null, searchValue = '', propertyCode = ''}) =>
        `supabaseRTK?tableName=${tableName}&specificColumn=${specificColumn}&searchValue=${searchValue}&propertyCode=${propertyCode}`,
    }),
  }),
})

// Export hooks for usage in functional components
export const {useGetValuesFromSupabaseQuery} = supabaseApi

const commRecoveryProfilesAdapter = createEntityAdapter({
  selectId: (entity: Partial<RecoveryProfiles>) => `${entity.id}`,
})

const excelFileAdapter = createEntityAdapter()

const initlaProgressStep: ProgressStep = {
  value: '',
}

export interface TableRowData {
  type: ('string' | 'null')[] | 'number' | 'string'
}

export interface TableData {
  tableName: string
  rowData: {
    [key: string]: TableRowData
  }
}

const excelFileSlice = createSlice({
  name: 'excelFile',
  initialState: excelFileAdapter.getInitialState({
    databaseMetadata: {},
    status: 'idle',
    file: null,
    error: null,
    progressStep: initlaProgressStep,
    progress: {value: 0},
    leaseCode: randomLeaseCode(),
    overridePropertyCode: null,
    overrideUnitCode: null,
    overrideLeaseCode: null,
    itemsPerPage: null,
    totalItems: 0,
    unitCodes: [],
    chargeCodes: [],
    expensePools: [],
    searchValue: null,
    searchValueExpensePool: null,
    searchValueRecoveries: null,
    searchValuePropExpensePoolAccounts: null,
    checkedRows: [],
    headerCheckboxChecked: {},
    activeTab: 1,
    userName: null,
    commUnits: [],
    commChargeSchedules: [],
    commLeases: [],
    commUnitXrefs: [],
    commSQFTs: [],
    commOptions: [],
    commLeaseRecoveryParams: [],
    sortOrder: null,
    currentPage: 1,
    columnId: null,
    isChecked: false,
    haveChangesBeenMade: false,
    sortState: true,
    recoveryProfiles: [],
    propertyCode: null,
    originalPropertyCode: null,
    originalUnitCodes: null,
    originalLeaseCode: null,
    holdover: null,
  }),
  reducers: {
    updateDatabaseMetadata: (state, action: PayloadAction<TableData[]>) => {
      try {
        const tables = action.payload
        tables.forEach((table) => {
          const tableName = table.tableName
          state.databaseMetadata[tableName] = table.rowData
        })
      } catch (error) {
        console.log(error)
      }
    },
    setsearchValuePropExpensePoolAccounts: (state, action: PayloadAction<string>) => {
      state.searchValuePropExpensePoolAccounts = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setLeaseCode: (state: any, action: PayloadAction<string>) => {
      state.leaseCode = action.payload
    },
    setOverridePropertyCode: (state: any, action: PayloadAction<string>) => {
      state.overridePropertyCode = action.payload
    },
    setOverrideUnitCode: (state: any, action: PayloadAction<string | null>) => {
      state.overrideUnitCode = action.payload ?? ''
    },
    setOverrideLeaseCode: (state: any, action: PayloadAction<string>) => {
      state.overrideLeaseCode = action.payload
    },
    setProgress: (state: any, action: PayloadAction<{value: number}>) => {
      state.progress = action.payload
    },
    setPropertyCode: (state: any, action: PayloadAction<string>) => {
      state.progress = action.payload
    },
    setProgressStep: (state: any, action: PayloadAction<ProgressStep>) => {
      state.progressStep = action.payload
    },
    addUnitCode: (state: any, action: PayloadAction<string>) => {
      unitCodes.push(action.payload)
    },
    clearUnitCodes: (state: any) => {
      unitCodes = []
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      // Optional
      state.totalItems = action.payload
    },
    setHoldOver: (state, action: PayloadAction<string>) => {
      state.holdover = action.payload
    },
    setChargeCodes: (state, action: PayloadAction<Partial<ChargeCodes>[]>) => {
      state.chargeCodes = action.payload
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload
    },
    setSearchValueExpensePool: (state, action: PayloadAction<string>) => {
      state.searchValueExpensePool = action.payload
    },
    setSearchValueRecoveries: (state, action: PayloadAction<string>) => {
      state.searchValueRecoveries = action.payload
    },
    setCheckedRows: (state, action: PayloadAction<{tableName: string; rows: Array<boolean>}>) => {
      const {tableName, rows} = action.payload

      // Check if the tableName already exists in the array
      const existingIndex = state.checkedRows.findIndex((row) => row.tableName === tableName)

      if (existingIndex > -1) {
        // If it exists, update the rows for that tableName
        state.checkedRows[existingIndex].rows = rows
      } else {
        // Otherwise, add a new entry for the tableName
        state.checkedRows.push({tableName, rows})
      }
    },
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload
    },
    setHeaderCheckboxChecked: (state, action: PayloadAction<{tableName: string; checked: boolean}>) => {
      const {tableName, checked} = action.payload
      state.headerCheckboxChecked[tableName] = !checked
    },

    setHaveChangesBeenMade: (state, action: PayloadAction<boolean>) => {
      state.haveChangesBeenMade = action.payload
    },
    setFile: (state, action: PayloadAction<string>) => {
      state.file = action.payload
    },
    setOriginalPropertyCode: (state, action: PayloadAction<string>) => {
      state.originalPropertyCode = action.payload
    },
    setOriginalUnitCodes: (state, action: PayloadAction<string | string[]>) => {
      state.originalUnitCodes = action.payload
    },
    setOriginalLeaseCode: (state, action: PayloadAction<string>) => {
      state.originalLeaseCode = action.payload
    },
    filterChargeCodes: (state, action: PayloadAction<Partial<ChargeCodes>[]>) => {
      const sortedData = sortByColumn(action.payload, 'id', true)
      const onemore = [...sortedData]
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
      const filteredRows = filterColumns(onemore, ['code', 'chargecodeid', 'description', 'account', 'accountdesc'])
      state.chargeCodes = filteredRows
    },
    setCommChargeSchedulesCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setCommChargeSchedulesSortOrder: (state, action: PayloadAction<'asc' | 'desc' | null>) => {
      state.sortOrder = action.payload
    },
    setCommChargeSchedulesColumnId: (state, action: PayloadAction<string | null>) => {
      state.columnId = action.payload
    },
    setRecoveryProfiles: (state, action: PayloadAction<Partial<RecoveryProfiles>[]>) => {
      state.recoveryProfiles = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(handleFileUpload.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(handleFileUpload.fulfilled, (state, action) => {
        if (state.status === 'loading') {
          state.status = 'succeeded'
        }
      })
      .addCase(handleFileUpload.rejected, (state, action) => {
        if (state.status === 'loading') {
          state.status = 'failed'
          state.error = action.payload
        }
      })
  },
})

export interface ColumnsInformation {
  id: number
  ordinal_position: number
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
}

/**
 * Entity adapter for columnsInformation.
 */
const columnsInformationAdapter = createEntityAdapter({
  selectId: (entity: Partial<ColumnsInformation>) => `${entity.id}`,
})

/**
 * Slice for columnsInformation containing reducers for manipulating columnsInformation.
 */
const columnsInformationSlice = createSlice({
  name: 'columnsInformation',
  initialState: columnsInformationAdapter.getInitialState({
    columnsInformation: {},
    status: 'idle',
    error: null,
    data: [],
  }),
  reducers: {
    columnsInformationAdded: columnsInformationAdapter.addMany,
    columnsInformationUpdated: columnsInformationAdapter.updateOne,
    columnsInformationRemoved: columnsInformationAdapter.removeOne,
    columnsInformationCleared: columnsInformationAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumnsInformation.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchColumnsInformation.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.columnsInformation = action.payload
      })
      .addCase(fetchColumnsInformation.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

/**
 * Selectors for columnsInformation.
 */
const columnsInformationSelectors = columnsInformationAdapter.getSelectors((state: RootState) => state.columnsInformation)

export const {selectAll: selectAllColumnsInformation} = columnsInformationSelectors

export const {columnsInformationAdded, columnsInformationUpdated, columnsInformationRemoved, columnsInformationCleared} =
  columnsInformationSlice.actions

const commRecoveryProfilesSlice = createSlice({
  name: 'commRecoveryProfiles',
  initialState: commRecoveryProfilesAdapter.getInitialState({
    commRecoveryProfiles: [],
    timesClicked: {},
  }),
  reducers: {
    commRecoveryProfileAdded: commRecoveryProfilesAdapter.addOne,
    commRecoveryProfilesAdded: commRecoveryProfilesAdapter.addMany,
    commRecoveryProfilesUpdated: commRecoveryProfilesAdapter.updateOne,
    commRecoveryProfilesRemoved: commRecoveryProfilesAdapter.removeOne,
    commRecoveryProfilesCleared: commRecoveryProfilesAdapter.removeAll,
  },
})

const commRecoveryProfilesSelectors = commRecoveryProfilesAdapter.getSelectors((state: any) => state.commRecoveryProfiles)

export const {selectAll: selectAllcommRecoveryProfiles} = commRecoveryProfilesSelectors

export const {
  commRecoveryProfilesAdded,
  commRecoveryProfileAdded,
  commRecoveryProfilesUpdated,
  commRecoveryProfilesRemoved,
  commRecoveryProfilesCleared,
} = commRecoveryProfilesSlice.actions

export const commRecoveryProfilesReducer = commRecoveryProfilesSlice.reducer

const commRecoveryExcludesAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommRecoveryExcludes>) => `${entity.id}`,
})

const commRecoveryExcludesSlice = createSlice({
  name: 'commExcludes',
  initialState: commRecoveryExcludesAdapter.getInitialState({
    commExcludes: [],
    timesClicked: {},
  }),
  reducers: {
    commExcludeAdded: commRecoveryExcludesAdapter.addOne,
    commExcludesAdded: commRecoveryExcludesAdapter.addMany,
    commExcludeUpdated: commRecoveryExcludesAdapter.updateOne,
    commExcludesUpdated: commRecoveryExcludesAdapter.updateMany,
    commExcludeRemoved: commRecoveryExcludesAdapter.removeOne,
    commExcludesRemoved: commRecoveryExcludesAdapter.removeMany,
    commExcludesCleared: commRecoveryExcludesAdapter.removeAll,

    /**
     * Function to sort commRecoveryExcludes.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>} action
     */
    sortcommRecoveryExcludes: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      const commRecoveryExcludes = JSON.parse(localStorage.getItem('CommRecoveryExcludes'))
      const sortedData = commRecoveryExcludes ? [...commRecoveryExcludes].sort(sortByColumn2(column, isAscending as boolean | null)) : [...data].sort(sortByColumn2(column, isAscending as boolean | null))

      commRecoveryExcludesAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commRecoveryExcludes.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
    setTimesClickedcommRecoveryExcludes: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{column: keyof Partial<T>}>
    ) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesnt exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})

const commExcludesSelectors = commRecoveryExcludesAdapter.getSelectors((state: any) => state.commExcludes)

export const {selectAll: selectAllcommExcludes} = commExcludesSelectors

export const {
  commExcludesAdded,
  commExcludeAdded,
  commExcludesUpdated,
  commExcludeUpdated,
  commExcludesRemoved,
  commExcludesCleared,
  commExcludeRemoved,
  setTimesClickedcommRecoveryExcludes,
  sortcommRecoveryExcludes,
} = commRecoveryExcludesSlice.actions

export const commExcludesReducer = commRecoveryExcludesSlice.reducer

/**
 * Entity adapter for commUnits.
 */
const commUnitsAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommUnits>) => `${entity.id}`,
})

const commChargeSchedulesAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommChargeSchedules>) => `${entity.id}`,
})

const commLeaseAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommLeases>) => `${entity.id}`,
})
const commUnitXrefsAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommUnitXrefs>) => `${entity.id}`,
})

const commUnitXrefsSlice = createSlice({
  name: 'commUnitXrefs',
  initialState: commUnitXrefsAdapter.getInitialState({
    commUnitXrefs: [],
    timesClicked: {},
  }),
  reducers: {
    commUnitXRefAdded: commUnitXrefsAdapter.addOne,
    commUnitXrefsAdded: commUnitXrefsAdapter.addMany,
    commUnitXRefUpdated: commUnitXrefsAdapter.updateOne,
    commUnitXrefsUpdated: commUnitXrefsAdapter.updateMany,
    commUnitXRefRemoved: commUnitXrefsAdapter.removeOne,
    commUnitXrefsCleared: commUnitXrefsAdapter.removeAll,
    setcommUnitXrefs: (state: any, action: PayloadAction<Partial<CommUnitXrefs>[]>) => {
      state.commUnitXrefs = action.payload
    },

    /**
     * Function to sort commUnitXrefs.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>} action
     */
    sortcommUnitXrefs: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      const commUnitXrefs = JSON.parse(localStorage.getItem('CommUnitXrefs'))
      const sortedData = [...commUnitXrefs].sort(sortByColumn2(column, isAscending as boolean | null))

      commUnitXrefsAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commUnitXrefs.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
    setTimesClickedcommUnitXrefs: <T extends Record<any, any>>(state, action: PayloadAction<{column: keyof Partial<T>}>) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesnt exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})

/**
 * Slice for commcommUnits containing reducers for manipulating commUnits.
 */
const commUnitsSlice = createSlice({
  name: 'commUnits',
  initialState: commUnitsAdapter.getInitialState({
    commUnits: [],
    timesClicked: {},
  }),
  reducers: {
    commUnitAdded: commUnitsAdapter.addOne,
    commUnitsAdded: commUnitsAdapter.addMany,
    commUnitUpdated: commUnitsAdapter.updateOne,
    commUnitsUpdated: commUnitsAdapter.updateMany,
    commUnitRemoved: commUnitsAdapter.removeOne,
    commUnitsCleared: commUnitsAdapter.removeAll,
    setCommUnits: (state: any, action: PayloadAction<Partial<CommUnits>[]>) => {
      // Use commUnitAdapter.setAll method here
      commUnitsAdapter.setAll(state, action.payload)
    },
    sortcommUnits: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload
      const commUnits = JSON.parse(localStorage.getItem('commUnits'))
      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      // Create a copy of the commUnits array
      const sortedData = [...(commUnits ?? data)].sort(sortByColumn2(column, isAscending as boolean | null))

      // // Update the sort state
      // state.sortState = !isAscending;

      // Set the sorted data using the adapter method
      commUnitsAdapter.setAll(state, sortedData)
    },

    setTimesClickedcommUnits: <T extends Record<string, any>>(state, action: PayloadAction<{column: keyof Partial<T>}>) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesn't exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})

const commLeasesSlice = createSlice({
  name: 'commLeases',
  initialState: commLeaseAdapter.getInitialState({
    commLeases: [],
    timesClicked: {},
  }),
  reducers: {
    commLeaseAdded: commLeaseAdapter.addOne,
    commLeasesAdded: commLeaseAdapter.addMany,
    commLeaseUpdated: commLeaseAdapter.updateOne,
    commLeasesUpdated: commLeaseAdapter.updateMany,
    commLeaseRemoved: commLeaseAdapter.removeOne,
    commLeasesCleared: commLeaseAdapter.removeAll,
    setCommLeases: (state, action: PayloadAction<[]>) => {
      commLeaseAdapter.setAll(state, action.payload)
      console.log(current(state))
    },
    sortcommLeases: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      const commLeases = JSON.parse(localStorage.getItem('CommLeases'))
      const sortedData = [...(commLeases ?? data)].sort(sortByColumn2(column, isAscending as boolean | null))

      commLeaseAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commLeases.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
    setTimesClickedcommLeases: <T extends Record<string, any>>(state, action: PayloadAction<{column: keyof Partial<T>}>) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesnt exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})


export const {
  commLeaseAdded,
  commLeasesAdded,
  commLeaseUpdated,
  commLeaseRemoved,
  commLeasesCleared,
  setCommLeases,
  commLeasesUpdated,
  sortcommLeases,
  setTimesClickedcommLeases,
} = commLeasesSlice.actions


const commChargeSchedulesSlice = createSlice({
  name: 'commChargeSchedules',
  initialState: commChargeSchedulesAdapter.getInitialState({
    commChargeSchedules: [],
    sortState: {},
    timesClicked: {},
  }),
  reducers: {
    commChargeScheduleAdded: commChargeSchedulesAdapter.addOne,
    commChargeSchedulesAdded: commChargeSchedulesAdapter.addMany,
    commChargeScheduleUpdated: commChargeSchedulesAdapter.updateOne,
    commChargeSchedulesUpdated: commChargeSchedulesAdapter.updateMany,
    commChargeScheduleRemoved: (state, action: PayloadAction<EntityId>) => {
      commChargeSchedulesAdapter.removeOne(state, action.payload)
    },
    commChargeSchedulesCleared: commChargeSchedulesAdapter.removeAll,
    setCommChargeSchedules: (state: any, action: PayloadAction<Partial<CommChargeSchedules>[]>) => {
      state.commChargeSchedules = action.payload
    },
    upsertMany: (state, action: PayloadAction<Partial<CommChargeSchedules>[]>) => {
      action.payload.forEach((entity) => {
        const existingEntity = state.entities[entity.id]
        if (existingEntity) {
          // If the entity with the same id exists, update it
          commChargeSchedulesAdapter.updateOne(state, {
            id: entity.id,
            changes: entity,
          })
        } else {
          // If the entity doesn't exist, add it
          commChargeSchedulesAdapter.addOne(state, entity)
        }
      })
    },
    filterData: (state: any, action: PayloadAction<Partial<CommChargeSchedules>[]>) => {
      const sortedData = sortByColumn(action.payload, 'id', true)
      const onemore = [...sortedData]

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
      state.commLeases = filteredRows
    },
    setTimesClickedCommChargeSchedules: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{column: keyof Partial<T>}>
    ) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesn't exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
    sortcommChargeSchedules: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload
      const commChargeSchedules = JSON.parse(localStorage.getItem('CommChargeSchedules'))
      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      const sortedData = [...(commChargeSchedules ?? data)].sort(sortByColumn2(column, isAscending as boolean | null))

      commChargeSchedulesAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commChargeSchedules.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
  },
})

const commChargeSchedulesSelectors = commChargeSchedulesAdapter.getSelectors<RootState>(
  (state: RootState) => state.commChargeSchedules
)

export const {selectAll: selectAllCommChargeSchedules} = commChargeSchedulesSelectors

/**
 * Selectors for commcommUnits.
 */
const commUnitsSelectors = commUnitsAdapter.getSelectors<RootState>((state: RootState) => state.commUnits)

export const {
  commChargeScheduleAdded,
  commChargeSchedulesAdded,
  commChargeScheduleUpdated,
  commChargeScheduleRemoved,
  commChargeSchedulesCleared,
  setCommChargeSchedules,
  upsertMany,
  filterData,
  commChargeSchedulesUpdated,
  sortcommChargeSchedules,
  setTimesClickedCommChargeSchedules,
} = commChargeSchedulesSlice.actions

export const {selectAll: selectAllcommUnits} = commUnitsSelectors

const commLeasesSelectors = commLeaseAdapter.getSelectors<RootState>((state: RootState) => state.commLeases)

const commUnitXrefsSelectors = commUnitXrefsAdapter.getSelectors<RootState>((state: RootState) => state.commUnitXrefs)

export const {selectAll: selectAllCommUnitXrefs} = commUnitXrefsSelectors

export const {selectAll: selectAllCommLeases} = commLeasesSelectors

export const {
  commUnitAdded,
  commUnitsAdded,
  commUnitUpdated,
  commUnitRemoved,
  commUnitsCleared,
  setCommUnits,
  commUnitsUpdated,
  sortcommUnits,
  setTimesClickedcommUnits,
} = commUnitsSlice.actions

export const {
  commUnitXRefAdded,
  commUnitXrefsAdded,
  commUnitXRefUpdated,
  commUnitXRefRemoved,
  commUnitXrefsCleared,
  commUnitXrefsUpdated,
  setTimesClickedcommUnitXrefs,
  sortcommUnitXrefs,
} = commUnitXrefsSlice.actions

const commSQFTsAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommSQFTs>) => `${entity.id}`,
})

const commSQFTsSlice = createSlice({
  name: 'commSQFTs',
  initialState: commSQFTsAdapter.getInitialState({
    commSQFTs: [],
    timesClicked: {},
  }),
  reducers: {
    commSQFTAdded: commSQFTsAdapter.addOne,
    commSQFTsAdded: commSQFTsAdapter.addMany,
    commSQFTUpdated: commSQFTsAdapter.updateOne,
    commSQFTsUpdated: commSQFTsAdapter.updateMany,
    commSQFTRemoved: commSQFTsAdapter.removeOne,
    commSQFTsCleared: commSQFTsAdapter.removeAll,
    /**
     * Function to sort commSQFTs.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>} action
     */
    sortcommSQFTs: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      const commSQFTs = JSON.parse(localStorage.getItem('CommSQFTs'))
      const sortedData = [...commSQFTs].sort(sortByColumn2(column, isAscending as boolean | null))

      commSQFTsAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commSQFTs.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
    setTimesClickedcommSQFTs: <T extends Record<string, any>>(state, action: PayloadAction<{column: keyof Partial<T>}>) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesnt exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})

const commSQFTsSelectors = commSQFTsAdapter.getSelectors<RootState>((state: any) => state.commSQFTs)

export const {selectAll: selectAllcommSQFTs} = commSQFTsSelectors

export const {
  commSQFTAdded,
  commSQFTsAdded,
  commSQFTUpdated,
  commSQFTsUpdated,
  commSQFTRemoved,
  commSQFTsCleared,
  setTimesClickedcommSQFTs,
  sortcommSQFTs,
} = commSQFTsSlice.actions

const commLeaseRecoveryParamsAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommLeaseRecoveryParams>) => `${entity.id}`,
})

const commLeaseRecoveryParamsSlice = createSlice({
  name: 'commLeaseRecoveryParams',
  initialState: commLeaseRecoveryParamsAdapter.getInitialState({
    commLeaseRecoveryParams: [],
    timesClicked: {},
  }),
  reducers: {
    commLeaseRecoveryParamAdded: commLeaseRecoveryParamsAdapter.addOne,
    commLeaseRecoveryParamsAdded: commLeaseRecoveryParamsAdapter.addMany,
    commLeaseRecoveryParamUpdated: commLeaseRecoveryParamsAdapter.updateOne,
    commLeaseRecoveryParamsUpdated: commLeaseRecoveryParamsAdapter.updateMany,
    commLeaseRecoveryParamRemoved: commLeaseRecoveryParamsAdapter.removeOne,
    commLeaseRecoveryParamsCleared: commLeaseRecoveryParamsAdapter.removeAll,
    setTimesClickedCommLeaseRecoveryParams: (
      state,
      action: PayloadAction<{column: keyof Partial<CommLeaseRecoveryParams>}>
    ) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesn't exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
    sortCommLeaseRecoveryParams: (
      state,
      action: PayloadAction<{
        data: Partial<CommLeaseRecoveryParams>[]
        column: keyof CommLeaseRecoveryParams
        sortState: boolean
      }>
    ) => {
      const {data, column, sortState} = action.payload

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      // Create a copy of the commLeaseRecoveryParams array
      const sortedData = [...data].sort(sortByColumn2(column, isAscending as boolean | null))

      // // Update the sort state
      // state.sortState = !isAscending;

      // Set the sorted data using the adapter method
      commLeaseRecoveryParamsAdapter.setAll(state, sortedData)
    },
  },
})

const commLeaseRecoveryParamsSelectors = commLeaseRecoveryParamsAdapter.getSelectors<RootState>(
  (state: any) => state.commLeaseRecoveryParams
)

export const {selectAll: selectAllcommLeaseRecoveryParams} = commLeaseRecoveryParamsSelectors

export const {
  commLeaseRecoveryParamsAdded,
  commLeaseRecoveryParamAdded,
  commLeaseRecoveryParamUpdated,
  commLeaseRecoveryParamsUpdated,
  commLeaseRecoveryParamRemoved,
  commLeaseRecoveryParamsCleared,
  sortCommLeaseRecoveryParams,
  setTimesClickedCommLeaseRecoveryParams,
} = commLeaseRecoveryParamsSlice.actions

export const commLeaseRecoveryParamsReducer = commLeaseRecoveryParamsSlice.reducer

const commOptionsAdapter = createEntityAdapter({
  selectId: (entity: Partial<CommOptions>) => `${entity.id}`,
})

const commOptionsSlice = createSlice({
  name: 'commOptions',
  initialState: commOptionsAdapter.getInitialState({
    commOptions: [],
    timesClicked: {},
  }),
  reducers: {
    commOptionAdded: commOptionsAdapter.addOne,
    commOptionsAdded: commOptionsAdapter.addMany,
    commOptionUpdated: commOptionsAdapter.updateOne,
    commOptionsUpdated: commOptionsAdapter.updateMany,
    commOptionsRemoved: commOptionsAdapter.removeOne,
    commOptionsCleared: commOptionsAdapter.removeAll,
    /**
     * Function to sort commOptions.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>} action
     */
    sortcommOptions: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{data: Partial<T>[]; column: keyof T; sortState: boolean}>
    ) => {
      const {data, column, sortState} = action.payload
      const commOptions = JSON.parse(localStorage.getItem('CommOptions'))

      const timesClicked = state.timesClicked[column] || 0

      let isAscending: boolean | null = null

      switch (timesClicked % 3) {
        case 0: // Sort by ID
          isAscending = null // Or whatever logic you need to sort by ID
          break
        case 1: // Ascending
          isAscending = true
          break
        case 2: // Descending
          isAscending = false
          break
      }

      // Create a copy of the commOptions array
      const sortedData = [...(commOptions ?? data)].sort(sortByColumn2(column, isAscending as boolean | null))

      // Set the sorted data using the adapter method
      commOptionsAdapter.setAll(state, sortedData)
    },
    /**
     * Function to set times clicked for commOptions.
     * @template T
     * @param {Object} state
     * @param {PayloadAction<{column: keyof Partial<T>}>} action
     */
    setTimesClickedcommOptions: <T extends Record<string, any>>(
      state,
      action: PayloadAction<{column: keyof Partial<T>}>
    ) => {
      const {column} = action.payload
      // Initialize the count for the column if it doesn't exist
      if (!state.timesClicked[column]) {
        state.timesClicked[column] = 1
      } else {
        state.timesClicked[column] += 1
      }
    },
  },
})

const commOptionsSelectors = commOptionsAdapter.getSelectors<RootState>((state: any) => state.commOptions)

export const {selectAll: selectAllcommOptions} = commOptionsSelectors

export const {
  commOptionsAdded,
  commOptionAdded,
  commOptionsUpdated,
  commOptionUpdated,
  commOptionsRemoved,
  commOptionsCleared,
  sortcommOptions,
  setTimesClickedcommOptions,
} = commOptionsSlice.actions

export const commOptionsReducer = commOptionsSlice.reducer

const supabase = createPagesBrowserClient<Database>()
const DB_VERSION = 1

export const fetchColumnsInformation = createAsyncThunk(
  'columnsInformation/fetchColumnsInformation',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const db = await openDB('myDatabase', DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('columnsInformation')) {
            db.createObjectStore('columnsInformation');
          }
          if (!db.objectStoreNames.contains('ChargeCodes')) {
            db.createObjectStore('ChargeCodes');
          }
          if (!db.objectStoreNames.contains('GetChargeCodesInfo')) {
            db.createObjectStore('GetChargeCodesInfo');
          }
        },
      });
      const idbData = await db.get('columnsInformation', 'data')
      if (idbData) {
        dispatch(columnsInformationAdded(idbData))
        return
      }
      const {data, error} = await supabase.rpc('get_columns_information')
      dispatch(columnsInformationAdded(data))
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const handleFileUpload = createAsyncThunk(
  'meissnerGrid/handleFileUpload',
  async (fileData: SliceFileData, {getState, dispatch}) => {
    if (!fileData && !fileData.ui8array) return
    const state = getState() as RootState
    dispatch(setFile(fileData.uploadFile.name))
    const chargecodes = [...fileData.chargeCodes]

    let binaryString = ''
    fileData.ui8array.forEach((byte) => {
      binaryString += String.fromCharCode(byte)
    })
    // const base64String = btoa(binaryString)
    //setLeaseWorksheetData(base64String)

    const workbook = XLSX.read(fileData.ui8array, {type: 'array'})
    const sheetNames = workbook.SheetNames
    if (!sheetNames.includes('Lease')) {
      return
    }

    // chargeCodeSheetName = sheetNames.find((sheetName) => {
    //   return sheetName.toLowerCase().includes('charge code')
    // })
    const sheetName = workbook.SheetNames[0] // Assuming you want the first sheet
    const sheet = workbook.Sheets[sheetName]
    const worksheetName = sheetName

    const schedules = getChargeSchedules(sheet, state, dispatch)
    const filteredRecoveryProfiles = fileData.recoveryProfiles.filter(
      (profile) => profile.propertycode === yardiPropertyId || fileData.overridePropertyCode
    )
    leaseType = filteredRecoveryProfiles[0]?.leasetypecode ?? 'offnet'
    // dispatch(setPropertyCode(filteredRecoveryProfiles[0].propertycode))
    dispatch(setProgress({value: progressUnits}))
    dispatch(setProgressStep({value: 'CommUnits'}))

    // @ts-ignore
    const communits: Partial<CommUnits>[] = unitCodes.map((unit_Code) => {
      return {
        property_code: fileData.overridePropertyCode ?? yardiPropertyId,
        unit_code: !fileData.overrideUnitCode ? unit_Code : fileData.overrideUnitCode,
        rental_type: 'Commercial',
        country: '',
        ext_ref_unit_id: '',
        ref_property_id: '',
        ref_building_id: '',
        ref_floor_id: '',
        bldg_code: '',
        floor_code: '',
        address_1: '',
        address_2: '',
        address_3: '',
        address_4: '',
        city: city,
        state: 'CA',
        zip_code: zip,
        rent: '',
        sqft: unitSqft,
        rent_ready: '',
        bedrooms: '',
        exclude: '',
        available_date: '',
        date_ready: '',
        unit_type: '',
        location: '',
        notes: '',
        mla: '',
        lease_type: leaseType,
        attributes_1: '',
        attributes_2: '',
        attributes_3: '',
        attributes_4: '',
        attributes_5: '',
        attributes_6: '',
        attributes_7: '',
        attributes_8: '',
        attributes_9: '',
        attributes_10: '',
        userdefined_1: '',
        userdefined_2: '',
        userdefined_3: '',
        userdefined_4: '',
        userdefined_5: '',
        userdefined_6: '',
        userdefined_7: '',
        userdefined_8: '',
        userdefined_9: '',
        userdefined_10: '',
      }
    })

    const unitsWithIds = communits.map((unit, index: number) => {
      if (unit.hasOwnProperty('id')) return unit
      return {...unit, id: index + 1}
    })
    let initialRows = new Array(unitsWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommUnits', rows: initialRows}))
    dispatch(commUnitsAdded(unitsWithIds))
    await delay(delayInMilliseconds)
    const num = parseInt(Number(progressUnits * 2).toFixed(2))
    dispatch(setProgress({value: num}))
    dispatch(setProgressStep({value: 'CommChargeSchedules'}))

    const commChargeSchedulesPromises = schedules.map(async (row) => {
      const matchingChargeCode = row[0].replace(/\s*\([^)]*\)\s*/g, '').toLowerCase()
      const wordsToMatch = matchingChargeCode.split(/\W+/) // Split by non-word characters

      const chgtyp = chargecodes.filter((chargeCode) =>
        chargeCode.code
          .toLowerCase()
          .split(/\W+/)
          .some((word) => wordsToMatch.includes(word.toLowerCase()))
      )

      chgtyp.sort((a, b) => {
        const aExactMatch = wordsToMatch.includes(a.code.toLowerCase())
        const bExactMatch = wordsToMatch.includes(b.code.toLowerCase())

        if (aExactMatch && !bExactMatch) return -1
        if (bExactMatch && !aExactMatch) return 1

        return 0
      })

      const unit_Code = !fileData.overrideUnitCode
        ? multipleUnits
          ? unitCodes.find((code) => row[0].includes(code)) || unitCodes[0]
          : unitsWithIds[0].unit_code
        : fileData.overrideUnitCode

      const finalDateTryRegex = /(\d{1,2}\/\d{1,2}\/\d{2,4})/
      const match = row[3].match(finalDateTryRegex)
      let scheduleToDateIntermediate =
        row[3] === '' && (row[2].includes('one-time') || row[2].includes('one time'))
          ? getYardiDateFormat(
              getLastDayOfMonthByString(
                formDate(
                  row[2].includes('one-time') || (row[2].includes('one time') && row[3] === '')
                    ? formDate(leaseStartDate)
                    : formDate(row[2])
                )
              )
            )
          : row[3].includes('one-time') || row[3].includes('one time')
          ? getYardiDateFormat(getLastDayOfMonthByString(formDate(row[2])))
          : row[3] !== ''
          ? match && match[1]
          : lastDayStartMonth

      const schedFromDate = new Date(
        row[2].includes('one-time') && (row[3] === '' || match) ? formDate(leaseStartDate) : formDate(row[2])
      )
      let scheduleFromDateFinal
      let scheduleToDateFinal
      try {
        const schedToDate = new Date(scheduleToDateIntermediate)
        scheduleFromDateFinal = schedFromDate
        scheduleToDateFinal =
          schedToDate > schedFromDate ? schedToDate : getLastDayOfMonthByString(getYardiDateFormat(schedFromDate))
      } catch (error) {
        throw error
      }

      return {
        property_code: fileData.overridePropertyCode ?? yardiPropertyId,
        // lease_code: !fileData.overrideLeaseCode ? state.excelFile.leaseCode : fileData.overrideLeaseCode,
        lease_code: fileData.overrideLeaseCode ?? (!state.excelFile.leaseCode ? unitCodes[0] : state.excelFile.leaseCode),
        charge_code: (chgtyp && chgtyp.length > 0 && chgtyp[0].code) || row.charge_code,
        amount: Number(parseFloat(row[1]).toFixed(2)) ?? 0,
        schedule_from_date: getYardiDateFormat(scheduleFromDateFinal),
        schedule_to_date: getYardiDateFormat(scheduleToDateFinal),
        amount_period: '2', // monthly
        estimate_type: '2', // flat amount
        currency: '',
        price: '',
        quantity: '',
        ref_property_id: '',
        ref_lease_id: '',
        mgmt_fee_code: '',
        mgmt_fee_percentage: '',
        sales_tax_code: '',
        sales_tax_percentage: '',
        description: '',
        rent_increase_start_date: '',
        rent_increase_end_date: '',
        invoice_frequency: '',
        bill_day: '',
        days_due: gracePeriod,
        days_due_after_method: `${DueDayAfterMethod.None}`,
        unit_code: !fileData.overrideUnitCode ? unit_Code : fileData.overrideUnitCode,
        area_column_overide: '',
        bill_jan: '0',
        bill_feb: '0',
        bill_mar: '0',
        bill_apr: '0',
        bill_may: '0',
        bill_jun: '0',
        bill_jul: '0',
        bill_aug: '0',
        bill_sep: '0',
        bill_oct: '0',
        bill_nov: '0',
        bill_dec: '0',
        last_day_of_period: '',
        subject_to_late_fee: gracePeriod === '0' ? '0' : '-1',
        ninety_day_due_date: '',
        rent_increase_type: '',
        rent_increase_value: '',
        who_initiates: '',
        earliest_notice_date: '',
        latest_notice_date: '',
        max_days_to_dispute: '',
        max_days_to_negotiate_new_rent: '',
        max_days_to_appoint_valuer: '',
        max_days_to_deliver_valuation: '',
        third_party: '',
        arbitrator_referred_by: '',
        min_increase_type: '',
        min_increase_value: '',
        max_increase_type: '',
        max_increase_value: '',
        market_rent: '',
        settlement_rent: '',
        settlement_date: '',
        notice_served_date: '',
        market_review_notes: '',
        cpi_index1_code: '',
        cpi_min_percent: '',
        cpi_max_percent: '',
        min_decrease_amount: '',
        cpi_cpi_2_ratio_percentage: '',
        fixed_percent: '',
        index_month: '',
        base_month: '',
        index_interval: '',
        index_date: '',
        cpi_increase_factor: '',
        cpi_increase_type: '',
        cpi_index2_code: '',
        index_method: '',
        decrease_possible: '',
        number_of_months_before_index_month: '',
        cpi_breakpoint_1: '',
        cpi_breakpoint_2: '',
        cpi_breakpoint_3: '',
        cpi_breakpoint_4: '',
        cpi_breakpoint_5: '',
        cpi_index_step_1_percent: '',
        cpi_index_step_2_percent: '',
        cpi_index_step_3_percent: '',
        cpi_index_step_4_percent: '',
        cpi_index_step_5_percent: '',
        next_increase_interval: '',
        next_increase_date_after: '',
        check_annually: '',
        increase_as_point: '',
        step_indexation: '',
        li_charge_code: '',
        li_correction_percentage: '',
        rounding: '',
        scandinavian_indexation: '',
        proration_method: '',
        method_of_payment: '',
        sales_tran_type: '',
        taxpoint_day: '',
        bill_in_arrears: '',
        set_invoice_date_to_due_date: '',
        suppress_paper_invoice: '',
        print_invoice_on_change: '',
        invoice_is_leasecurrency: '',
        vat_currency_is_local: '',
        payment_schedule: '',
        rate_provider: '',
        rate_type: '',
        do_not_bill: '',
        do_not_bill_before: '',
        gl_segment_1: '',
        gl_segment_2: '',
        gl_segment_3: '',
        gl_segment_4: '',
        late_fee_grace_period: gracePeriod,
        late_fee_interest_free_period: '',
        latefeecalculationtype: '',
        latefeecalculationbasis: '',
        charge_on_unpaid: '',
        days_in_year: '',
        latefeeinterestindex_code: '',
        latefeepercentage: '',
        latefeefactor: '',
        latefeeadjustment: '',
        latefeeminthreshold: '',
        latefeemaxthreshold: '',
        latefeeminpercentage: '',
        latefeemaxpercentage: '',
        additional_fee: '0',
        amendment_type: `${AmendmentTypes.OriginalLease}`,
        amendment_sequence: '',
        parent_amendment_type: '',
        parent_amendment_sequence: '',
        proposal_type: '',
        eft: '',
        notes: '',
        date_last_billed: '',
        userdefined_1: '',
        userdefined_2: '',
        userdefined_3: '',
        userdefined_4: '',
        userdefined_5: '',
        userdefined_6: '',
        userdefined_7: '',
        userdefined_8: '',
        userdefined_9: '',
        userdefined_10: '',
        userdefined_11: '',
        userdefined_12: '',
        userdefined_13: '',
        userdefined_14: '',
        userdefined_15: '',
        userdefined_16: '',
        userdefined_17: '',
        userdefined_18: '',
        userdefined_19: '',
        userdefined_20: '',
        estimated_rent: '',
        review_type: '',
        ext_schedule_id: '',
      }
    })
    const commchargeschedules = await Promise.all(commChargeSchedulesPromises)
    const commChargeSchedulesWithIds: Partial<CommChargeSchedules>[] = commchargeschedules.map(
      (schedules, index: number) => {
        if (schedules.hasOwnProperty('id')) return schedules
        return {...schedules, id: index + 1}
      }
    )
    dispatch(commChargeSchedulesAdded(commChargeSchedulesWithIds))
    initialRows = new Array(commChargeSchedulesWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommChargeSchedules', rows: initialRows}))
    await delay(delayInMilliseconds)
    const minScheduleFromDate = commchargeschedules.reduce((minDate, schedule) => {
      const scheduleFromDate = new Date(formDate(schedule.schedule_from_date))
      //@ts-ignore
      if (!isNaN(scheduleFromDate) && scheduleFromDate < minDate) {
        return scheduleFromDate
      }
      return minDate
    }, new Date())

    const alternateLeaseStartDate = `${
      minScheduleFromDate.getMonth() + 1
    }/${minScheduleFromDate.getDate()}/${minScheduleFromDate.getFullYear()}`

    leaseStartDate = alternateLeaseStartDate

    dispatch(setProgressStep({value: 'CommLeases'}))
    dispatch(setProgress({value: parseInt(Number(progressUnits * 3).toFixed(2))}))

    const leaseCode =
      !fileData.overrideLeaseCode || fileData.overrideLeaseCode === ''
        ? state.excelFile.leaseCode
        : fileData.overrideLeaseCode

    dispatch(setOriginalLeaseCode(leaseCode))
    dispatch(setLeaseCode(leaseCode))
    //@ts-ignore
    const commleases: Partial<CommLeases>[] = communits.map(() => {
      return {
        property_code: fileData.overridePropertyCode ?? yardiPropertyId,
        lease_code: leaseCode,
        lease_name: tenantName,
        lease_type: leaseType,
        lease_start_date: formDate(leaseStartDate),
        lease_end_date: formDate(leaseEndDate),
        lease_move_in_date: formDate(leaseStartDate),
        sales_category: '',
        ext_ref_lease_id: '',
        ref_property_id: '',
        ref_customer_id: '',
        ext_primarycontact_code: '',
        ext_billingcontact_code: '',
        separate_amendment_terms: '',
        activate: '',
        primarycontact_code: '',
        billingcontact_code: '',
        notes: '',
        customer_code: '',
        company_name: '',
        ics_code: '',
        anchor: '',
        move_out_date: '',
        activation_date: '',
        possession_date: '',
        occupancy_cert_date: '',
        sign_date: '',
        holdover_percentage: state.excelFile.holdover ?? '',
        contract_end_date: '',
        amendment_description: '',
        contracted_area: unitSqft,
        month_to_month: '',
        base_percentage: '',
        late_fee_calc_type: '',
        grace_period: gracePeriod,
        dueday: '',
        late_fee_interest_free: '',
        calc_basis_gross: grossUpPercent > 0 ? -1 : 0,
        charge_on_unpaid: '',
        days_in_year: '',
        interest_index: '',
        factor: '',
        adjustment: '',
        min_threshold: '',
        max_threshold: '',
        min_percentage: '',
        max_percentage: '',
        late_fee_calc_type2: '',
        base_percentage2: '',
        grace_period2: '',
        max_total_fee_type: '',
        max_total_fee_percentage: '',
        late_fee_per_day: '',
        max_number_days: '',
        minimum_due: '',
        default_sales_tran_type: '',
        vat_reg_number: '',
        method_of_payment: '',
        lease_currency: '',
        rate_provider: '',
        rate_type: '',
        sales_currency: '',
        sales_rate_provider: '',
        sales_rate_type: '',
        bill_to_customer: '',
        payment_type: '',
        security_deposit: '',
        preferred_language: '',
        amendment_status: AmendmentStatus.Inprocess,
        amendment_type: AmendmentTypes.OriginalLease,
        amendment_sequence: '',
        parent_amendment_type: '',
        parent_amendment_sequence: '',
        sub_type: '',
        general_info_1: '',
        general_info_2: '',
        general_info_3: '',
        general_info_4: '',
        general_info_5: '',
        general_info_6: '',
        general_info_7: '',
        general_info_8: '',
        general_info_9: '',
        general_info_10: '',
        general_info_11: '',
        general_info_12: '',
        general_info_13: '',
        general_info_14: '',
        other_info_1: '',
        other_info_2: '',
        other_info_3: '',
        other_info_4: '',
        other_info_5: '',
        other_info_6: '',
        other_info_7: '',
        other_info_8: '',
        other_info_9: '',
        other_info_10: '',
        other_info_11: '',
        other_info_12: '',
        other_info_13: '',
        other_info_14: '',
        other_info_15: '',
        other_info_16: '',
        other_info_17: '',
        other_info_18: '',
        other_info_19: '',
        other_info_20: '',
        other_info_21: '',
        tenant_notes: '',
        modification_type: '',
        charge_increase_type: '',
        guarantee_required: '',
        risk_type: '',
        is_cml_lease: '',
        at_risk: '',
        brand: '',
      }
    })

    const commleasesWithIds: Partial<CommLeases>[] = commleases.map((schedules, index: number) => {
      if (schedules.hasOwnProperty('id')) return schedules
      return {...schedules, id: index + 1}
    })
    dispatch(commLeasesAdded(commleasesWithIds))
    initialRows = new Array(commleasesWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommLeases', rows: initialRows}))
    await delay(delayInMilliseconds)
    dispatch(setProgressStep({value: 'CommUnitsXrefs'}))
    dispatch(setProgress({value: progressUnits * 4}))

    const communitsXrefs = unitCodes.map((unit_Code) => ({
      property_code: fileData.overridePropertyCode ?? yardiPropertyId,
      unit_code: !fileData.overrideUnitCode ? unit_Code : fileData.overrideUnitCode,
      lease_code: !fileData.overrideLeaseCode ? state.excelFile.leaseCode : fileData.overrideLeaseCode,
      ref_property_id: '',
      ref_unit_id: '',
      ref_lease_id: '',
      unit_start_date: '',
      unit_end_date: '',
      unit_move_in_date: '',
      unit_move_out_date: '',
      amendment_type: `${AmendmentTypes.OriginalLease}`,
      amendment_sequence: '',
      parent_amendment_type: '',
      parent_amendment_sequence: '',
      status: '',
      proposal_type: '',
    }))

    const communitsXrefsWithIds: Partial<CommUnitXrefs>[] = communitsXrefs.map((schedules, index: number) => {
      if (schedules.hasOwnProperty('id')) return schedules
      return {...schedules, id: index + 1}
    })
    dispatch(commUnitXrefsAdded(communitsXrefsWithIds))
    initialRows = new Array(communitsXrefsWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommUnitsXrefs', rows: initialRows}))
    await delay(delayInMilliseconds)
    dispatch(setProgressStep({value: 'CommSQFTs'}))
    dispatch(setProgress({value: progressUnits * 5}))

    //I don't care that the values aren't a number, the front-end will handle it
    //@ts-ignore
    const commsqfts: Partial<CommSQFTs>[] = unitCodes.map((unit_Code) => ({
      property_code: fileData.overridePropertyCode ?? yardiPropertyId,
      unit_code: !fileData.overrideUnitCode ? unit_Code : fileData.overrideUnitCode,
      dtdate: formDate(leaseStartDate),
      ref_property_id: '',
      ref_unit_id: '',
      dsqft0: unitSqft,
      dsqft1: unitSqft,
      dsqft2: unitSqft,
      dsqft3: unitSqft,
      dsqft4: '',
      dsqft5: '',
      dsqft6: '',
      dsqft7: '',
      dsqft8: '',
      dsqft9: '',
      dsqft10: '',
      dsqft11: '',
      dsqft12: '',
      dsqft13: '',
      dsqft14: '',
      dsqft15: '',
      notes: '',
    }))

    const commsqftsWithIds: Partial<CommSQFTs>[] = commsqfts.map((schedules, index: number) => {
      if (schedules.hasOwnProperty('id')) return schedules
      return {...schedules, id: index + 1}
    })
    dispatch(commSQFTsAdded(commsqftsWithIds))
    initialRows = new Array(commsqftsWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommSQFTs', rows: initialRows}))
    await delay(delayInMilliseconds)
    dispatch(setProgressStep({value: 'CommLeaseRecoveryParams'}))
    dispatch(setProgress({value: progressUnits * 6}))

    const commLeaseRecoveryParamsByUnit: Partial<CommLeaseRecoveryParams>[] = unitCodes.map((unitCode) => ({
      property_code: !fileData.overridePropertyCode ? yardiPropertyId : fileData.overridePropertyCode,
      lease_code: !fileData.overrideLeaseCode ? state.excelFile.leaseCode : fileData.overrideLeaseCode,
      recovery_group: '',
      from_date: formDate(leaseStartDate),
      to_date: formDate(leaseEndDate),
      charge_code: '',
      reconcile_charge_code: '',
      expense_pool: '',
      ref_property_id: '',
      ref_lease_id: '',
      misc_charge_code: '',
      base_year: '',
      group_base_amount: '0',
      group_is_base_amount_credit: '0',
      mgmt_fee_code: '',
      group_mgmt_fee_percent: '0',
      do_not_reconcile: '0',
      unit_recovery: '0',
      group_base_cap_amount: '0',
      group_base_cap_amount_type: '',
      group_cap_increase_percent: '0',
      group_cap_increase_based_on: '0',
      group_cap_increase_base: '0',
      group_cpi_index: '',
      group_cpi_month: '0',
      group_min_percent: '0',
      group_max_percent: '0',
      group_cap_appliesto: '0',
      numerator_column: '0',
      numerator_override: '0',
      fixed_prorata_share_percent: '0',
      use_contract_area: '0',
      denominator_column: '0',
      denominator_override: '0',
      denominator_type: '0',
      min_occupancy_percent: '0',
      custom_denominator_code: '',
      gross_up_percent: `${grossUpPercent}`,
      pool_base_amount: '0',
      pool_is_base_amount_credit: '0',
      pool_mgmt_fee_percent: '0',
      recovery_factor_percent: '0',
      is_anchor_deduction: '0',
      unit_code: '',
      pool_base_cap_amount: '0',
      pool_base_cap_amount_type: '0',
      pool_cap_increase_percent: '0',
      pool_cap_increase_based_on: '0',
      pool_cap_increase_base: '0',
      pool_cpi_index: '',
      pool_cpi_month: '0',
      pool_min_percent: '0',
      pool_max_percent: '0',
      pool_cap_appliesto: '0',
      occupancy_type: `${OccypancyType.OccupiedArea}`,
      proration_type: '1',
      amendment_type: `${AmendmentTypes.OriginalLease}`,
      amendment_sequence: '0',
      parent_amendment_type: '0',
      parent_amendment_sequence: '0',
      amendment_start_date: formDate(leaseStartDate),
      proposal_type: '0',
    }))

    const commLeaseRecoveryParamsByUnitWithIds: Partial<CommLeaseRecoveryParams>[] = commLeaseRecoveryParamsByUnit.map(
      (schedules, index: number) => {
        if (schedules.hasOwnProperty('id')) return schedules
        return {...schedules, id: index + 1}
      }
    )

    const properties = commleasesWithIds.map((x) => x.property_code.trim())
    const filtered = commLeaseRecoveryParamsByUnitWithIds.filter((x) => properties.includes(x.property_code.trim()))

    let filteredRows = filterColumns(filtered, [
      'leasetypecode',
      'leasetypedesc',
      'groupcode',
      'propertycode',
      'estimatechargecode',
      'expensepoolcode',
      'expensepooldescription',
      'reconcilechargecode',
    ])

    // const numToAdd = filteredRecoveryProfiles.length - filteredRows.length
    // const newCommLeaseRecoveryParams = filteredRecoveryProfiles
    // for (let i = 0; i < numToAdd; i++) {
    //   newCommLeaseRecoveryParams.push(newCommLeaseRecoveryParams[0])
    // }
    // const updatedRecoveries = newCommLeaseRecoveryParams.map((newCommLeaseRecoveryParam, index: number) => {
    //   const item = newCommLeaseRecoveryParam[index]

    //   return {
    //     ...newCommLeaseRecoveryParam, // This will copy existing properties
    //     // recovery_group: item.groupcode,
    //     // charge_code: item.estimatechargecode,
    //     // expense_pool: item.expensepoolcode,
    //     // reconcile_charge_code: item.reconcilechargecode,
    //   }
    // })
    dispatch(setProgress({value: progressUnits * 7}))
    dispatch(setRecoveryProfiles(filteredRecoveryProfiles))
    await delay(delayInMilliseconds)

    const commLeaseRecoveryParams: Partial<CommLeaseRecoveryParams>[] = filteredRecoveryProfiles.map((recoveryProfile) => ({
      property_code: fileData.overridePropertyCode ?? yardiPropertyId,
      lease_code: !fileData.overrideLeaseCode ? state.excelFile.leaseCode : fileData.overrideLeaseCode,
      recovery_group: recoveryProfile.groupcode,
      from_date: formDate(leaseStartDate),
      to_date: formDate(leaseEndDate),
      charge_code: recoveryProfile.estimatechargecode,
      reconcile_charge_code: recoveryProfile.reconcilechargecode,
      expense_pool: recoveryProfile.expensepoolcode,
      ref_property_id: '',
      ref_lease_id: '',
      misc_charge_code: '',
      base_year: '',
      group_base_amount: '0',
      group_is_base_amount_credit: '0',
      mgmt_fee_code: '',
      group_mgmt_fee_percent: '0',
      do_not_reconcile: '0',
      unit_recovery: '0',
      group_base_cap_amount: '0',
      group_base_cap_amount_type: '',
      group_cap_increase_percent: '0',
      group_cap_increase_based_on: '0',
      group_cap_increase_base: '0',
      group_cpi_index: '',
      group_cpi_month: '0',
      group_min_percent: '0',
      group_max_percent: '0',
      group_cap_appliesto: '0',
      numerator_column: '0',
      numerator_override: '0',
      fixed_prorata_share_percent: '0',
      use_contract_area: '0',
      denominator_column: '0',
      denominator_override: '0',
      denominator_type: '0',
      min_occupancy_percent: '0',
      custom_denominator_code: '',
      gross_up_percent: `${grossUpPercent}`,
      pool_base_amount: '0',
      pool_is_base_amount_credit: '0',
      pool_mgmt_fee_percent: '0',
      recovery_factor_percent: '0',
      is_anchor_deduction: '0',
      unit_code: '',
      pool_base_cap_amount: '0',
      pool_base_cap_amount_type: '0',
      pool_cap_increase_percent: '0',
      pool_cap_increase_based_on: '0',
      pool_cap_increase_base: '0',
      pool_cpi_index: '',
      pool_cpi_month: '0',
      pool_min_percent: '0',
      pool_max_percent: '0',
      pool_cap_appliesto: '0',
      occupancy_type: `${OccypancyType.OccupiedArea}`,
      proration_type: '1',
      amendment_type: `${AmendmentTypes.OriginalLease}`,
      amendment_sequence: '0',
      parent_amendment_type: '0',
      parent_amendment_sequence: '0',
      amendment_start_date: formDate(leaseStartDate),
      proposal_type: '0',
    }))

    const commLeaseRecoveryParamsWithIds: Partial<CommLeaseRecoveryParams>[] = commLeaseRecoveryParams.map(
      (schedules, index: number) => {
        if (schedules.hasOwnProperty('id')) return schedules
        return {...schedules, id: index + 1}
      }
    )
    const commLeaseRecoveryParamsWithIdsFiltered: Partial<CommLeaseRecoveryParams>[] = commLeaseRecoveryParamsWithIds.filter(
      (item) => item.expense_pool && !item.expense_pool.startsWith('x')
    )

    dispatch(commLeaseRecoveryParamsAdded(commLeaseRecoveryParamsWithIdsFiltered))
    initialRows = new Array(commLeaseRecoveryParamsWithIdsFiltered.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommLeaseRecoveryParams', rows: initialRows}))
    const numOptionsArray = []
    for (let i = 0; i < numOptions; i++) {
      numOptionsArray.push(i)
    }
    dispatch(setProgressStep({value: 'CommOptions'}))
    dispatch(setProgress({value: progressUnits * 8}))

    const commoptions: Partial<CommOptions>[] = numOptionsArray.map((row, index: number) => {
      const expirationDate = new Date(leaseEndDate) // create a new date object
      let earliestNoticeDays,
        maxNoticeDays = 0
      const input = optionTerms.join(' ')
      const pattern = /\d+-\d+/g
      const matches = input.match(pattern)

      if (matches) {
        const range = matches[0].split('-').map(Number)
        if (range.length === 2) {
          earliestNoticeDays = range[0]
          maxNoticeDays = range[1]
        }
      } else {
        const regex = /\b(\w+)\b\s+(?:year|yr)\s+\b(\w+)\b/gi

        let match
        while ((match = regex.exec(input)) !== null) {
          const wordBefore = match[1]
          const wordAfter = match[2]
          optionTerms.push(parseInt(wordBefore))
        }
      }

      // add 6 months to the expiration date
      expirationDate.setMonth(expirationDate.getMonth() + 6 * index)
      const formattedExpirationDate = expirationDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
      return {
        property_code: fileData.overridePropertyCode ?? yardiPropertyId,
        lease_code: state.excelFile.leaseCode,
        expiration_date: formDate(formattedExpirationDate),
        option_type: OptionType.Renewal.toString(),
        option_status: OptionStatus.Active.toString(),
        ref_property_id: '',
        ref_lease_id: '',
        ref_encumb_property_id: '',
        ref_encumb_unit_id: '',
        custom_option_type: '',
        option_term_type: '',
        brief_description_of_the_option: '',
        notes: optionTerms.join(' '),
        who: '',
        penalty: '',
        break_date: '',
        term_in_months:
          extractedOptionTermYears !== -1
            ? `${extractedOptionTermYears * 12}`
            : extractedOptionTermMonths !== -1
            ? `${extractedOptionTermMonths}`
            : '60',
        renewal_type: '',
        earliest_handover: '',
        latest_handover: '',
        ongoing_option: '',
        validtill_date: '',
        timeofessence: '',
        earliest_notice_days: `${maxNoticeDays * 30}`,
        latest_notice_days: isNaN(earliestNoticeDays) ? '0' : `${earliestNoticeDays * 30}`,
        notice_sent_date: '',
        notice_received_date: '',
        response: '',
        renewal_rent_type: '',
        percent_fair_market_value: '',
        fixed_rent: '',
        fixed_rent_type: '',
        other_rent_notes: '',
        overage_rent_type: '',
        percent_of_sales: '',
        percent_of_sales_less_rent: '',
        percent_of_sales_less_fixed_breakpoint: '',
        breakpoint_amount: '',
        clause_name: '',
        clause_description: '',
        encumb_property_code: '',
        encumb_building_code: '',
        encumb_floor_code: '',
        encumb_unit_code: '',
        required_area: '',
        contiguous_area: '',
        amendment_type: '',
        amendment_sequence: '',
        parent_amendment_type: '',
        parent_amendment_sequence: '',
        proposal_type: ProposalType.Renewal.toString(),
      }
    })

    const commOptionsWithIds: Partial<CommOptions>[] = commoptions.map((schedules, index: number) => {
      if (schedules.hasOwnProperty('id')) return schedules
      return {...schedules, id: index + 1}
    })

    dispatch(commOptionsAdded(commOptionsWithIds))
    initialRows = new Array(commOptionsWithIds.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommOptions', rows: initialRows}))
    await delay(delayInMilliseconds)
    dispatch(setProgressStep({value: 'CommOptions'}))
    dispatch(setProgress({value: progressUnits * 9}))

    const commrecoveryexcludes: Partial<CommRecoveryExcludes>[] = commLeaseRecoveryParamsWithIds.map((row) => ({
      exclude_type: '1', //lease, '3' is property
      account: '',
      recovery_group_code: row.recovery_group,
      expense_pool: row.expense_pool,
      property_code: row.property_code,
      ref_property_id: '',
      ref_lease_id: '',
      lease_type: leaseType,
      lease_code: leaseCode,
      amendment_sequence: '',
      amendment_type: '',
    }))

    const commExcludesWithIds: Partial<CommRecoveryExcludes>[] = commrecoveryexcludes.map((schedules, index: number) => {
      if (schedules.hasOwnProperty('id')) return schedules
      return {...schedules, id: index + 1}
    })
    const commExcludesWithIdsFiltered = commExcludesWithIds.filter((item) => {
      return item.expense_pool /*&& item.expense_pool.startsWith('x')*/
    })
    dispatch(commExcludesAdded(commExcludesWithIdsFiltered))
    initialRows = new Array(commExcludesWithIdsFiltered.length).fill(false)
    dispatch(setCheckedRows({tableName: 'CommExcludes', rows: initialRows}))
    dispatch(setProgress({value: 100}))
    await delay(delayInMilliseconds)
  }
)

const initialSortState = {
  commUnits: [],
  commChargeSchedules: [],
  commLeases: [],
  commUnitXrefs: [],
  commSQFTs: [],
  commLeaseRecoveryParams: [],
  commOptions: [],
  currentColumn: 'id',
}

const sortStateSlice = createSlice({
  name: 'sortState',
  initialState: initialSortState,

  reducers: {
    setSortState: (state, action: PayloadAction<{tableName: string; columnName: string}>) => {
      const {tableName, columnName} = action.payload

      // Check if the table name already exists in the state
      if (!state[tableName]) {
        state[tableName] = []
      }

      // Find the column if it exists
      const column = state[tableName].find((col) => col.columnName === columnName)

      if (column) {
        // If the column exists, cycle its sort state
        if (column.sortState === null) column.sortState = true
        else if (column.sortState === true) column.sortState = false
        else if (column.sortState === false) column.sortState = null
      } else {
        // If the column does not exist, add it with a sort state of true
        state[tableName].push({columnName, sortState: true})
      }
    },
    resetSortState: (state) => {
      return initialSortState
    },
    // getCurrentColumn: (state, action: PayloadAction<{ tableName: string, columnName: string }>) => {

    // },
  },
})

export const {setSortState, resetSortState} = sortStateSlice.actions
export const sortStateReducer = sortStateSlice.reducer

export const {
  addUnitCode,
  clearUnitCodes,
  setLeaseCode,
  setOverridePropertyCode,
  setOverrideUnitCode,
  setOverrideLeaseCode,
  setProgress,
  setPropertyCode,
  setProgressStep,
  setCommChargeSchedulesCurrentPage,
  setItemsPerPage,
  setTotalItems,
  setChargeCodes,
  setSearchValue,
  setSearchValueExpensePool,
  setCheckedRows,
  setActiveTab,
  setUserName,
  filterChargeCodes,
  setCommChargeSchedulesSortOrder,
  setCommChargeSchedulesColumnId,
  setHeaderCheckboxChecked,
  setHaveChangesBeenMade,
  setSearchValueRecoveries,
  setRecoveryProfiles,
  setFile,
  setOriginalPropertyCode,
  setOriginalUnitCodes,
  setHoldOver,
  setOriginalLeaseCode,
  setCurrentPage,
  updateDatabaseMetadata,
  setsearchValuePropExpensePoolAccounts,
} = excelFileSlice.actions

/**
 * Retrieves charge schedules based on the provided worksheet, state, and dispatch method.
 *
 * @param {XLSX.WorkSheet} worksheet - The worksheet object containing the data.
 * @param {RootState} state - The current state of the application.
 * @param {ThunkDispatch<unknown, unknown, AnyAction>} dispatch - The dispatch method for async actions.
 * @returns {Partial<CommChargeSchedules>[]} An array of charge schedules, partially filled with the CommChargeSchedules object.
 */
function getChargeSchedules(
  worksheet: XLSX.WorkSheet,
  state: RootState,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>
): Partial<CommChargeSchedules>[] {
  unitCodes = []
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  let lowerLastCol = 'TENANT IMPROVEMENT COSTS (if applicable)/TENANT INSURANCE'.toLowerCase()

  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''

      if (cellValue === 'YARDI PROPERTY ID:') {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        yardiPropertyId = value
        dispatch(setOriginalPropertyCode(value))
      }
      if (cellValue.includes('LEASE START DATE')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.w?.toString() ?? ''
        leaseStartDate = value
      }
      if (cellValue.includes('LEASE END DATE')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.w?.toString() ?? ''
        leaseEndDate = value
      }
      if (cellValue.includes('TENANT:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        tenantName = value
      }
      if (cellValue.includes('PREMISE ADDRESS:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        if (value.includes(',')) {
          const cityMatch = sanDiegoCities.find((item) => value.includes(item.name))
          if (cityMatch) {
            city = cityMatch.name
            const stateMatch = americanCities.find((item) => item.name === cityMatch.name)
            if (stateMatch) {
              americanState = stateMatch.acronym
            }
            zip = value.replace(city, '').replace(americanState, '').replace(',', '').trim()
          }
        }
      }
      // if (cellValue.includes('PREMISE ADDRESS:') && city === '') {
      //   const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
      //   const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
      //   const cellAddress = XLSX.utils.encode_cell({r: row, c: col + 1})
      //   let value = worksheet[cellAddress]?.v?.toString() ?? ''
      //   if (value.includes(',')) {
      //     const addresses = value.split(' ')
      //     city = addresses[addresses.length - 1].replace(',', '')
      //     state = addresses[addresses.length - 2]
      //     zip = addresses[addresses.length - 1]
      //   }
      // }
      if (cellValue.includes('UNIT(S):')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        if (value.includes(',')) {
          multipleUnits = true
          const units = value.split(',')
          units.forEach((unit) => {
            unit = unit.replace(',', '').trim()
            unitCodes.push(unit)
          })
        } else if (!value.includes(',')) {
          unitCodes.push(value)
        }

        dispatch(setOriginalUnitCodes(unitCodes))
      }
      if (cellValue.includes('TENANT:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        tenantName = value
      }
      if (cellValue.toUpperCase().includes('LEASE TYPE')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString() ?? ''
        leaseType = value === 'NNN' ? 'offnet' : value
      }

      if (cellValue.toUpperCase().includes('UNIT SQ FT')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString().replace(/[$,]/g, '').trim() ?? ''
        unitSqft = value
      }
      if (cellValue.toUpperCase().includes('GRACE PERIOD')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString().replace(/[$,]/g, '').trim() ?? ''
        let gpArray = value.includes(' ') ? value.split(' ') : [value]

        gpArray.forEach((gp) => {
          if (!isNaN(gp)) {
            value = gp
            return
          }
        })
        gracePeriod = value
      }
      if (cellValue.toUpperCase().includes('GROSS UP %')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        let value = worksheet[cellAddress]?.v?.toString().replace(/[$,]/g, '').trim() ?? ''
        grossUpPercent = value ? value * 100 : 0
      }

      const upperLastRow = 'RETAIL (If Applicable)'.toUpperCase()

      if (cellValue.toUpperCase().includes('RENEWAL OPTIONS')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRowOptions = row
        let termsAddress = XLSX.utils.encode_cell({r: row, c: col + 1})
        optionTerms.push(worksheet[termsAddress]?.v?.toString())

        const regexPattern = /Notice\s+(\d+)\s*-\s*(\d+)\s+days/gi
        const inputString = worksheet[termsAddress]?.v?.toString()
        const match = inputString && inputString.match(regexPattern)

        if (match) {
          const startRange = match[1] // Number before the dash
          const endRange = match[2] // Number after the dash
        }
      }
      if (cellValue.toUpperCase().includes(upperLastRow) && firstRowOptions > 0) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRowOptions = row
        let numRows = lastRowOptions - firstRowOptions

        for (let i = 0; i < numRows; i++) {
          const newRow = firstRowOptions + i + 1
          let termsAddress = XLSX.utils.encode_cell({r: newRow, c: col + 1})
          // const isNextSectionAddress = XLSX.utils.encode_cell({r: newRow - 1, c: col})
          // const nextSectionValue = worksheet[isNextSectionAddress]?.v?.toString().includes(upperLastRow)
          // if (nextSectionValue) return
          let val = worksheet[termsAddress]?.v !== 'undefined'
          val && optionTerms.push(worksheet[termsAddress]?.v?.toString())
          const regexPattern = /Notice\s+(\d+)\s*-\s*(\d+)\s+days/gi
          const inputString = worksheet[termsAddress]?.v?.toString()
          const match = inputString && inputString.match(regexPattern)

          if (match) {
            const startRange = match[1] // Number before the dash
            const endRange = match[2] // Number after the dash
          }
        }
        optionTerms = optionTerms.filter((term) => term !== undefined)
        const input = optionTerms.join(' ')
        const number = extractNumberFromText(input)
        numOptions = number

        const pattern = /\b(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten)\b/gi
        const matches = input.match(pattern)

        if (matches) {
          const quantity = matches[0]
        } else {
          console.log('No match found.')
        }

        let regex = /(\d+)\-Yr/

        // Extract the # before -Yr using match()
        let match = input.match(regex)

        // Check if a match is found and retrieve the captured group
        if (match && (match[1] || match[2])) {
          extractedOptionTermYears = parseInt(match[1] || match[2])
        }

        regex = /(\d+)\-Month(?:s)?|(\d+)\-Mo(?:s)?/gi

        match = input.match(regex)
        if (match && (match[1] || match[2])) {
          extractedOptionTermMonths = parseInt(match[1] || match[2])
        }
      }

      if (cellValue && cellValue.toString().toLowerCase().includes('charges:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))

        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toUpperCase().includes('RENT CHARGE NOTES:')) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 2
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(lowerLastCol)) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        lastCol = col - 1
      }
      if (cellValue && cellValue.toString().toUpperCase().includes('HOLDING OVER:')) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        const cellAddress = XLSX.utils.encode_cell({r: row - 1, c: col + 1})
        dispatch(setHoldOver(worksheet[cellAddress]?.w?.toString().replace('%', '') ?? ''))
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''

        if (cellValue.includes('$')) {
          const rawValue = worksheet[cellAddress]?.v
          cellValue = rawValue.toString()
        }

        if (cellValue.includes('until changed')) {
          const yr = new Date(leaseEndDate).getFullYear()
          const month = new Date(leaseEndDate).getMonth()
          lastDayStartMonth = getLastDayOfMonth(yr, month)
          cellValue = lastDayStartMonth
        }

        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

function getTenantImprovement(worksheet) {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  lastCol = 7
  const loweredFirstRow = 'TENANT IMPROVEMENT COSTS (if applicable)/TENANT INSURANCE'.toLowerCase()
  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue && cellValue.toString().toLowerCase().includes(loweredFirstRow)) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toUpperCase().includes('IMPORTANT CLAUSES:')) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 2
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  // Extracting data row by row from the specified range
  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

function getRenewalOptions(worksheet) {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  let lowerLastCol = 9
  lastCol = lowerLastCol - 1
  const loweredFirstRow = 'RENEWAL OPTIONS:'.toLowerCase()
  const upperLastRow = 'RETAIL (If Applicable)'.toUpperCase()
  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue && cellValue.toString().toLowerCase().includes(loweredFirstRow)) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toUpperCase().includes(upperLastRow)) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 1
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  // Extracting data row by row from the specified range
  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

function getCAM(worksheet) {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  let lowerLastCol = 'RETAIL (If Applicable)'.toLowerCase()
  let loweredLastRow = 'LEASE OPTIONS:'.toLowerCase()

  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue && cellValue.toString().toLowerCase().includes('cam:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(loweredLastRow)) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 2
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(lowerLastCol)) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        lastCol = col - 1
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  // Extracting data row by row from the specified range
  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

function getLeaseOptions(worksheet) {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  let lowerLastCol = 'RETAIL (If Applicable)'.toLowerCase()
  let loweredLastRow = 'prepared by:'.toLowerCase()

  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue && cellValue.toString().toLowerCase().includes('lease options:')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(loweredLastRow)) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 2
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(lowerLastCol)) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        lastCol = col - 1
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  // Extracting data row by row from the specified range
  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.w?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

function getUnitInformation(worksheet) {
  let firstRow = 0
  let lastRow = 0
  let firstCol = 0
  let lastCol = 0
  let loweredLastRow = 'BILLING CONTACT (if different from Tenant Information)'.toLowerCase()
  lastCol = 7
  for (const cell in worksheet) {
    if (cell[0] === '!') continue // Skip metadata
    let cellValue: string = ''
    try {
      cellValue = worksheet[cell]?.v?.toString() ?? ''
      if (cellValue && cellValue.toString().toUpperCase().includes('UNIT AND LEASE INFORMATION')) {
        const col: number = XLSX.utils.decode_col(cell.replace(/\d/g, ''))
        firstCol = col
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        firstRow = row
      }
      if (cellValue && cellValue.toString().toLowerCase().includes(loweredLastRow)) {
        const row = parseInt(cell.replace(/[^0-9]/g, '')) // Extract row number as integer
        lastRow = row - 1
      }
    } catch (error) {
      console.log(cellValue)
      throw error
    }
  }

  // Extracting data row by row from the specified range
  const data = []

  for (let row = firstRow + 1; row <= lastRow; row++) {
    try {
      const rowData = []
      for (let col = firstCol; col <= lastCol; col++) {
        const cellAddress = XLSX.utils.encode_cell({r: row, c: col})
        let cellValue = worksheet[cellAddress]?.v?.toString() ?? ''
        if (cellValue.includes('$')) {
          cellValue = cellValue.replace(/[$,]/g, '').trim()
        }
        rowData.push(cellValue)
      }
      data.push(rowData)
    } catch (error) {
      throw error
    }
  }
  const filteredData = data.filter((rowData) => rowData.some((value) => value !== ''))

  return filteredData
}

export default excelFileSlice.reducer
export const commUnitsReducer = commUnitsSlice.reducer
export const commChargeSchedulesReducer = commChargeSchedulesSlice.reducer
export const commLeasesReducer = commLeasesSlice.reducer
export const commUnitXrefsReducer = commUnitXrefsSlice.reducer
export const commSQFTsReducer = commSQFTsSlice.reducer
export const columnsInformationReducer = columnsInformationSlice.reducer
