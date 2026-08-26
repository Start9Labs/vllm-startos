import { T, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

const BNB_MODEL = 'unsloth/Mistral-Small-3.2-24B-Instruct-2506-bnb-4bit'
const W4A16_MODEL = 'jeffcookio/Mistral-Small-3.2-24B-Instruct-2506-awq-sym'

function dropFlag(args: string[], flag: string, value: string): string[] {
  const kept: string[] = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && args[i + 1] === value) {
      i++
      continue
    }
    kept.push(args[i])
  }
  return kept
}

// The model id is the first serve argument, and flags follow it.
function addFlag(args: string[], flag: string, value: string): string[] {
  const [model, ...rest] = args
  return [model, flag, value, ...rest]
}

// vLLM 0.28 moved bitsandbytes out of tree and the official images carry no
// plugin, so the args stored for the Mistral Small 3.2 preset on hopper and
// older NVIDIA hardware no longer start. Rewrite them to the compressed-tensors
// W4A16 checkpoint the preset now names.
async function rewriteMistralArgs(
  effects: T.Effects,
  from: string,
  to: string,
  rewriteFlags: (args: string[]) => string[],
) {
  const store = await storeJson.read().once()
  if (store?.modelSelection?.selection !== 'mistral-small-32-24b') return
  const args = store.serveArgs
  if (!args?.includes(from)) return
  const serveArgs = rewriteFlags(args.map((a) => (a === from ? to : a)))
  await storeJson.merge(effects, { serveArgs })
}

