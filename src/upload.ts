import api from 'api'

const dC = api('@deepsetcloud/v1.0#1q41vlf6pmzzv')

export async function uploadFile(
  apiKey: string,
  workspace: string,
  file: string,
  metadata: {[key: string]: string},
  writeMode: string
): Promise<string> {
  dC.auth(apiKey)
  const res =
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
  return res['data']['file_id']
}

export async function listFiles(
  apiKey: string,
  workspace: string
): Promise<string[]> {
  dC.auth(apiKey)
  const res = await dC.list_files_api_v1_workspaces__workspace_name__files_get({
    workspace_name: workspace
  })
  return res['data']['data'].map((d: Record<string, string>) => d['file_id'])
}

export async function deleteFile(
  apiKey: string,
  workspace: string,
  fileID: string
): Promise<void> {
  dC.auth(apiKey)
  await dC.delete_file_api_v1_workspaces__workspace_name__files__file_id__delete(
    {
      workspace_name: workspace,
      file_id: fileID
    }
  )
}
