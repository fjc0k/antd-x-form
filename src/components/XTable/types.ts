import React from 'react'
import {
  AsyncOrSync,
  DeepRequired,
  Defined,
  LiteralUnion,
  Merge,
  Path,
  StrictOmit,
} from '../../types'
import { TableProps } from 'antd/lib/table'

/** 表格条目 */
export interface XTableItem extends Record<string, any> {}

/** 表格分页 */
export type XTablePagination = {
  /** 当前页码 */
  pageNumber: number
  /** 页容量 */
  pageSize: number
}

export type XTableFilterItem<TValue = any> = {
  label: React.ReactNode
  value?: TValue
  children?: XTableFilterItem<TValue>[]
}

/** 表格过滤 */
export type XTableFilter = {
  [K in string]?: any[]
}

/** 表格排序 */
export type XTableSorter = {
  [K in string]?: 'asc' | 'desc'
}

/** 表格字段路径 */
export type XTableFiledPath<TItem extends XTableItem> = <
  TPath extends Path<DeepRequired<TItem>, TPath>
>(
  path: TPath,
) => string

export interface XTableDataSourcePayload<TItem extends XTableItem> {
  /**
   * 路径获取，若使用，必须给 XTable 传入表格数据的类型，如:
   * ```
   * interface User {
   *   id: number
   *   name: string
   * }
   *
   * <XTable<User> />
   * ```
   */
  path: XTableFiledPath<TItem>
  /** 分页信息 */
  pagination: XTablePagination
  /** 过滤信息 */
  filter: XTableFilter
  /** 排序信息 */
  sorter: XTableSorter
}

/** 表格数据源返回结果 */
export type XTableDataSourceResult<TItem extends XTableItem> = {
  /** 表格总行数 */
  total: number
  /** 表格数据 */
  data: TItem[]
}

/** 表格数据源 */
export type XTableDataSource<TItem extends XTableItem> = (
  payload: XTableDataSourcePayload<TItem>,
) => AsyncOrSync<XTableDataSourceResult<TItem>>

/** 表格属性 */
export interface XTableProps<TItem extends XTableItem> {
  /** 数据源 */
  dataSource: XTableDataSource<TItem>
  dataSourceDependencies?: React.DependencyList
  /** 其他属性 */
  extraProps: (payload: {
    /** 路径获取 */
    path: XTableFiledPath<TItem>
    /** 表格实例 */
    table: XTableRef<TItem>
  }) => Merge<
    StrictOmit<TableProps<TItem>, 'dataSource'>,
    {
      columns: Array<
        Merge<
          Defined<TableProps<TItem>['columns']>[0],
          {
            key: LiteralUnion<'$action', string>
            render: (item: TItem, itemIndex: number) => React.ReactNode
            filters?: XTableFilterItem[]
          }
        >
      >
    }
  >
  extraPropsDependencies?: React.DependencyList
}

export interface XTableRef<TItem extends XTableItem> {
  toggleLoading(loading?: boolean): void
  refresh(): Promise<void>
  reset(): Promise<void>
}

export interface UseXTableResult<TItem extends XTableItem>
  extends XTableRef<TItem> {
  ref: React.Ref<XTableRef<TItem> | undefined>
}
