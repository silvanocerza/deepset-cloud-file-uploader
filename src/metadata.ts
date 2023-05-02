import YAML from 'yaml'

export type Metadata = Record<string, string | number | object>

export function parseMetadata(meta: string): Metadata {
  return YAML.parse(meta) || {}
}
