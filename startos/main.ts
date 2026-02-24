import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { apiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting vLLM!'))

  const store = await storeJson.read((s) => s).const(effects)
  const selectedModel = store?.selectedModel
  const apiKey = store?.apiKey

  const vllmSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'vllm' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: '/data',
      readonly: false,
    }),
    'vllm-sub',
  )

  if (!selectedModel) {
    return sdk.Daemons.of(effects).addDaemon('primary', {
      subcontainer: vllmSub,
      exec: { command: ['sleep', 'infinity'] },
      ready: {
        display: i18n('vLLM API'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, apiPort, {
            successMessage: i18n('The vLLM API is ready'),
            errorMessage: i18n(
              'No model selected. Run the "Set Model" action.',
            ),
          }),
      },
      requires: [],
    })
  }

  const command: [string, ...string[]] = [
    'vllm',
    'serve',
    selectedModel,
    '--host',
    '0.0.0.0',
    '--port',
    String(apiPort),
    '--download-dir',
    '/data/models',
  ]

  if (apiKey) {
    command.push('--api-key', apiKey)
  }

  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: vllmSub,
    exec: {
      command,
      env: {
        HF_HUB_CACHE: '/data/models',
      },
    },
    ready: {
      display: i18n('vLLM API'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: i18n('The vLLM API is ready'),
          errorMessage: i18n('The vLLM API is not ready'),
        }),
    },
    requires: [],
  })
})
