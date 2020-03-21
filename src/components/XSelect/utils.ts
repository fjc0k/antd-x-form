import { XSelectGroup, XSelectItem } from './types'

// @ts-ignore
export function isSelectGroup<T extends XSelectItem<any> | XSelectGroup<any>>(itemOrGroup: T): itemOrGroup is XSelectGroup<any> {
  return Array.isArray((itemOrGroup as any).children)
}
