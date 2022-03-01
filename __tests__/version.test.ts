import {test, expect} from '@jest/globals'
import {latestReleaseMonth, nextVersion, Version} from '../src/version'

test('latest release month is correct', () => {
  expect(latestReleaseMonth(3, [1, 4, 7, 10])).toEqual([1, false])
  expect(latestReleaseMonth(4, [1, 4, 7, 10])).toEqual([4, false])
  expect(latestReleaseMonth(8, [1, 4, 7, 10])).toEqual([7, false])
  expect(latestReleaseMonth(1, [4, 10])).toEqual([10, true])
  expect(latestReleaseMonth(3, [])).toEqual([3, false])
})

test('picks next version correctly', () => {
  expect(nextVersion(new Version(22, 1, 3), [22,3], [])).toEqual(
    new Version(22, 3, 0)
  )
  expect(nextVersion(new Version(22, 1, 3), [22,3], [2])).toEqual(
    new Version(22, 2, 0)
  )
  expect(nextVersion(new Version(22, 2, 3), [22,3], [2])).toEqual(
    new Version(22, 2, 4)
  )
  expect(nextVersion(new Version(22, 2, 3), [22,3], [2])).toEqual(
    new Version(22, 2, 4)
  )
  expect(nextVersion(new Version(21, 10, 233), [22,3], [4, 10])).toEqual(
    new Version(21, 10, 234)
  )
})
