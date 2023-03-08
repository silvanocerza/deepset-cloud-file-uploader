import * as core from '@actions/core'
import api from 'api'

const dC = api('@deepsetcloud/v1.0')

export async function upload(
  apiKey: string,
  workspace: string,
  file: string,
  metadata: {[key: string]: string},
  writeMode: string
): Promise<void> {
  dC.auth(apiKey)
  const data =
    await dC.upload_file_api_v1_workspaces__workspace_name__files_post(
      {
        file,
        meta: JSON.stringify(metadata)
      },
      {
        write_mode: writeMode,
        workspace_name: workspace
      }
    )
  core.info(data)
}
