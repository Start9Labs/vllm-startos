import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.30.0:1',
  releaseNotes: {
    en_US: `- **Custom** serve arguments follow shell quoting, so \`--foo "a b"\` stays one argument; nothing is expanded. Wrap JSON values in single quotes, e.g. \`--hf-overrides '{"a":1}'\`.
- **Set Model** also takes environment variables, such as an \`HF_TOKEN\` for a gated model or a \`VLLM_*\` tuning flag. They apply to preset and Custom selections.`,
    es_ES: `- Los argumentos de arranque **Personalizados** siguen el entrecomillado de un shell, de modo que \`--foo "a b"\` sigue siendo un único argumento; no se expande nada. Encierre los valores JSON entre comillas simples, p. ej. \`--hf-overrides '{"a":1}'\`.
- **Establecer modelo** también acepta variables de entorno, como un \`HF_TOKEN\` para un modelo restringido o un flag de ajuste \`VLLM_*\`. Se aplican tanto a los preajustes como a las selecciones personalizadas.`,
    de_DE: `- **Benutzerdefinierte** Serve-Argumente folgen den Anführungsregeln einer Shell, sodass \`--foo "a b"\` ein einzelnes Argument bleibt; nichts wird expandiert. Setzen Sie JSON-Werte in einfache Anführungszeichen, z. B. \`--hf-overrides '{"a":1}'\`.
- **Modell festlegen** nimmt auch Umgebungsvariablen entgegen, etwa ein \`HF_TOKEN\` für ein zugangsbeschränktes Modell oder ein \`VLLM_*\`-Optimierungs-Flag. Sie gelten für Voreinstellungen und benutzerdefinierte Auswahlen.`,
    pl_PL: `- **Niestandardowe** argumenty uruchomieniowe przestrzegają reguł cytowania powłoki, więc \`--foo "a b"\` pozostaje pojedynczym argumentem; nic nie jest rozwijane. Wartości JSON ujmij w pojedyncze cudzysłowy, np. \`--hf-overrides '{"a":1}'\`.
- **Ustaw model** przyjmuje również zmienne środowiskowe, takie jak \`HF_TOKEN\` do modelu z ograniczonym dostępem albo flaga strojenia \`VLLM_*\`. Obowiązują zarówno dla gotowych konfiguracji, jak i wyborów niestandardowych.`,
    fr_FR: `- Les arguments de démarrage **Personnalisés** suivent les règles de guillemets d'un shell, si bien que \`--foo "a b"\` reste un seul argument ; rien n'est développé. Placez les valeurs JSON entre guillemets simples, par ex. \`--hf-overrides '{"a":1}'\`.
- **Définir le modèle** accepte aussi des variables d'environnement, comme un \`HF_TOKEN\` pour un modèle à accès restreint ou un indicateur de réglage \`VLLM_*\`. Elles s'appliquent aux préréglages comme aux sélections personnalisées.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
