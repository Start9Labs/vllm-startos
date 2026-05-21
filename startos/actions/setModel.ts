import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { detectHardware } from '../hardware'
import { models } from './presets'

const { InputSpec, Value, Variants } = sdk

const customVariant = {
  name: i18n('Custom'),
  spec: InputSpec.of({
    args: Value.text({
      name: i18n('vLLM serve arguments'),
      description: i18n(
        "The full argument string passed after `vllm serve`. Starts with the model id, then any flags. Split on whitespace, so quoted JSON values won't survive — use a preset for those.",
      ),
      required: true,
      default: null,
    }),
  }),
}

const allVariants = {
  'qwen36-35b-a3b': {
    name: i18n('Qwen3.6 35B-A3B'),
    spec: InputSpec.of({}),
  },
  'qwen36-27b': {
    name: i18n('Qwen3.6 27B'),
    spec: InputSpec.of({}),
  },
  'qwen3-next-80b-a3b': {
    name: i18n('Qwen3-Next 80B-A3B'),
    spec: InputSpec.of({}),
  },
  'qwen3-30b-a3b': {
    name: i18n('Qwen3 30B-A3B'),
    spec: InputSpec.of({}),
  },
  'llama-33-70b': {
    name: i18n('Llama 3.3 70B Instruct'),
    spec: InputSpec.of({}),
  },
  'mistral-small-32-24b': {
    name: i18n('Mistral Small 3.2 24B Instruct'),
    spec: InputSpec.of({}),
  },
  'nemotron3-elastic-30b-a3b': {
    name: i18n('Nemotron 3 Elastic 30B-A3B'),
    spec: InputSpec.of({}),
  },
  'gemma4-31b': {
    name: i18n('Gemma 4 31B Instruct'),
    spec: InputSpec.of({}),
  },
  'gemma4-26b-a4b': {
    name: i18n('Gemma 4 26B-A4B Instruct'),
    spec: InputSpec.of({}),
  },
  custom: customVariant,
}

const inputSpec = InputSpec.of({
  config: Value.dynamicUnion(async ({ effects }) => {
    const { tier, memoryGB } = await detectHardware(effects)
    const enabledIds = new Set([
      ...models
        .filter((m) => {
          const cfg = m.configs[tier]
          return cfg && memoryGB >= cfg.minMemoryGB
        })
        .map((m) => m.id),
      'custom',
    ])
    const disabledIds = Object.keys(allVariants).filter(
      (id) => !enabledIds.has(id),
    )
    const defaultId =
      models.find((m) => {
        const cfg = m.configs[tier]
        return cfg && memoryGB >= cfg.minMemoryGB
      })?.id ?? 'custom'
    return {
      name: i18n('Configuration'),
      variants: Variants.of(allVariants),
      default: defaultId as keyof typeof allVariants,
      disabled: disabledIds.length > 0 ? disabledIds : false,
    }
  }),
})

export const setModel = sdk.Action.withInput(
  // id
  'set-model',

  // metadata
  async ({ effects }) => ({
    name: i18n('Set Model'),
    description: i18n(
      'Pick a curated preset (per Unsloth recommendations) or provide custom `vllm serve` arguments. The model will be downloaded on first startup if not already cached.',
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
    const saved = await storeJson.read((s) => s.modelSelection).const(effects)
    if (!saved || !(saved.selection in allVariants)) return {}
    if (saved.selection === 'custom') {
      return {
        config: {
          selection: 'custom' as const,
          value: { args: saved.customArgs ?? '' },
        },
      }
    }
    // The SDK's prefill type is a discriminated union by `selection`; the
    // cast picks one representative variant to satisfy TS, while at runtime
    // `selection` is just looked up in `allVariants` by key.
    return {
      config: {
        selection: saved.selection as 'qwen36-35b-a3b',
        value: {},
      },
    }
  },

  // the execution function
  async ({ effects, input }) => {
    const config = input.config
    let serveArgs: string[]
    let modelSelection: { selection: string; customArgs?: string }
    if (config.selection === 'custom') {
      serveArgs = config.value.args.split(/\s+/).filter(Boolean)
      modelSelection = { selection: 'custom', customArgs: config.value.args }
    } else {
      const { tier, memoryGB } = await detectHardware(effects)
      const model = models.find((m) => m.id === config.selection)
      const cfg = model?.configs[tier]
      if (!cfg) {
        throw new Error(
          `No configuration for ${config.selection} on ${tier} hardware`,
        )
      }
      const step = [...cfg.contextByMemory]
        .reverse()
        .find((s) => memoryGB >= s.gb)
      serveArgs = step
        ? [...cfg.args, '--max-model-len', String(step.ctx)]
        : cfg.args
      modelSelection = { selection: config.selection }
    }
    await storeJson.merge(effects, { serveArgs, modelSelection })
  },
)
