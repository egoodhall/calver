export default class Singleton<T> {
  value: T | null = null
  supplier: () => T
  constructor(supplier: () => T) {
    this.supplier = supplier
  }

  get(): T {
    if (this.value === null) {
      this.value = this.supplier()
    }
    return this.value
  }
}
