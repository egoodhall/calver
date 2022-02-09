import * as core from '@actions/core'
import * as gh from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import moment from 'moment'

const version = /[0-9]+\.[0-9]+\.[0-9]+/
const commas = /,\s+/

function getTag(): boolean {
  return core.getBooleanInput('tag')
}

function getTagPrefix(): string {
  return core.getInput('tag_prefix')
}

function getRefPrefix(): string {
  return `tags/${getTagPrefix()}`
}

function getResetMonths(): string[] {
  return core.getMultilineInput('release_months').flatMap(s => s.split(commas))
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
  version
  core.info(`${getTag()}`)
  core.info(getResetMonths().join(', '))
  core.info(tags.join(', '))

  core.setOutput('old_tag', '')
  core.setOutput('old_version', '--')
  core.setOutput('new_tag', '')
  core.setOutput('new_version', '--')
}

run()
