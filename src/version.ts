const pat = /([0-9]+)\.([0-9]+)\.([0-9]+)/

export interface CalendarVersion {
  year: number
  month: number
  build: number
  toString(): string
  isSameRelease(v: CalendarVersion): boolean
  incrementBuild(): CalendarVersion
  compare(v: CalendarVersion): number
}

export type YearMonth = [number, number]

export class Version implements CalendarVersion {
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

  compare(v: CalendarVersion): number {
    return this.year - v.year || this.month - v.month || this.build - v.build
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
  currentVersion: CalendarVersion | null,
  currentDate: YearMonth,
  releaseMonths: number[]
): Version | null {
  const lr = latestRelease(
    currentDate,
    releaseMonths.length === 0 ? [currentDate[1]] : releaseMonths
  )
  if (currentVersion === null || !currentVersion.isSameRelease(lr)) {
    return lr
  } else {
    return currentVersion.incrementBuild()
  }
}

export function latestRelease(
  currentDate: YearMonth,
  releaseMonths: number[]
): CalendarVersion {
  const [month, prevYear] = latestReleaseMonth(currentDate[1], releaseMonths)
  const year = currentDate[0] - (prevYear ? 1 : 0)
  return new Version(year, month)
}

export function latestReleaseMonth(
  thisMonth: number,
  releaseMonths: number[]
): [number, boolean] {
  if (releaseMonths.length === 0) {
    return [thisMonth, false]
  }
  const sortedRMs = [...new Set(releaseMonths)].sort((a, b) => a - b)
  const month = sortedRMs
    .filter(m => m <= thisMonth)
    .reduce((m, v) => (m > v ? m : v), 0)
  return [month || sortedRMs[sortedRMs.length - 1], month === 0]
}
