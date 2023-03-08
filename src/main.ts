import * as core from '@actions/core'
import {
  parseAndValidateMetadata,
  validateFile,
  validateWriteMode
} from './validators'
import {upload} from './upload'

async function run(): Promise<void> {
  try {
    const workspaceName = core.getInput('workspace-name')
    const apiKey = core.getInput('api-key')
    const file = core.getInput('file')
    validateFile(file)

    const metadata = parseAndValidateMetadata(core.getInput('meta'))
    const writeMode = core.getInput('write-mode')
    validateWriteMode(writeMode)

    await upload(apiKey, workspaceName, file, metadata, writeMode)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
