import YAML from 'yaml'
import fs from 'fs'

export function parseAndValidateMetadata(meta: string): Record<string, string> {
  const metadata: Record<string, string> = YAML.parse(meta) || {}
  for (const key in metadata) {
    if (typeof metadata[key] !== 'string') {
      throw new Error(
        `${key} metadata field is not a string, all values must be strings.`
      )
    }
  }
  return metadata
}

export function validateFile(file: string): void {
  if (!fs.existsSync(file)) {
    throw new Error(`"${file}" doesn't exist`)
  }
}

export function validateWriteMode(writeMode: string): void {
  const modes = ['KEEP', 'OVERWRITE', 'FAIL']
  if (!modes.includes(writeMode)) {
    throw new Error(
      `Unknown write-mode "${writeMode}", possible value are ${modes.join(' ')}`
    )
  }
}
