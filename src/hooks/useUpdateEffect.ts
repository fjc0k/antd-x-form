import React, { useEffect, useRef } from 'react'

export function useUpdateEffect(
  effect: () => void,
  deps: React.DependencyList = [],
) {
  const isFirstRef = useRef(true)
  const isFirst = isFirstRef.current
  isFirstRef.current = false
  useEffect(() => {
    if (!isFirst) {
      return effect()
    }
  }, deps)
}
