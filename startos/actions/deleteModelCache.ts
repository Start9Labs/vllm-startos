import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const modelsDir = sdk.volumes.main.subpath('models')

type CachedModel = {
  /** HuggingFace cache directory name, e.g. `models--meta-llama--Llama-3.1-8B-Instruct`. */
  dir: string
  /** The repo id that directory name encodes, e.g. `meta-llama/Llama-3.1-8B-Instruct`. */
  repoId: string
  /** Bytes on disk. */
  size: number
}

function repoIdOf(dir: string): string {
  const repo = dir.slice('models--'.length)
  const separator = repo.indexOf('--')
  return separator === -1
    ? repo
    : `${repo.slice(0, separator)}/${repo.slice(separator + 2)}`
}

function formatSize(bytes: number): string {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`
}

// Only regular files are counted. The snapshot tree is symlinks into `blobs`,
// so following them would count every weight twice.
async function directorySize(dir: string): Promise<number> {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  const sizes = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return directorySize(entryPath)
      if (!entry.isFile()) return 0
      return fs
        .lstat(entryPath)
        .then((stat) => stat.size)
        .catch(() => 0)
    }),
  )
  return sizes.reduce((total, size) => total + size, 0)
}

async function listCachedModels(): Promise<CachedModel[]> {
  const entries = await fs
    .readdir(modelsDir, { withFileTypes: true })
    .catch(() => [])
  return Promise.all(
    entries
      .filter(
        (entry) => entry.isDirectory() && entry.name.startsWith('models--'),
      )
      .map(async (entry) => ({
        dir: entry.name,
        repoId: repoIdOf(entry.name),
        size: await directorySize(path.join(modelsDir, entry.name)),
      })),
  )
}

const inputSpec = InputSpec.of({
  model: Value.dynamicSelect(async () => {
    const cached = await listCachedModels()
    return {
      name: i18n('Model'),
      description: i18n('The downloaded model to remove from the cache.'),
      values: Object.fromEntries(
        cached.map((model) => [
          model.dir,
          `${model.repoId} (${formatSize(model.size)})`,
        ]),
      ),
      default: cached[0]?.dir ?? '',
      disabled: cached.length ? false : i18n('No models are cached.'),
    }
  }),
})

export const deleteModelCache = sdk.Action.withInput(
  // id
  'delete-model-cache',

  // metadata
  async ({ effects }) => ({
    name: i18n('Delete Model Cache'),
    description: i18n(
      'Remove a downloaded model from the cache to free up disk space',
    ),
    warning: i18n(
      'This will permanently delete the cached model files. The model will need to be re-downloaded if selected again.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {},

  // the execution function
  async ({ effects, input }) => {
    // With an empty cache the select carries no values, and the SDK's
    // validator degrades to a bare string there — so check the selection
    // against the cache rather than trusting it as a path component.
    const cached = await listCachedModels()
    const model = cached.find((m) => m.dir === input.model)
    if (!model) {
      throw new Error(`${input.model} is not in the model cache`)
    }

    await fs.rm(path.join(modelsDir, model.dir), {
      recursive: true,
      force: true,
    })

    return {
      version: '1' as const,
      title: i18n('Cache Deleted'),
      message: i18n('Model cache for "${model}" has been deleted.', {
        model: model.repoId,
      }),
      result: null,
    }
  },
)
