import {test, expect} from '@jest/globals'
import {parseMonths} from '../src/input'

test('parses expected months', () => {
  expect(parseMonths(['November', 'July'])).toEqual([7, 11])
  expect(parseMonths(['November, October', 'July'])).toEqual([7, 10, 11])
  expect(parseMonths(['November,,June\n', ' July'])).toEqual([6, 7, 11])
})
