import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.33.0:1',
  releaseNotes: {
    en_US:
      'Services that connect to vLLM can now read which model it serves, so they no longer ask you for its name.',
    es_ES:
      'Los servicios que se conectan a vLLM ahora pueden leer qué modelo sirve, así que ya no te piden su nombre.',
    de_DE:
      'Dienste, die sich mit vLLM verbinden, können jetzt lesen, welches Modell es bereitstellt, und fragen dich daher nicht mehr nach dessen Namen.',
    pl_PL:
      'Usługi łączące się z vLLM mogą teraz odczytać, jaki model on udostępnia, więc nie pytają już o jego nazwę.',
    fr_FR:
      "Les services qui se connectent à vLLM peuvent désormais lire le modèle qu'il sert, et ne vous demandent donc plus son nom.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
