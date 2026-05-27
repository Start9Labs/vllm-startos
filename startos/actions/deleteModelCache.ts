import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  model: Value.text({
    name: i18n('Model'),
    description: i18n(
      'HuggingFace model ID to delete from cache (e.g. meta-llama/Llama-3.1-8B-Instruct)',
    ),
    required: true,
    default: null,
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
    // HuggingFace caches models in directories like models--org--name
    const cacheDir = input.model.replace('/', '--')

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'vllm' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/data',
        readonly: false,
      }),
      'delete-cache',
      async (subc) => {
        await subc.exec(['rm', '-rf', `/data/models/models--${cacheDir}`], {
          user: 'root',
        })
      },
    )

    return {
      version: '1' as const,
      title: i18n('Cache Deleted'),
      message: i18n('Model cache for "${model}" has been deleted.', {
        model: input.model,
      }),
      result: null,
    }
  },
)
