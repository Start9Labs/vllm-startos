import { credentialsJson } from './fileModels/credentials.json'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting vLLM!'))

  const serveArgs = await storeJson.read((s) => s.serveArgs).const(effects)

  const apiKey = await credentialsJson.read((c) => c.apiKey).const(effects)
  if (!apiKey) {
    throw new Error('no apiKey in credentials.json')
  }

  const vllmSub = sdk.SubContainer.of(
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

  const startedAt = Date.now()
  const STARTUP_TIMEOUT_MS = 35 * 60 * 1000

  return base.addDaemon('primary', {
    subcontainer: vllmSub,
    exec: {
      command: [
        'vllm',
        'serve',
        ...serveArgs,
        '--host',
        '0.0.0.0',
        '--port',
        String(apiPort),
        '--download-dir',
        '/data/models',
        '--api-key',
        apiKey,
      ],
      env: {
        HF_HUB_CACHE: '/data/models',
        PYTHONUNBUFFERED: '1',
        HF_HUB_VERBOSITY: 'info',
      },
    },
    ready: {
      display: i18n('vLLM API'),
      fn: async () => {
        const res = await sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: i18n('The vLLM API is ready'),
          errorMessage: i18n('The vLLM API is not ready'),
        })
        if (res.result === 'success') return res

        // Report "loading" during the expected startup window; once it's
        // clearly overrun, surface a real failure pointing at the logs.
        if (Date.now() - startedAt > STARTUP_TIMEOUT_MS) {
          return {
            result: 'failure',
            message: i18n(
              'The vLLM API did not come up within 35 minutes. Check the service logs for errors.',
            ),
          }
        }

        return {
          result: 'loading',
          message: i18n(
            'The vLLM API is starting. A first-time model download plus load can take 30+ minutes; loading an already-cached model can take 15+ minutes. Exact time depends on your hardware resources and network bandwidth.',
          ),
        }
      },
    },
    requires: ['ldconfig'],
  })
})
