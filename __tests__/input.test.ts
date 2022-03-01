import {test, expect} from '@jest/globals'
import {parseLatestVersion, parseMonths} from '../src/input'
import { Version } from '../src/version'

test('parses expected months', () => {
  expect(parseMonths(['November', 'July'])).toEqual([7, 11])
  expect(parseMonths(['November, October', 'July'])).toEqual([7, 10, 11])
  expect(parseMonths(['November,,June\n', ' July'])).toEqual([6, 7, 11])
})

test('parses expected version', () => {
  expect(parseLatestVersion('v', ['v22.1.0', 'v22.1.1', 'test/v22.1.2'])).toEqual(new Version(22, 1, 1))
  expect(parseLatestVersion('test/v', ['test/v22.1.0', 'test/v22.1.1'])).toEqual(new Version(22, 1, 1))
})
