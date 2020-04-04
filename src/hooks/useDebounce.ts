import { debounce } from '../utils'
import { useMemo } from 'react'
import { useRefValue } from './useRefValue'

export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  const fnRef = useRefValue(fn)
  const debouncedFn = useMemo(() => {
    return debounce(fnRef.current, delay)
  }, [])
  return debouncedFn
}
