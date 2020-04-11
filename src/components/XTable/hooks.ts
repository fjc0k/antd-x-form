import { useMemo, useRef } from 'react'
import { UseXTableResult, XTableItem, XTableRef } from './types'

export function useXTable<TItem extends XTableItem>(): UseXTableResult<TItem> {
  const tableRef = useRef<XTableRef<TItem>>()
  return useMemo(
    (): UseXTableResult<TItem> => ({
      ref: tableRef,
      toggleLoading: loading => tableRef.current?.toggleLoading(loading),
      refresh: () =>
        tableRef.current ? tableRef.current.refresh() : Promise.resolve(),
      reset: () =>
        tableRef.current ? tableRef.current.reset() : Promise.resolve(),
    }),
    [],
  )
}
