import * as core from '@actions/core'
import * as gh from '@actions/github'
import {CalendarVersion, nextVersion} from './version'
import {parseLatestVersion, parseMonths} from './input'
import {GitHub} from '@actions/github/lib/utils'

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
  return core.getBooleanInput('create_tag')
}

function getTagPrefix(): string {
  return core.getInput('tag_prefix')
}

function getRefPrefix(): string {
  return `tags/${getTagPrefix()}`
}

function getReleaseMonths(): string[] {
  return core.getMultilineInput('release_months')
}

async function getLatestVersion(): Promise<CalendarVersion | null> {
  return parseLatestVersion(getTagPrefix(), await getTags())
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
  const nv = nextVersion(v, parseMonths(getReleaseMonths()))

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

  core.setOutput('old_tag', oldTag)
  core.setOutput('old_version', oldVer)
  core.setOutput('new_tag', newTag)
  core.setOutput('new_version', newVer)
}

run()
