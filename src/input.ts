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
