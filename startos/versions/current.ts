import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { credentialsJson } from '../fileModels/credentials.json'
import { storeJson } from '../fileModels/store.json'

export const current = VersionInfo.of({
  version: '0.33.0:1',
  releaseNotes: {
    en_US:
      'Services that connect to vLLM can now read which model it serves, so they no longer ask you for its name. Custom arguments can no longer set --served-model-name. If yours does, remove it with Set Model before connecting another service, and point existing clients at the model id.',
    es_ES:
      'Los servicios que se conectan a vLLM ahora pueden leer qué modelo sirve, así que ya no te piden su nombre. Los argumentos personalizados ya no pueden establecer --served-model-name. Si los tuyos lo hacen, quítalo con Set Model antes de conectar otro servicio y configura los clientes existentes con el ID del modelo.',
    de_DE:
      'Dienste, die sich mit vLLM verbinden, können jetzt lesen, welches Modell es bereitstellt, und fragen dich daher nicht mehr nach dessen Namen. Benutzerdefinierte Argumente dürfen --served-model-name nicht mehr setzen. Falls deine das tun, entferne es mit Set Model, bevor du einen weiteren Dienst verbindest, und stelle bestehende Clients auf die Modell-ID um.',
    pl_PL:
      'Usługi łączące się z vLLM mogą teraz odczytać, jaki model on udostępnia, więc nie pytają już o jego nazwę. Własne argumenty nie mogą już ustawiać --served-model-name. Jeśli Twoje to robią, usuń go w Set Model przed podłączeniem kolejnej usługi i ustaw w istniejących klientach identyfikator modelu.',
    fr_FR:
      "Les services qui se connectent à vLLM peuvent désormais lire le modèle qu'il sert, et ne vous demandent donc plus son nom. Les arguments personnalisés ne peuvent plus définir --served-model-name. Si les vôtres le font, retirez-le avec Set Model avant de connecter un autre service, et configurez les clients existants avec l'identifiant du modèle.",
  },
  migrations: {
    // The model id leaves the serve arguments for credentials.json.
    up: async ({ effects }) => {
      const args = await storeJson.read((s) => s.serveArgs).once()
      if (!args?.length) return
      const [model, ...serveArgs] = args
      await credentialsJson.merge(effects, { model })
      await storeJson.merge(effects, { serveArgs })
    },
    down: IMPOSSIBLE,
  },
})
