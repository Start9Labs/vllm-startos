import { i18n } from './i18n'
import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'
import { apiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting vLLM!'))

  const store = await storeJson.read((s) => s).const(effects)
  const serveArgs = store?.serveArgs
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

  // Refresh the linker cache so Triton can find the host-injected libcuda.so.1.
  // The nvidia-container-toolkit mounts driver libs into the container, but on
  // some aarch64 images they are not in the cached search paths.
  const base = sdk.Daemons.of(effects).addOneshot('ldconfig', {
    subcontainer: vllmSub,
    exec: { command: ['ldconfig'] },
    requires: [],
  })

  if (!serveArgs || serveArgs.length === 0) {
    return base.addDaemon('primary', {
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
      requires: ['ldconfig'],
    })
  }

  const command: [string, ...string[]] = [
    'vllm',
    'serve',
    ...serveArgs,
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

  return base.addDaemon('primary', {
    subcontainer: vllmSub,
    exec: {
      command,
      env: {
        HF_HUB_CACHE: '/data/models',
        PYTHONUNBUFFERED: '1',
        HF_HUB_VERBOSITY: 'info',
      },
    },
    ready: {
      display: i18n('vLLM API'),
      // Model download + load + JIT compile can take 30+ minutes for large
      // weights (e.g. 35B-A3B NVFP4 from a cold cache).
      gracePeriod: 60 * 60 * 1000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: i18n('The vLLM API is ready'),
          errorMessage: i18n('The vLLM API is not ready'),
        }),
    },
    requires: ['ldconfig'],
  })
})