export const current = VersionInfo.of({
  version: '0.28.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.28.0**.

- **Delete Model Cache** now lists the models already in the cache, with their sizes, so you pick one instead of typing a HuggingFace model id.
- New model support: Muse Glimmer, Ling 3.0 Flash, Dots3 and Interns2mobius, on top of Transformers 5.15.0.
- Better throughput out of the box: the batched-token budget doubles from 8192 to 16384, and prefix caching is now on by default for Mamba models.
- AMD: ROCm moves to torch 2.12 / triton 3.7, adds Qwen3.8 and Kimi-K3, and runs DeepSeek-V4 on gfx11 and gfx950.
- Security: a denial of service via a forged audio sample rate, which bypassed the audio decode duration guard, is fixed.
- Upstream moved bitsandbytes quantization out of vLLM and into a separate plugin that the official images do not carry. The **Mistral Small 3.2 24B** preset on Hopper and older NVIDIA cards now uses an INT4 checkpoint that loads without it, and an existing selection is switched over during the update. If you set \`--quantization bitsandbytes\` or \`--load-format bitsandbytes\` as custom serve arguments, pick a different quantization.
- Upstream also removed the \`calculate_kv_scales\` and \`override_attention_dtype\` options. Drop them if you set them as custom serve arguments.
- The package README now records what the generated API key does and does not protect: it covers the \`/v1\`, \`/v2\` and \`/inference\` endpoints, and several other endpoints on the same port answer without it.

Full upstream release notes: https://github.com/vllm-project/vllm/releases/tag/v0.28.0`,
    es_ES: `Actualiza vLLM a **0.28.0**.

- **Eliminar caché del modelo** ahora muestra los modelos que ya están en la caché, con su tamaño, para que elijas uno en lugar de escribir un ID de modelo de HuggingFace.
- Nuevos modelos compatibles: Muse Glimmer, Ling 3.0 Flash, Dots3 e Interns2mobius, sobre Transformers 5.15.0.
- Mejor rendimiento de serie: el presupuesto de tokens por lote se duplica de 8192 a 16384 y el almacenamiento en caché de prefijos está activado por defecto para los modelos Mamba.
- AMD: ROCm pasa a torch 2.12 / triton 3.7, añade Qwen3.8 y Kimi-K3, y ejecuta DeepSeek-V4 en gfx11 y gfx950.
- Seguridad: se corrige una denegación de servicio mediante una frecuencia de muestreo de audio falsificada que eludía el límite de duración de decodificación.
- Upstream trasladó la cuantización bitsandbytes fuera de vLLM, a un complemento aparte que las imágenes oficiales no incluyen. El preajuste **Mistral Small 3.2 24B** en tarjetas NVIDIA Hopper y anteriores usa ahora un modelo INT4 que se carga sin él, y una selección existente se cambia durante la actualización. Si has añadido \`--quantization bitsandbytes\` o \`--load-format bitsandbytes\` como argumentos personalizados, elige otra cuantización.
- Upstream también eliminó las opciones \`calculate_kv_scales\` y \`override_attention_dtype\`. Elimínalas si las habías añadido como argumentos personalizados.
- El README del paquete ahora indica qué protege y qué no la clave de API generada: cubre los endpoints \`/v1\`, \`/v2\` e \`/inference\`, y varios otros endpoints del mismo puerto responden sin ella.

Notas de la versión completas: https://github.com/vllm-project/vllm/releases/tag/v0.28.0`,
    de_DE: `Aktualisiert vLLM auf **0.28.0**.

- **Modell-Cache löschen** listet jetzt die bereits im Cache liegenden Modelle mit ihrer Größe auf, sodass Sie eines auswählen, statt eine HuggingFace-Modell-ID einzugeben.
- Neue Modellunterstützung: Muse Glimmer, Ling 3.0 Flash, Dots3 und Interns2mobius, auf Basis von Transformers 5.15.0.
- Höherer Durchsatz ohne Zutun: das Batch-Token-Budget verdoppelt sich von 8192 auf 16384, und Präfix-Caching ist für Mamba-Modelle nun standardmäßig aktiv.
- AMD: ROCm wechselt auf torch 2.12 / triton 3.7, ergänzt Qwen3.8 und Kimi-K3 und führt DeepSeek-V4 auf gfx11 und gfx950 aus.
- Sicherheit: Ein Denial of Service über eine gefälschte Audio-Abtastrate, die den Grenzwert für die Dekodierdauer umging, ist behoben.
- Upstream hat die bitsandbytes-Quantisierung aus vLLM in ein separates Plugin ausgelagert, das die offiziellen Images nicht enthalten. Die Voreinstellung **Mistral Small 3.2 24B** verwendet auf Hopper und älteren NVIDIA-Karten jetzt ein INT4-Modell, das ohne dieses Plugin lädt; eine bestehende Auswahl wird während der Aktualisierung umgestellt. Wenn Sie \`--quantization bitsandbytes\` oder \`--load-format bitsandbytes\` als eigene Serve-Argumente gesetzt haben, wählen Sie eine andere Quantisierung.
- Upstream hat außerdem die Optionen \`calculate_kv_scales\` und \`override_attention_dtype\` entfernt. Entfernen Sie sie, falls Sie sie als eigene Serve-Argumente gesetzt haben.
- Die README des Pakets hält jetzt fest, was der erzeugte API-Schlüssel schützt und was nicht: Er deckt die Endpunkte \`/v1\`, \`/v2\` und \`/inference\` ab, während mehrere andere Endpunkte am selben Port auch ohne ihn antworten.

Vollständige Upstream-Versionshinweise: https://github.com/vllm-project/vllm/releases/tag/v0.28.0`,
    pl_PL: `Aktualizuje vLLM do **0.28.0**.

- **Usuń pamięć podręczną modelu** wyświetla teraz modele znajdujące się w pamięci podręcznej wraz z ich rozmiarem, więc wybierasz jeden z listy zamiast wpisywać identyfikator modelu HuggingFace.
- Obsługa nowych modeli: Muse Glimmer, Ling 3.0 Flash, Dots3 oraz Interns2mobius, w oparciu o Transformers 5.15.0.
- Wyższa przepustowość bez zmian w ustawieniach: budżet tokenów w partii rośnie z 8192 do 16384, a buforowanie prefiksów jest domyślnie włączone dla modeli Mamba.
- AMD: ROCm przechodzi na torch 2.12 / triton 3.7, dodaje Qwen3.8 i Kimi-K3 oraz uruchamia DeepSeek-V4 na gfx11 i gfx950.
- Bezpieczeństwo: naprawiono odmowę usługi przez sfałszowaną częstotliwość próbkowania dźwięku, która omijała limit czasu dekodowania.
- Upstream przeniósł kwantyzację bitsandbytes poza vLLM, do osobnej wtyczki, której oficjalne obrazy nie zawierają. Gotowa konfiguracja **Mistral Small 3.2 24B** na kartach NVIDIA Hopper i starszych korzysta teraz z modelu INT4, który ładuje się bez niej, a istniejący wybór zostaje przełączony podczas aktualizacji. Jeśli ustawiono \`--quantization bitsandbytes\` lub \`--load-format bitsandbytes\` jako własne argumenty uruchomieniowe, wybierz inną kwantyzację.
- Upstream usunął także opcje \`calculate_kv_scales\` i \`override_attention_dtype\`. Usuń je, jeśli ustawiono je jako własne argumenty uruchomieniowe.
- README pakietu opisuje teraz, co wygenerowany klucz API chroni, a czego nie: obejmuje punkty końcowe \`/v1\`, \`/v2\` i \`/inference\`, a kilka innych punktów na tym samym porcie odpowiada bez niego.

Pełne informacje o wydaniu: https://github.com/vllm-project/vllm/releases/tag/v0.28.0`,
    fr_FR: `Met à jour vLLM vers **0.28.0**.

- **Supprimer le cache du modèle** répertorie désormais les modèles déjà en cache, avec leur taille, afin que vous en choisissiez un au lieu de saisir un identifiant de modèle HuggingFace.
- Nouveaux modèles pris en charge : Muse Glimmer, Ling 3.0 Flash, Dots3 et Interns2mobius, sur la base de Transformers 5.15.0.
- Meilleur débit par défaut : le budget de jetons par lot passe de 8192 à 16384, et la mise en cache des préfixes est désormais activée par défaut pour les modèles Mamba.
- AMD : ROCm passe à torch 2.12 / triton 3.7, ajoute Qwen3.8 et Kimi-K3, et exécute DeepSeek-V4 sur gfx11 et gfx950.
- Sécurité : un déni de service via une fréquence d'échantillonnage audio falsifiée, qui contournait la limite de durée de décodage, est corrigé.
- En amont, la quantification bitsandbytes a été sortie de vLLM vers un greffon distinct que les images officielles n'embarquent pas. Le préréglage **Mistral Small 3.2 24B** utilise maintenant, sur les cartes NVIDIA Hopper et antérieures, un modèle INT4 qui se charge sans ce greffon, et une sélection existante est basculée pendant la mise à jour. Si vous avez défini \`--quantization bitsandbytes\` ou \`--load-format bitsandbytes\` comme arguments personnalisés, choisissez une autre quantification.
- En amont, les options \`calculate_kv_scales\` et \`override_attention_dtype\` ont également été supprimées. Retirez-les si vous les aviez définies comme arguments personnalisés.
- Le README du paquet précise désormais ce que la clé d'API générée protège et ne protège pas : elle couvre les points de terminaison \`/v1\`, \`/v2\` et \`/inference\`, tandis que plusieurs autres points du même port répondent sans elle.

Notes de version complètes : https://github.com/vllm-project/vllm/releases/tag/v0.28.0`,
  },
  migrations: {
    up: async ({ effects }) =>
      rewriteMistralArgs(effects, BNB_MODEL, W4A16_MODEL, (args) =>
        dropFlag(
          dropFlag(args, '--quantization', 'bitsandbytes'),
          '--load-format',
          'bitsandbytes',
        ),
      ),
    down: async ({ effects }) =>
      rewriteMistralArgs(effects, W4A16_MODEL, BNB_MODEL, (args) =>
        addFlag(
          addFlag(args, '--load-format', 'bitsandbytes'),
          '--quantization',
          'bitsandbytes',
        ),
      ),
  },
})
