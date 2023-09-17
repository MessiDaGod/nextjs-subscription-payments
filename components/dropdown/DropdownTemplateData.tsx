import {useMemo, useState} from 'react'
import {Log, runSqlQuery, getMyType} from 'components/utils'
import dimensions from './Dimensions.json'
import vendors from './FinVendors.json'
import properties from './Properties.json'
import accounts from './accounts.json'
import tenants from './TenantTable.json'
import leases from './LeaseTable.json'
import etlLeases from './CommercialEtlLeases.json'
import tables from './Tables.json'
import GoodColumns from './GoodColumns.json'
import {Account} from '@/api/Account'
import expenseTypes from './ExpenseTypes.json'
import Properties from './Properties.json'

interface DropdownTemplateDataProps {
  supabase?: any
  client?: string
  userid?: string
  selectItem?: string
  numItems?: number | null
  tableName?: string
}

async function DropdownTemplateData({
  supabase,
  client,
  userid,
  selectItem,
  numItems,
  tableName,
}: DropdownTemplateDataProps) {
  const myType = getMyType(selectItem)
  const myColumns = GoodColumns[myType]

  if (!myColumns) {
    return null
  }
  const columnKeys = await Promise.all(
    Object.entries(myColumns).map(async ([key, value], index: number) => {
      return {Item: myType, Index: index, Name: value['Name']}
    })
  )

  const filteredColumns = myType && (await Promise.all(columnKeys.map(async (col) => col.Name)))

  switch (selectItem) {
    case 'GetPropOptions':
      if (!client) return []
      if (client !== 'Blanton Turner') {
        const propertiesData = JSON.parse(JSON.stringify(properties))
        const filteredPropertiesData = await Promise.all(
          propertiesData.map(async (item) => {
            const {HMY, SCODE, SADDR1} = item
            return {
              Id: HMY,
              Property_Code: SCODE,
              Property_Name: SADDR1,
            }
          })
        )
        return filteredPropertiesData
      } else if (client === 'Blanton Turner') {
        const props = await supabase
          .from('propoptions')
          .select('id, property_code, property_name')
          .eq('userid', userid)
          .eq('type', 'hPayableCashAcct')
        const distinctArray = props.data.reduce((acc, value) => {
          if (!acc.includes(value)) {
            acc.push(value)
          }
          return acc
        }, [])

        return distinctArray
      }

    case 'GetAccounts':
      if (!client) return []
      if (client !== 'Blanton Turner') {
        const accountsData = JSON.parse(JSON.stringify(accounts))
        const accountsObject = (accountsData as Account[]).filter((x) => x.Account_Type === '0')
        const filteredAccountsData = await Promise.all(
          accountsObject.map(async (item) =>
            Object.keys(item)
              .filter((key) => filteredColumns.includes(key))
              .reduce((obj, key) => {
                obj[key] = item[key]
                return obj
              }, {})
          )
        )
        return filteredAccountsData
      } else if (client === 'Blanton Turner') {
        const datas = await supabase
          .from('glaccts')
          .select('id, account_code, description')
          .eq('userid', userid)
          .eq('normal_balance', '0')
          .eq('account_type', '0')
          .eq('report_type', '0')

        const clearingAccount = await supabase
          .from('glaccts')
          .select('id, account_code, description')
          .eq('userid', userid)
          .eq('normal_balance', '0')
          .eq('account_type', '0')
          .eq('report_type', '1')
          // .ilike('description', '%clearing%')
          .eq('description', 'Cash clearing account')

        const distinctArray = datas.data.reduce((acc, value) => {
          if (!acc.includes(value)) {
            acc.push(value)
          }
          return acc
        }, [])

        return [...clearingAccount.data, ...distinctArray]
      }

    case 'Post Invoices':
      const invoiceData = JSON.parse(JSON.stringify(dimensions))
      const filteredInvoiceData = await Promise.all(
        invoiceData.map(async (item) =>
          Object.keys(item)
            .filter((key) => filteredColumns.includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key]
              return obj
            }, {})
        )
      )
      return filteredInvoiceData

    case 'CommLeases':
      const etlLeaseData = JSON.parse(JSON.stringify(etlLeases))
      const filteredetlLeaseData = await Promise.all(
        etlLeaseData.map(async (item) =>
          Object.keys(item)
            .filter((key) => filteredColumns.includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key]
              return obj
            }, {})
        )
      )
      return filteredetlLeaseData

    case 'GetFromQuery':
      return runSqlQuery(tableName, numItems ?? 1)

    case 'GetTenants':
      return JSON.parse(JSON.stringify(tenants))

    case 'GetLeases':
      return JSON.parse(JSON.stringify(leases))

    case 'GetVendors':
      if (!client) return []
      if (client !== 'Blanton Turner') {
        const vendorsData = JSON.parse(JSON.stringify(vendors))
        const filteredVendorsData = await Promise.all(
          vendorsData.map(async (item) =>
            Object.keys(item)
              .filter((key) => filteredColumns.includes(key))
              .reduce((obj, key) => {
                obj[key] = item[key]
                return obj
              }, {})
          )
        )
        return filteredVendorsData
      } else if (client === 'Blanton Turner') {
        const props = await supabase
          .from('finvendors')
          .select('id, vendor_code, address1')
          .eq('userid', userid)
        const distinctArray = props.data.reduce((acc, value) => {
          if (!acc.includes(value)) {
            acc.push(value)
          }
          return acc
        }, [])

        return distinctArray
      }

    case 'GetTables':
      const originalTableObject = JSON.parse(JSON.stringify(tables))
      const tableObjectWithId = await Promise.all(
        originalTableObject.map(async (obj, index) => ({
          Id: index + 1,
          TableName: obj.TableName,
          Object_Id: obj.Object_Id,
        }))
      )
      return tableObjectWithId
    case 'GetExpenseTypes':
      const expenseTypesData = JSON.parse(JSON.stringify(expenseTypes))
      const expenseTypesFilteredData = await Promise.all(
        expenseTypesData.map(async (item) =>
          Object.keys(item)
            .filter((key) => filteredColumns.includes(key))
            .reduce((obj, key) => {
              obj[key] = item[key]
              return obj
            }, {})
        )
      )
      return expenseTypesFilteredData

    case 'GetProperties':
      if (!client) return []
      if (client !== 'Blanton Turner') {
        const propData = JSON.parse(JSON.stringify(Properties))
        const filteredPropData = await Promise.all(
          propData.map(async (item) =>
            Object.keys(item)
              .filter((key) => filteredColumns.includes(key))
              .reduce((obj, key) => {
                obj[key] = item[key]
                return obj
              }, {})
          )
        )
        return filteredPropData
      } else if (client === 'Blanton Turner') {
        const props = await supabase
          .from('propoptions')
          .select('id, property_code, property_name')
          .eq('userid', userid)
          .eq('type', 'hPayableCashAcct')
        const distinctArray = props.data.reduce((acc, value) => {
          if (!acc.includes(value)) {
            acc.push(value)
          }
          return acc
        }, [])

        return distinctArray
      }

    default:
      return []
  }
}

export default DropdownTemplateData
