import {deleteFile, listFiles, uploadFile} from '../src/upload'
import {describe, expect, test} from '@jest/globals'
import os from 'os'
import path from 'path'
import fs from 'fs'

const run_if = (condition: boolean) => {
  return {test: condition ? test : xtest}
}

const dCApiKey = process.env.DEEPSET_CLOUD_API_KEY
const dCWorkspace = process.env.DEEPSET_CLOUD_WORKSPACE

const dc_env_vars_are_set = (): boolean => {
  return dCApiKey !== undefined && dCWorkspace !== undefined
}

describe('Upload', () => {
  const testFilesPath = path.join(os.tmpdir(), 'test-files')

  beforeEach(() => {
    fs.rmSync(testFilesPath, {recursive: true, force: true})
    fs.mkdirSync(testFilesPath)
  })

  afterEach(async () => {
    const fileIDs = await listFiles(dCApiKey!, dCWorkspace!)

    for (const id of fileIDs) {
      await deleteFile(dCApiKey!, dCWorkspace!, id)
    }
  })

  run_if(dc_env_vars_are_set()).test(
    'Upload file without metadata',
    async () => {
      const testFile = path.join(testFilesPath, 'test1.txt')
      fs.writeFileSync(testFile, 'Some text')
      const fileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'KEEP'
      )
      expect(fileID)
    }
  )

  run_if(dc_env_vars_are_set()).test('Upload file with metadata', async () => {
    const testFile = path.join(testFilesPath, 'test2.txt')
    fs.writeFileSync(testFile, 'Some text')
    const fileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      testFile,
      {origin: 'testing'},
      'KEEP'
    )
    expect(fileID)
  })

  run_if(dc_env_vars_are_set()).test('Upload empty file', async () => {
    const testFile = path.join(testFilesPath, 'empty-file.txt')
    fs.writeFileSync(testFile, '')

    expect(async () => {
      await uploadFile(dCApiKey!, dCWorkspace!, testFile, {}, 'KEEP')
    }).rejects.toThrow()
  })

  run_if(dc_env_vars_are_set()).test(
    'Upload file with identical name and KEEP write mode',
    async () => {
      const testFile = path.join(testFilesPath, 'test-identical-keep.txt')
      fs.writeFileSync(testFile, 'Some text')
      const firstFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'KEEP'
      )
      expect(firstFileID)

      const secondFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'KEEP'
      )
      expect(firstFileID !== secondFileID)
    }
  )

  run_if(dc_env_vars_are_set()).test(
    'Upload file with identical name and OVERWRITE write mode',
    async () => {
      const testFile = path.join(testFilesPath, 'test-identical-overwrite.txt')
      fs.writeFileSync(testFile, 'Some text')
      const firstFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'OVERWRITE'
      )
      expect(firstFileID)

      const secondFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'OVERWRITE'
      )
      expect(firstFileID === secondFileID)
    }
  )

  run_if(dc_env_vars_are_set()).test(
    'Upload file with identical name and FAIL write mode',
    async () => {
      const testFile = path.join(testFilesPath, 'test-identical-fail.txt')
      fs.writeFileSync(testFile, 'Some text')
      const firstFileID = await uploadFile(
        dCApiKey!,
        dCWorkspace!,
        testFile,
        {},
        'FAIL'
      )
      expect(firstFileID)

      expect(async () => {
        await uploadFile(dCApiKey!, dCWorkspace!, testFile, {}, 'FAIL')
      }).rejects.toThrow()
    }
  )
})

describe('List', () => {
  run_if(dc_env_vars_are_set()).test('Uploaded files are listed', async () => {
    const firstTestFile = path.join(
      os.tmpdir(),
      'test-files',
      'first-listed.txt'
    )
    fs.writeFileSync(firstTestFile, 'Some text')
    const firstFileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      firstTestFile,
      {},
      'KEEP'
    )
    const secondTestFile = path.join(
      os.tmpdir(),
      'test-files',
      'second-listed.txt'
    )
    fs.writeFileSync(secondTestFile, 'Some text')
    const secondFileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      secondTestFile,
      {},
      'KEEP'
    )

    const listedFiles = await listFiles(dCApiKey!, dCWorkspace!)
    expect(listedFiles.includes(firstFileID))
    expect(listedFiles.includes(firstFileID))
  })
})

describe('Delete', () => {
  run_if(dc_env_vars_are_set()).test('Delete existing file', async () => {
    const testFile = path.join(os.tmpdir(), 'test-files', 'todelete.txt')
    fs.writeFileSync(testFile, 'Some text')
    const fileID = await uploadFile(
      dCApiKey!,
      dCWorkspace!,
      testFile,
      {},
      'KEEP'
    )
    expect(fileID)
    await deleteFile(dCApiKey!, dCWorkspace!, fileID)
  })

  run_if(dc_env_vars_are_set()).test('Delete non-existing file', async () => {
    expect(async () => {
      await deleteFile(dCApiKey!, dCWorkspace!, 'random-id')
    }).rejects.toThrow()
  })
})
