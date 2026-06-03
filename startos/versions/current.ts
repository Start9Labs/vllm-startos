import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:0',
  releaseNotes: {
    en_US: 'Updates vLLM to v0.22.1-rc.0.',
    es_ES: 'Actualiza vLLM a la v0.22.1-rc.0.',
    de_DE: 'Aktualisiert vLLM auf v0.22.1-rc.0.',
    pl_PL: 'Aktualizuje vLLM do wersji v0.22.1-rc.0.',
    fr_FR: 'Met à jour vLLM vers la v0.22.1-rc.0.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
