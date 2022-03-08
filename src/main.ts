import * as core from '@actions/core'
import {post} from './net'

async function run(): Promise<void> {
  try {
    const apiKey = core.getInput('api-key')
    if (!apiKey) {
      throw new Error('api-key is required')
    }

    const workspacePath = core.getInput('workspace-path')

    if (!workspacePath) {
      throw new Error('workspace-path is required')
    }

    const productId = core.getInput('product-id')
    if (!productId) {
      throw new Error('product-id is required')
    }

    const environmentName = core.getInput('environment-name') || ''
    const environmentType = core.getInput('environment-type') || 'Unspecified'
    const availableEnvironmentTypes = [
      'Development',
      'Testing',
      'QA',
      'Training',
      'Pre',
      'Production',
      'Unspecified',
      '*'
    ].map(x => x.toLowerCase())
    if (
      environmentType.length > 0 &&
      !availableEnvironmentTypes.includes(environmentType.toLowerCase())
    ) {
      throw new Error(
        `environment-type must be empty or one of ${availableEnvironmentTypes.join(
          ', '
        )}`
      )
    }

    if (
      (!environmentName && environmentType) ||
      ['*', 'unspecified'].includes(environmentType)
    ) {
      // this is a special case:
      // deploy against all the environments of the product is not supported
      // by this action, however, it is implemented at API level.
      // We avoid this case to prevent the user from accidentally
      // generate a massive amount of releases from the CI.
      throw new Error(
        'environment-name is required if environment-type is "*" or "unspecified"'
      )
    }

    const version = core.getInput('version')
    if (!version) {
      throw new Error('version is required')
    }

    const projectScope = core.getInput('project-scope')
    if (!projectScope) {
      throw new Error('product-template-id or product-name is required')
    }

    const relisoUrl = core.getInput('relisio-url')
    if (!relisoUrl) {
      throw new Error('relisio-url is required')
    }

    const triggerNotifications =
      core.getInput('trigger-notifications') !== undefined

    const url = `${relisoUrl}/api/v1/workspaces/${workspacePath}/project-factory`

    const {projectIds = []} = await post(
      url,
      apiKey,
      JSON.stringify({
        triggerNotifications,
        projectScope,
        version,
        environmentType,
        environmentName,
        productId
      })
    )

    const publicUrls = projectIds.map(x => `${relisoUrl}/${workspacePath}/${x}`)

    core.setOutput('project-ids', projectIds.join('\n'))
    core.setOutput('public-urls', publicUrls.join('\n'))
    core.setOutput('created-projects', projectIds.length)
  } catch (error) {
    core.debug(`Deployment Failed with Error: ${error}`)
    core.setFailed(`Deployment Failed with Error: ${error}`)
  }
}

run()
