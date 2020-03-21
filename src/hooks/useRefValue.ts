import { useRef } from 'react'

export function useRefValue<T>(value: T) {
  const ref = useRef<T>(value)
  ref.current = value
  return ref
}
