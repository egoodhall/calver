import * as core from '@actions/core'
import * as gh from '@actions/github'
import {CalendarVersion, Version, nextVersion, parseVersion} from './version'
import {GitHub} from '@actions/github/lib/utils'
import moment from 'moment'

const commas = /,\s+/

function getOctoKit(): InstanceType<typeof GitHub> {
  const token = core.getInput('token')
  if (!token) {
    throw new Error(
      "Missing 'token' input. Make sure to provide a github token."
    )
  }
  return gh.getOctokit(token)
}

function getApplyTag(): boolean {
  return core.getBooleanInput('apply_tag')
}

function getTagPrefix(): string {
  return core.getInput('tag_prefix')
}

function getRefPrefix(): string {
  return `tags/${getTagPrefix()}`
}

function getReleaseMonths(): number[] {
  const months = core
    .getMultilineInput('release_months')
    .flatMap(s => s.split(commas))
    .map(m => parseInt(moment().month(m).format('M'), 10))

  return [...new Set(months)].sort((a, b) => a - b)
}

function notNull<T>(v: T | null): v is T {
  return v !== null
}

async function getLatestVersion(): Promise<CalendarVersion | null> {
  return (await getTags())
    .filter(t => t.startsWith(getTagPrefix()))
    .map(t => t.replace(getTagPrefix(), ''))
    .map(parseVersion)
    .filter(notNull)
    .reduce((a, b) => (a.compare(b) < 0 ? a : b), new Version(0, 0))
}

async function getTags(): Promise<string[]> {
  const response = await getOctoKit().rest.git.listMatchingRefs({
    ...gh.context.repo,
    ref: getRefPrefix(),
  })

  return response.data.map(({ref}) => ref.replace('refs/tags/', ''))
}

async function run(): Promise<void> {
  const v = await getLatestVersion()
  const nv = nextVersion(v, getReleaseMonths())

  const oldTag = v ? `${getTagPrefix()}${v?.toString()}` : ''
  const oldVer = v?.toString() || ''
  const newTag = `${getTagPrefix()}${nv}`
  const newVer = `${nv}`

  core.info(`Tag: ${oldTag} -> ${newTag}`)
  core.info(`Ver: ${oldVer} -> ${newVer}`)

  if (getApplyTag()) {
    core.info(`Tagging commit ${gh.context.sha}`)
    await getOctoKit().rest.git.createRef({
      ...gh.context.repo,
      ref: `refs/tags/${newTag}`,
      sha: gh.context.sha,
    })
  }

  getOctoKit().rest.git.deleteRef({
    ...gh.context.repo,
    ref: 'refs/tags${{ steps.tag.outputs.new_tag }}',
  })

  core.setOutput('old_tag', oldTag)
  core.setOutput('old_version', oldVer)
  core.setOutput('new_tag', newTag)
  core.setOutput('new_version', newVer)
}

run()
