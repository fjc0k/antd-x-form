export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value != null &&
    typeof value === 'object' &&
    // @ts-ignore
    typeof value.then === 'function'
  )
}
