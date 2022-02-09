import * as core from '@actions/core'
import * as gh from '@actions/github'
import {nextVersion, parseVersion} from './version'
import {GitHub} from '@actions/github/lib/utils'
import moment from 'moment'

const commas = /,\s+/

// function getTag(): boolean {
//   return core.getBooleanInput('tag')
// }

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

function getOctokit(): InstanceType<typeof GitHub> {
  const token = core.getInput('token')
  return gh.getOctokit(token)
}

async function getTags(): Promise<string[]> {
  const response = await getOctokit().rest.git.listMatchingRefs({
    ...gh.context.repo,
    ref: getRefPrefix(),
  })

  return response.data.map(({ref}) => ref.replace('refs/tags/', ''))
}

async function run(): Promise<void> {
  const tags = await getTags()
  moment()

  const versions = tags
    .filter(t => t.startsWith(getTagPrefix()))
    .map(t => t.replace(getTagPrefix(), ''))
    .map(parseVersion)
    .filter(v => !!v)

  const v = versions.length > 0 ? versions[0] : null
  core.info(`Old version: ${v?.toString()}`)

  const nv = nextVersion(v, getReleaseMonths())
  core.info(`New version: ${nv?.toString()}`)

  core.setOutput('old_tag', '')
  core.setOutput('old_version', '')
  core.setOutput('new_tag', `${getTagPrefix()}${nv}`)
  core.setOutput('new_version', `${nv}`)
}

run()
