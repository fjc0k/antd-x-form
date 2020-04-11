import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { castArray, isPromiseLike } from 'vtils'
import {
  ColumnFilterItem,
  TablePaginationConfig,
} from 'antd/lib/table/interface'
import { MarkRequired, Merge } from '../../types'
import { Table } from 'antd'
import { TableProps } from 'antd/lib/table'
import { useRefValue, useUpdateEffect } from '../../hooks'
import {
  XTableDataSourceResult,
  XTableFiledPath,
  XTableFilter,
  XTableItem,
  XTableProps,
  XTableRef,
  XTableSorter,
} from './types'

const filedPath: XTableFiledPath<any> = path => castArray(path as any).join('.')

function XTableComponent<TItem extends XTableItem>(
  props: XTableProps<TItem>,
  ref: React.Ref<XTableRef<TItem>>,
) {
  const dataSource = useRefValue(props.dataSource)
  const [tableProps, setTableProps] = useState<
    Merge<
      TableProps<TItem>,
      {
        pagination: MarkRequired<TablePaginationConfig, 'current' | 'pageSize'>
      }
    >
  >({
    pagination: {} as any,
  })
  const [noPagination, setNoPagination] = useState(false)
  const [filter, setFilter] = useState<XTableFilter>({})
  const [sorter, setSorter] = useState<XTableSorter>({})

  // ===== 更新表格属性 =====
  const updateTableProps = () => {
    const nextXTableProps = props.extraProps({
      path: filedPath,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      table: table,
    })
    const nextTableProps = (nextXTableProps as any) as TableProps<TItem>
    nextTableProps.columns = nextTableProps.columns?.map(
      (column, columnIndex) => {
        column = { ...column }
        const { render, filters } = nextXTableProps.columns[columnIndex]
        column.render = (value, record, index) => render(record, index)
        column.filters = filters?.map(function transform(
          item,
        ): ColumnFilterItem {
          return {
            text: item.label,
            value: JSON.stringify(item.value),
            children: item.children?.map(transform),
          }
        })
        return column
      },
    )
    const handleChange = nextTableProps.onChange
    nextTableProps.onChange = function (pagination, filters, sorter) {
      const sorters = castArray(sorter)
      setTableProps(tableProps => ({
        ...tableProps,
        pagination: {
          ...tableProps.pagination,
          ...pagination,
        },
      }))
      setFilter(
        Object.keys(filters).reduce<XTableFilter>((res, key) => {
          if (filters[key] != null) {
            res[key] = filters[key]!.map(value => JSON.parse(value as string))
          }
          return res
        }, {}),
      )
      setSorter(
        sorters.reduce<XTableSorter>((res, sorter) => {
          if (sorter.columnKey != null && sorter.order != null) {
            res[sorter.columnKey] = sorter.order === 'ascend' ? 'asc' : 'desc'
          }
          return res
        }, {}),
      )
      // eslint-disable-next-line prefer-rest-params
      handleChange?.apply(null, arguments as any)
    }
    setTableProps(tableProps => ({
      ...tableProps,
      ...nextTableProps,
      pagination: {
        current: 1,
        pageSize: 10,
        ...(nextTableProps.pagination || {}),
        ...tableProps.pagination,
      },
    }))
    setNoPagination(nextTableProps.pagination === false)
  }
  const updateTablePropsDependencies = props.extraPropsDependencies || []
  useEffect(() => {
    updateTableProps()
  }, updateTablePropsDependencies)

  // ===== 更新表格数据 =====
  const updateTableData = (resetPageNumber?: boolean): Promise<void> => {
    return new Promise(resolve => {
      if (resetPageNumber) {
        setTableProps(tableProps => ({
          ...tableProps,
          pagination: {
            ...tableProps.pagination,
            current: 1,
          },
        }))
      }
      const rawData = dataSource.current({
        path: filedPath,
        pagination: {
          pageNumber: resetPageNumber ? 1 : tableProps.pagination.current,
          pageSize: tableProps.pagination.pageSize,
        },
        filter: filter,
        sorter: sorter,
      })
      new Promise<XTableDataSourceResult<TItem>>(resolve => {
        if (isPromiseLike(rawData)) {
          setTableProps(tableProps => ({
            ...tableProps,
            loading: true,
          }))
        }
        resolve(rawData)
      })
        .then(res => {
          setTableProps(tableProps => {
            const nextPageNumber = Math.min(
              Math.ceil(res.total / tableProps.pagination.pageSize),
              tableProps.pagination.current,
            )
            return {
              ...tableProps,
              pagination: {
                ...tableProps.pagination,
                current: nextPageNumber,
                total: res.total,
              },
              ...(nextPageNumber !== tableProps.pagination.current
                ? {}
                : {
                    dataSource: res.data,
                    loading: false,
                  }),
            }
          })
        })
        .then(resolve)
    })
  }
  const updateTableDataRef = useRef(updateTableData)
  const updateTableDataInternalDependencies = [
    tableProps.pagination.current,
    tableProps.pagination.pageSize,
    filter,
    sorter,
  ]
  const updateTableDataExternalDependencies = props.dataSourceDependencies || []
  const updateTableDataDependencies = [
    ...updateTableDataInternalDependencies,
    ...updateTableDataExternalDependencies,
  ]
  useEffect(() => {
    updateTableDataRef.current = updateTableData
  }, updateTableDataDependencies)
  useUpdateEffect(() => {
    updateTableDataRef.current()
  }, updateTableDataInternalDependencies)
  useUpdateEffect(() => {
    updateTableDataRef.current(true)
  }, updateTableDataExternalDependencies)

  // ===== ref =====
  const table = useMemo(
    (): XTableRef<TItem> => ({
      toggleLoading: () => {
        setTableProps(tableProps => ({
          ...tableProps,
          loading: !tableProps.loading,
        }))
      },
      refresh: () => updateTableDataRef.current(),
      reset: () => updateTableDataRef.current(true),
    }),
    [],
  )
  useImperativeHandle<any, XTableRef<TItem>>(ref, () => table, [])

  return (
    <Table
      {...tableProps}
      pagination={!noPagination && tableProps.pagination}
    />
  )
}

export const XTable: <TItem extends XTableItem>(
  props: XTableProps<TItem> & React.RefAttributes<XTableRef<TItem> | undefined>,
) => React.ReactElement = React.forwardRef(XTableComponent) as any
