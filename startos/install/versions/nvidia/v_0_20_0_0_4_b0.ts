import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_20_0_0_4_b0 = VersionInfo.of({
  version: '#nvidia:0.20.0:0.4-beta.0',
  releaseNotes: {
    en_US: 'Initial release of vLLM for NVIDIA GPUs using upstream container',
    es_ES:
      'Lanzamiento inicial de vLLM para GPUs NVIDIA usando contenedor upstream',
    de_DE:
      'Erstveröffentlichung von vLLM für NVIDIA-GPUs mit Upstream-Container',
    pl_PL: 'Pierwsze wydanie vLLM dla GPU NVIDIA z kontenerem upstream',
    fr_FR:
      'Version initiale de vLLM pour GPU NVIDIA utilisant le conteneur upstream',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
    other: {
      '0.16.0:0.4-beta.0': {
        up: async ({ effects }) => {},
        down: async ({ effects }) => {},
      },
    },
  },
})
