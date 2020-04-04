import { XSelectGroup, XSelectItem } from './types'

export function isSelectGroup<T extends XSelectItem<any> | XSelectGroup<any>>(
  itemOrGroup: T,
  // @ts-ignore
): itemOrGroup is XSelectGroup<any> {
  return Array.isArray((itemOrGroup as any).children)
}
