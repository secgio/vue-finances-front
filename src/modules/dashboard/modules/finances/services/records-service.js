/* Verifica as querys trabalhando o retorno dos dados */

import apollo from '@/plugins/apollo'
import moment from 'moment'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import md5 from 'md5'

import RecordCreateMutation from './../graphql/RecordCreate.gql'
import RecordEditMutation from './../graphql/RecordsEdit.gql'
import RecordDeleteMutation from './../graphql/RecordsDelete.gql'
import RecordsQuery from './../graphql/Records.gql'
import TotalBalanceQuery from './../graphql/TotalBalance.gql'

const createRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordCreateMutation,
    variables,
    update: (proxy, { data: { createRecord } }) => {
      // records
      const month = moment(createRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })
        recordsData.records = [...recordsData.records, createRecord]
        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('Query "records" has not been read yet!', e)
      }
      // totalBalance
      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(createRecord.date.substr(0, 10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + createRecord.amount).toFixed(2)

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query "totalBalance" has not been read yet!', e)
      }
    }
  })
  return response.data.createRecord
}

const editRecords = async variables => {
  const recordsLines = variables
  const month = moment(variables.date.substr(0, 10)).format('MM-YYYY')
  const response = await apollo.mutate({

    mutation: RecordEditMutation,
    variables,
    update: (proxy, { data: { editRecords } }) => {
      const variables = { month }
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })
        var indexEdit = recordsData.records.findIndex((records) => {
          return records.id === recordsLines.id
        })

        recordsData.records.splice(recordsData.records.indexOf(indexEdit), 1, recordsLines)

        /* if (indexEdit !== -1) {
          recordsData.records.splice(indexEdit, 1, recordsLines)
          recordsData.records = [...recordsData.records, recordsLines]
        } */

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('Query "records" has not been read yet!', e)
      }
      /* try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        recordsData.records = [...recordsData.records, recordsLines]

        proxy.writeQuery({
          query: RecordsQuery,
          variables,
          data: recordsData
        })
      } catch (e) {
        console.log('Query "records" has not been read yet!', e)
      } */
      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(recordsLines.date.substr(0, 10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = +(totalBalanceData.totalBalance + recordsLines.amount).toFixed(2)

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query "totalBalance" has not been read yet!', e)
      }
    }
  })
  return response.data.editRecords
}

const deleteRecord = async variables => {
  const response = await apollo.mutate({
    mutation: RecordDeleteMutation,
    variables,
    update (proxy, { data: { deleteRecord } }) {
      const month = moment(deleteRecord.date.substr(0, 10)).format('MM-YYYY')
      const variables = { month }
      try {
        const recordsData = proxy.readQuery({
          query: RecordsQuery,
          variables
        })

        var index = recordsData.records.findIndex((records) => {
          return records.id === deleteRecord.id
        })

        if (index !== -1) {
          recordsData.records.splice(index, 1)
        }
      } catch (e) {
        console.log('Query "records" has not been read yet!', e)
      }
      // totalBalance
      try {
        const currentDate = moment().endOf('day')
        const recordDate = moment(deleteRecord.date.substr(0, 10))
        const variables = { date: currentDate.format('YYYY-MM-DD') }

        console.log('Amount: ', deleteRecord.amount)

        if (recordDate.isBefore(currentDate)) {
          const totalBalanceData = proxy.readQuery({
            query: TotalBalanceQuery,
            variables
          })

          totalBalanceData.totalBalance = -(totalBalanceData.totalBalance - deleteRecord.amount).toFixed(2)

          proxy.writeQuery({
            query: TotalBalanceQuery,
            variables,
            data: totalBalanceData
          })
        }
      } catch (e) {
        console.log('Query "totalBalance" has not been read yet!', e)
      }
    }
  })
  return response.data.deleteRecord
}

const recordsWatchedQueries = {}

const records = variables => {
  const hashKey = md5(
    Object
      .keys(variables)
      .map(k => variables[k]).join('_')
  )

  let queryRef = recordsWatchedQueries[hashKey]

  if (!queryRef) {
    queryRef = apollo.watchQuery({
      query: RecordsQuery,
      variables
    })
    recordsWatchedQueries[hashKey] = queryRef
  }

  return from(queryRef)
    .pipe(
      map(res => res.data.records)
    )
}

const totalBalance = async () => {
  const response = await apollo.query({
    query: TotalBalanceQuery,
    variables: {
      date: moment().format('YYYY-MM-DD')
    }
  })
  return response.data.totalBalance
}

export default {
  createRecord,
  editRecords,
  deleteRecord,
  records,
  totalBalance
}
