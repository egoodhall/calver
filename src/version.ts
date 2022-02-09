const pat = /([0-9]+)\.([0-9]+)\.([0-9]+)/

export interface CalendarVersion {
  year: number
  month: number
  build: number
  toString(): string
}

class Version implements CalendarVersion {
  year: number
  month: number
  build: number

  constructor(year: number, month: number, build: number) {
    this.year = year
    this.month = month
    this.build = build
  }

  toString(): string {
    return `${this.year}.${this.month}.${this.build}`
  }
}

export function parseVersion(v: string): Version | null {
  const match = pat.exec(v)
  if (match === null) {
    return null
  }
  const [y, m, b] = match.slice(1, 4).map(n => parseInt(n, 10))
  return new Version(y, m, b)
}
