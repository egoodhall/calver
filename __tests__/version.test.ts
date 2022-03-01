import {test, expect} from '@jest/globals'
import {latestReleaseMonth} from '../src/version'

test('latest release month is correct', () => {
  expect(latestReleaseMonth(3, [1, 4, 7, 10])).toEqual([1, false])
  expect(latestReleaseMonth(4, [1, 4, 7, 10])).toEqual([4, false])
  expect(latestReleaseMonth(8, [1, 4, 7, 10])).toEqual([7, false])
  expect(latestReleaseMonth(1, [4, 10])).toEqual([10, true])
  expect(latestReleaseMonth(3, [])).toEqual([3, false])
})
