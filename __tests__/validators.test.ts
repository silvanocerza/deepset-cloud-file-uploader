import {
  parseAndValidateMetadata,
  validateFile,
  validateWriteMode
} from '../src/validators'
import os from 'os'
import path from 'path'
import fs from 'fs'
import {describe, expect, test} from '@jest/globals'

describe('Metadata validator', () => {
  test('empty metadata parsing', () => {
    const input = ''
    const metadata = parseAndValidateMetadata(input)

    const keys = Object.keys(metadata)
    expect(keys.length === 0)
  })

  test('metadata is parsed correctly', async () => {
    const input = `
date: 2022-03-08
amount: 1
valid: true
source: 'github.com'`
    const metadata = parseAndValidateMetadata(input)
    expect(metadata['date'] === '2022-03-08')
    expect(metadata['amount'] === '1')
    expect(metadata['source'] === 'github.com')
  })

  test('Error is thrown if metadata field is not a scalar value', async () => {
    const input = `
date: 2022-03-08
amount: 1
valid: true
list:
  - 1
  - 2
  - 3
source: 'github.com'`

    expect(() => parseAndValidateMetadata(input)).toThrow(
      'list metadata field is not a valid type, all values must be either string, number or boolean.'
    )
  })
})

describe('File validator', () => {
  beforeEach(() => {
    const testFilesPath = path.join(os.tmpdir(), 'file-validator')
    fs.rmSync(testFilesPath, {recursive: true, force: true})
    fs.mkdirSync(testFilesPath)
  })

  test('Error is thrown if file does not exist', async () => {
    const file = path.join(os.tmpdir(), 'file-validator', 'file-to-upload.txt')
    expect(() => validateFile(file)).toThrow(`"${file}" doesn't exist`)
  })

  test('No error is thrown if file exists', async () => {
    const file = path.join(os.tmpdir(), 'file-validator', 'file-to-upload.txt')
    fs.writeFileSync(file, 'test-data')
    validateFile(file)
  })
})

describe('Write mode validator', () => {
  test('No error is thrown if write mode is correct', async () => {
    validateWriteMode('KEEP')
    validateWriteMode('OVERWRITE')
    validateWriteMode('FAIL')
  })

  test('Error is thrown for unexisting write mode', async () => {
    const expectedError =
      'Unknown write-mode "WRONG", possible value are KEEP OVERWRITE FAIL'
    expect(() => validateWriteMode('WRONG')).toThrow(expectedError)
  })
})
