import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  model: Value.text({
    name: i18n('Model'),
    description: i18n(
      'HuggingFace model ID (e.g. meta-llama/Llama-3.1-8B-Instruct)',
    ),
    required: true,
    default: null,
  }),
})

export const setModel = sdk.Action.withInput(
  // id
  'set-model',

  // metadata
  async ({ effects }) => ({
    name: i18n('Set Model'),
    description: i18n(
      'Choose which HuggingFace model to serve. The model will be downloaded on first startup if not already cached.',
    ),
    warning: i18n(
      'Changing the model will restart the service and may require downloading a new model.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const model = await storeJson.read((s) => s.selectedModel).once()
    if (model) {
      return { model }
    }
    return {}
  },

  // the execution function
  async ({ effects, input }) => {
    await storeJson.merge(effects, { selectedModel: input.model })
  },
)
