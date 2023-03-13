# deepset Cloud file uploader

[![Test](https://github.com/silvanocerza/deepset-cloud-file-uploader/actions/workflows/test.yml/badge.svg)](https://github.com/silvanocerza/deepset-cloud-file-uploader/actions/workflows/test.yml)
[![CodeQL](https://github.com/silvanocerza/deepset-cloud-file-uploader/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/silvanocerza/deepset-cloud-file-uploader/actions/workflows/codeql-analysis.yml)

Use this GH Action to upload files and metadata to [deepset Cloud](cloud.deepset.ai).

## Usage

A minimal usage of this action could look like the example below. `api-key`, `workspace-name` and `file` are always required, if they're not the action will fail.
In this case we're uploading the `my-file.md` file to the workspace specified by the `DEEPSET_CLOUD_WORKSPACE` secret.

```
- name: Upload file to deepset Cloud
  uses: silvanocerza/deepset-cloud-file-uploader@v1
  with:
    api-key: ${{ secrets.DEEPSET_CLOUD_API_KEY }}
    workspace-name: ${{ secrets.DEEPSET_CLOUD_WORKSPACE }}
    file: my-file.md
```

We might also want to specify some file metadata on upload, the field must be a string containing a valid YAML `string: string` map.

```
- name: Upload file to deepset Cloud
  uses: silvanocerza/deepset-cloud-file-uploader@v1
  with:
    api-key: ${{ secrets.DEEPSET_CLOUD_API_KEY }}
    workspace-name: ${{ secrets.DEEPSET_CLOUD_WORKSPACE }}
    file: my-file.md
    metadata: |
      date: '2022-03-08'
      type: 'markdown'
```

By default upload will fail if a file with the same name exists in the specified workspace. We can change that behaviour by setting the `write-mode` argument to either `OVERWRITE` to overwrite the already existing file, or `KEEP` to keep both files.

```
- name: Upload file to deepset Cloud
  uses: silvanocerza/deepset-cloud-file-uploader@v1
  with:
    api-key: ${{ secrets.DEEPSET_CLOUD_API_KEY }}
    workspace-name: ${{ secrets.DEEPSET_CLOUD_WORKSPACE }}
    file: my-file.md
    write-mode: OVERWRITE
```

## Development

Install dependencies

```bash
$ npm install
```

Lint, test and build the typescript and package it for distribution

```bash
$ npm run all
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

If `DEEPSET_CLOUD_API_KEY` and `DEEPSET_CLOUD_WORKSPACE` env vars are set integrations tests will also be run.

⚠️⚠️⚠️
Integration test are destructive and delete all uploaded files after each tests. Run them only in a test workspace in which you can afford to lose files!
⚠️⚠️⚠️
