import { VersionInfo } from '@start9labs/start-sdk'
import { credentialsJson } from '../fileModels/credentials.json'
import { storeJson } from '../fileModels/store.json'
import { isGpuMemoryUtilizationFlag } from '../utils'

// vLLM's default before 0.34.0, which raised it to 1.0.
const previousDefault = ['--gpu-memory-utilization', '0.9']

export const current = VersionInfo.of({
  version: '0.34.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.34.0**.

- New preset on NVIDIA Blackwell GPUs with at least 90 GB of memory, such as the RTX PRO 6000 or DGX Spark: **Qwen3.8 Flash Next**, NVIDIA's FP4 build of Qwen's multimodal model with a 262,144-token context. Its download is about 96 GB.
- vLLM now sizes its memory use from what is actually free after startup and by default claims all of the GPU's memory. Your saved model keeps the previous 90% limit, so it loads as it did before. To use the new default, run Set Model → Custom and remove --gpu-memory-utilization. Keep it on a DGX Spark or other unified-memory system, where the GPU shares memory with StartOS.
- Custom configurations: the default --block-size is now 64 (was 16); pass --block-size 16 to keep the old behavior. Remove VLLM_USE_V2_MODEL_RUNNER if you set it to anything but 1. fp_quant checkpoints no longer load, and VLLM_MARLIN_INPUT_DTYPE is replaced by --quantization humming.
- Internal: updates start-sdk to 4.1.0.

Full upstream changes: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    es_ES: `Actualiza vLLM a **0.34.0**.

- Nuevo preajuste en GPU NVIDIA Blackwell con al menos 90 GB de memoria, como la RTX PRO 6000 o la DGX Spark: **Qwen3.8 Flash Next**, la versión FP4 de NVIDIA del modelo multimodal de Qwen, con un contexto de 262.144 tokens. Su descarga ocupa unos 96 GB.
- vLLM ahora calcula su uso de memoria a partir de lo que realmente queda libre tras el arranque y, por defecto, ocupa toda la memoria de la GPU. Su modelo guardado conserva el límite anterior del 90 %, así que carga como antes. Para usar el nuevo valor por defecto, ejecute Set Model → Custom y quite --gpu-memory-utilization. Manténgalo en una DGX Spark u otro sistema de memoria unificada, donde la GPU comparte memoria con StartOS.
- Configuraciones personalizadas: el --block-size por defecto ahora es 64 (antes 16); pase --block-size 16 para mantener el comportamiento anterior. Elimine VLLM_USE_V2_MODEL_RUNNER si lo tiene con un valor distinto de 1. Los checkpoints fp_quant ya no cargan, y VLLM_MARLIN_INPUT_DTYPE se sustituye por --quantization humming.
- Interno: actualiza start-sdk a 4.1.0.

Cambios completos: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    de_DE: `Aktualisiert vLLM auf **0.34.0**.

- Neue Voreinstellung für NVIDIA-Blackwell-GPUs mit mindestens 90 GB Speicher, etwa die RTX PRO 6000 oder den DGX Spark: **Qwen3.8 Flash Next**, NVIDIAs FP4-Version des multimodalen Qwen-Modells mit einem Kontext von 262.144 Tokens. Der Download umfasst etwa 96 GB.
- vLLM bemisst seinen Speicherverbrauch jetzt nach dem, was nach dem Start tatsächlich frei ist, und belegt standardmäßig den gesamten GPU-Speicher. Dein gespeichertes Modell behält die bisherige Grenze von 90 % und lädt daher wie zuvor. Um den neuen Standard zu nutzen, führe Set Model → Custom aus und entferne --gpu-memory-utilization. Behalte es auf einem DGX Spark oder einem anderen System mit Unified Memory, auf dem sich die GPU den Speicher mit StartOS teilt.
- Benutzerdefinierte Konfigurationen: Die Standard-Blockgröße (--block-size) ist jetzt 64 (bisher 16); übergib --block-size 16, um das alte Verhalten beizubehalten. Entferne VLLM_USE_V2_MODEL_RUNNER, falls du es auf einen anderen Wert als 1 gesetzt hast. fp_quant-Checkpoints laden nicht mehr, und VLLM_MARLIN_INPUT_DTYPE wird durch --quantization humming ersetzt.
- Intern: aktualisiert start-sdk auf 4.1.0.

Alle Upstream-Änderungen: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    pl_PL: `Aktualizuje vLLM do **0.34.0**.

- Nowa gotowa konfiguracja dla kart NVIDIA Blackwell z co najmniej 90 GB pamięci, takich jak RTX PRO 6000 czy DGX Spark: **Qwen3.8 Flash Next**, wersja FP4 multimodalnego modelu Qwen przygotowana przez NVIDIA, z kontekstem 262 144 tokenów. Do pobrania jest około 96 GB.
- vLLM ustala teraz zużycie pamięci na podstawie tego, co faktycznie pozostaje wolne po uruchomieniu, i domyślnie zajmuje całą pamięć GPU. Zapisany model zachowuje dotychczasowy limit 90%, więc ładuje się tak jak wcześniej. Aby użyć nowej wartości domyślnej, uruchom Set Model → Custom i usuń --gpu-memory-utilization. Zachowaj go na DGX Spark lub innym systemie z pamięcią współdzieloną, w którym GPU dzieli pamięć ze StartOS.
- Własne konfiguracje: domyślny --block-size to teraz 64 (wcześniej 16); podaj --block-size 16, aby zachować dotychczasowe zachowanie. Usuń VLLM_USE_V2_MODEL_RUNNER, jeśli ustawiono go na wartość inną niż 1. Checkpointy fp_quant nie są już ładowane, a VLLM_MARLIN_INPUT_DTYPE zastępuje --quantization humming.
- Wewnętrzne: aktualizuje start-sdk do 4.1.0.

Pełna lista zmian upstream: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    fr_FR: `Met à jour vLLM vers **0.34.0**.

- Nouveau préréglage pour les GPU NVIDIA Blackwell dotés d'au moins 90 Go de mémoire, comme la RTX PRO 6000 ou le DGX Spark : **Qwen3.8 Flash Next**, la version FP4 par NVIDIA du modèle multimodal de Qwen, avec un contexte de 262 144 tokens. Son téléchargement représente environ 96 Go.
- vLLM dimensionne désormais sa consommation de mémoire d'après ce qui est réellement libre après le démarrage et occupe par défaut toute la mémoire du GPU. Votre modèle enregistré conserve l'ancienne limite de 90 % et se charge donc comme avant. Pour adopter la nouvelle valeur par défaut, lancez Set Model → Custom et retirez --gpu-memory-utilization. Conservez-le sur un DGX Spark ou tout autre système à mémoire unifiée, où le GPU partage la mémoire avec StartOS.
- Configurations personnalisées : le --block-size par défaut est désormais 64 (au lieu de 16) ; passez --block-size 16 pour conserver l'ancien comportement. Supprimez VLLM_USE_V2_MODEL_RUNNER s'il vaut autre chose que 1. Les checkpoints fp_quant ne se chargent plus, et VLLM_MARLIN_INPUT_DTYPE est remplacé par --quantization humming.
- Interne : met à jour start-sdk vers 4.1.0.

Toutes les modifications en amont : https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
  },
  migrations: {
    // Pins saved selections to the memory limit they were tuned under.
    up: async ({ effects }) => {
      const model = await credentialsJson.read((c) => c.model).once()
      if (!model) return
      await storeJson.update(effects, (store) => {
        const serveArgs = store?.serveArgs ?? []
        if (serveArgs.some(isGpuMemoryUtilizationFlag)) return null
        const selection = store?.modelSelection
        return {
          ...store,
          serveArgs: [...serveArgs, ...previousDefault],
          modelSelection:
            selection?.selection === 'custom'
              ? {
                  ...selection,
                  customArgs: [selection.customArgs, ...previousDefault]
                    .filter(Boolean)
                    .join(' '),
                }
              : selection,
        }
      })
    },
    down: async () => {},
  },
})
