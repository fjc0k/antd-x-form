export function hasOwn<T extends {}>(data: T, key: keyof T): boolean {
  return Object.prototype.hasOwnProperty.call(data, key)
}
