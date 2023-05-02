import {validateFile, validateWriteMode} from '../src/validators'
import os from 'os'
import path from 'path'
import fs from 'fs'
import {describe, expect, test} from '@jest/globals'

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
