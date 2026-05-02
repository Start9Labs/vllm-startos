import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_16_0_0 = VersionInfo.of({
  version: '0.16.0:0',
  releaseNotes: {
    en_US: 'Initial release of vLLM for StartOS',
    es_ES: 'Lanzamiento inicial de vLLM para StartOS',
    de_DE: 'Erstveröffentlichung von vLLM für StartOS',
    pl_PL: 'Pierwsze wydanie vLLM dla StartOS',
    fr_FR: 'Version initiale de vLLM pour StartOS',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
    other: {
      '#nvidia:0.20.0:0': {
        up: async ({ effects }) => {},
        down: async ({ effects }) => {},
      },
    },
  },
})
