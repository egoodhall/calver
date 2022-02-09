import moment from 'moment'

const pat = /([0-9]+)\.([0-9]+)\.([0-9]+)/

export interface CalendarVersion {
  year: number
  month: number
  build: number
  toString(): string
  isSameRelease(v: CalendarVersion): boolean
  incrementBuild(): CalendarVersion
}

class Version implements CalendarVersion {
  year: number
  month: number
  build: number

  constructor(year: number, month: number, build?: number) {
    this.year = year
    this.month = month
    this.build = build || 0
  }

  toString(): string {
    return `${this.year}.${this.month}.${this.build}`
  }

  isSameRelease(v: CalendarVersion): boolean {
    return this.month === v.month && this.year === v.year
  }

  incrementBuild(): CalendarVersion {
    return new Version(this.year, this.month, this.build + 1)
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

export function nextVersion(
  v: CalendarVersion | null,
  releaseMonths: number[]
): Version | null {
  const lr = latestRelease(releaseMonths)
  if (v === null || v.isSameRelease(lr)) {
    return lr
  } else {
    return v.incrementBuild()
  }
}

export function latestRelease(releaseMonths: number[]): CalendarVersion {
  const thisMonth = parseInt(moment().format('M'), 10)
  const [month, prevYear] = latestReleaseMonth(thisMonth, releaseMonths)
  const year = parseInt(moment().format('YY'), 10) - (prevYear ? 1 : 0)
  return new Version(year, month)
}

export function latestReleaseMonth(
  thisMonth: number,
  releaseMonths: number[]
): [number, boolean] {
  const month = releaseMonths
    .filter(m => m <= thisMonth)
    .reduce((m, v) => (m > v ? m : v), 0)
  return [month || releaseMonths[releaseMonths.length - 1], month === 0]
}
