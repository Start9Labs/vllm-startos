import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:3',
  releaseNotes: {
    en_US: 'Advances the bundled vLLM nightly build.',
    es_ES: 'Avanza la compilación nightly de vLLM incluida.',
    de_DE: 'Aktualisiert den gebündelten vLLM-Nightly-Build.',
    pl_PL: 'Aktualizuje dołączoną kompilację nightly vLLM.',
    fr_FR: 'Met à jour la version nightly de vLLM incluse.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
