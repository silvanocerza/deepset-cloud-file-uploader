import * as core from '@actions/core'
import {
  parseAndValidateMetadata,
  validateFile,
  validateWriteMode
} from './validators'
import {uploadFile} from './upload'
import fs from 'fs'

async function run(): Promise<void> {
  try {
    const workspaceName = core.getInput('workspace-name')
    const apiKey = core.getInput('api-key')
    const file = core.getInput('file')
    validateFile(file)

    const meta = core.getInput('meta')
    const metaFile = core.getInput('meta-file')

    let metadata: Record<string, string> = {}
    if (meta && metaFile) {
      core.setFailed("Can't use both `meta` and `meta-file` inputs. Aborting.")
    } else if (meta) {
      metadata = parseAndValidateMetadata(meta)
    } else if (metaFile) {
      const data = fs.readFileSync(metaFile).toString()
      metadata = parseAndValidateMetadata(data)
    }

    const writeMode = core.getInput('write-mode')
    validateWriteMode(writeMode)

    const file_id = await uploadFile(
      apiKey,
      workspaceName,
      file,
      metadata,
      writeMode
    )

    core.info(`Uploaded file ID: ${file_id}`)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
