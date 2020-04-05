export class EventBus<T extends Record<string, (...args: any[]) => any>> {
  #listeners: { [K in keyof T]?: T[K][] } = Object.create(null)

  emit<K extends keyof T>(type: K, ...args: Parameters<T[K]>): void {
    for (const callback of this.#listeners[type]! || []) {
      callback(...args)
    }
  }

  on<K extends keyof T>(type: K, callback: T[K]): () => void {
    if (!this.#listeners[type]) {
      this.#listeners[type] = []
    }
    this.#listeners[type]!.push(callback)
    return () => {
      for (const index in this.#listeners[type]!) {
        if (this.#listeners[type]![Number(index)] === callback) {
          this.#listeners[type]!.splice(Number(index), 1)
          break
        }
      }
    }
  }

  once<K extends keyof T>(type: K, callback: T[K]): () => void {
    let off: () => void
    off = this.on(type, ((...args: any[]) => {
      off()
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      off = () => {}
      callback(...args)
    }) as any)
    return () => off()
  }
}
