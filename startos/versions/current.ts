import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.29.0:1',
  releaseNotes: {
    en_US: `vLLM no longer reports anonymous usage statistics to the vLLM project, and its request and output logging stays off: the service log never contains prompts or generated text, and Custom arguments can no longer turn that logging on.`,
    es_ES: `vLLM ya no envía estadísticas de uso anónimas al proyecto vLLM, y su registro de peticiones y salidas permanece desactivado: el registro del servicio nunca contiene prompts ni texto generado, y los argumentos personalizados ya no pueden activar ese registro.`,
    de_DE: `vLLM meldet keine anonymen Nutzungsstatistiken mehr an das vLLM-Projekt, und die Protokollierung von Anfragen und Ausgaben bleibt ausgeschaltet: Das Dienstprotokoll enthält nie Prompts oder generierten Text, und eigene Argumente können diese Protokollierung nicht mehr einschalten.`,
    pl_PL: `vLLM nie wysyła już anonimowych statystyk użycia do projektu vLLM, a logowanie zapytań i odpowiedzi pozostaje wyłączone: log usługi nigdy nie zawiera promptów ani wygenerowanego tekstu, a własne argumenty nie mogą już włączyć tego logowania.`,
    fr_FR: `vLLM ne transmet plus de statistiques d'utilisation anonymes au projet vLLM, et la journalisation des requêtes et des sorties reste désactivée : le journal du service ne contient jamais de prompts ni de texte généré, et les arguments personnalisés ne peuvent plus activer cette journalisation.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
