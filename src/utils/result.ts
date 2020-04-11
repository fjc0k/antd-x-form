import { AsyncOrSync } from '../types'
import { isPromiseLike } from './isPromiseLike'

export function result<T>(value: AsyncOrSync<T>): PromiseLike<T> {
  return isPromiseLike(value) ? value : Promise.resolve(value)
}
