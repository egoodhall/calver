import {CalendarVersion, Version, parseVersion} from './version'
import moment from 'moment'

const commas = /\s*,\s*/

export function parseMonths(lines: string[]): number[] {
  const months = lines
    .flatMap(s => s.trim().split(commas))
    .filter(s => s !== '')
    .map(m => moment().month(m).format('M'))
    .map(m => parseInt(m, 10))
    .filter(m => !isNaN(m))

  return [...new Set(months)].sort((a, b) => a - b)
}

function notNull<T>(v: T | null): v is T {
  return v !== null
}

export function parseLatestVersion(
  prefix: string,
  tags: string[]
): CalendarVersion {
  return tags
    .filter(t => t.startsWith(prefix))
    .map(t => t.replace(prefix, ''))
    .map(parseVersion)
    .filter(notNull)
    .reduce((a, b) => (a.compare(b) > 0 ? a : b), new Version(0, 0))
}
