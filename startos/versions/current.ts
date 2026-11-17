import { VersionInfo } from '@start9labs/start-sdk'
import { credentialsJson } from '../fileModels/credentials.json'
import { storeJson } from '../fileModels/store.json'
import { isGpuMemoryUtilizationFlag } from '../utils'

// vLLM 0.33.0 defaults to 0.92 without an explicit memory limit.
const previousDefault = ['--gpu-memory-utilization', '0.92']

export const current = VersionInfo.of({
  version: '0.34.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.34.0**.

- vLLM now sizes its memory use from what is actually free after startup and by default claims all of the GPU's memory. Your saved model keeps its configured memory limit; selections without one keep the previous 92% default. To use the new default, run Set Model → Custom and remove --gpu-memory-utilization. Keep it on a DGX Spark or other unified-memory system, where the GPU shares memory with StartOS.
- Custom configurations: the default --block-size is now 64 (was 16); pass --block-size 16 to keep the old behavior. Remove VLLM_USE_V2_MODEL_RUNNER if you set it to anything but 1. fp_quant checkpoints no longer load, and VLLM_MARLIN_INPUT_DTYPE is replaced by --quantization humming.

Full upstream changes: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    es_ES: `Actualiza vLLM a **0.34.0**.

- vLLM ahora calcula su uso de memoria a partir de lo que realmente queda libre tras el arranque y, por defecto, ocupa toda la memoria de la GPU. Su modelo guardado conserva el límite de memoria configurado; las selecciones sin límite conservan el valor por defecto anterior del 92 %. Para usar el nuevo valor por defecto, ejecute Set Model → Custom y quite --gpu-memory-utilization. Manténgalo en una DGX Spark u otro sistema de memoria unificada, donde la GPU comparte memoria con StartOS.
- Configuraciones personalizadas: el --block-size por defecto ahora es 64 (antes 16); pase --block-size 16 para mantener el comportamiento anterior. Elimine VLLM_USE_V2_MODEL_RUNNER si lo tiene con un valor distinto de 1. Los checkpoints fp_quant ya no cargan, y VLLM_MARLIN_INPUT_DTYPE se sustituye por --quantization humming.

Cambios completos: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    de_DE: `Aktualisiert vLLM auf **0.34.0**.

- vLLM bemisst seinen Speicherverbrauch jetzt nach dem, was nach dem Start tatsächlich frei ist, und belegt standardmäßig den gesamten GPU-Speicher. Dein gespeichertes Modell behält seine konfigurierte Speichergrenze; Auswahlen ohne Grenze behalten den bisherigen Standardwert von 92 %. Um den neuen Standard zu nutzen, führe Set Model → Custom aus und entferne --gpu-memory-utilization. Behalte es auf einem DGX Spark oder einem anderen System mit Unified Memory, auf dem sich die GPU den Speicher mit StartOS teilt.
- Benutzerdefinierte Konfigurationen: Die Standard-Blockgröße (--block-size) ist jetzt 64 (bisher 16); übergib --block-size 16, um das alte Verhalten beizubehalten. Entferne VLLM_USE_V2_MODEL_RUNNER, falls du es auf einen anderen Wert als 1 gesetzt hast. fp_quant-Checkpoints laden nicht mehr, und VLLM_MARLIN_INPUT_DTYPE wird durch --quantization humming ersetzt.

Alle Upstream-Änderungen: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    pl_PL: `Aktualizuje vLLM do **0.34.0**.

- vLLM ustala teraz zużycie pamięci na podstawie tego, co faktycznie pozostaje wolne po uruchomieniu, i domyślnie zajmuje całą pamięć GPU. Zapisany model zachowuje skonfigurowany limit pamięci; wybory bez limitu zachowują poprzednią wartość domyślną 92%. Aby użyć nowej wartości domyślnej, uruchom Set Model → Custom i usuń --gpu-memory-utilization. Zachowaj go na DGX Spark lub innym systemie z pamięcią współdzieloną, w którym GPU dzieli pamięć ze StartOS.
- Własne konfiguracje: domyślny --block-size to teraz 64 (wcześniej 16); podaj --block-size 16, aby zachować dotychczasowe zachowanie. Usuń VLLM_USE_V2_MODEL_RUNNER, jeśli ustawiono go na wartość inną niż 1. Checkpointy fp_quant nie są już ładowane, a VLLM_MARLIN_INPUT_DTYPE zastępuje --quantization humming.

Pełna lista zmian upstream: https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
    fr_FR: `Met à jour vLLM vers **0.34.0**.

- vLLM dimensionne désormais sa consommation de mémoire d'après ce qui est réellement libre après le démarrage et occupe par défaut toute la mémoire du GPU. Votre modèle enregistré conserve sa limite de mémoire configurée ; les sélections sans limite conservent l'ancienne valeur par défaut de 92 %. Pour adopter la nouvelle valeur par défaut, lancez Set Model → Custom et retirez --gpu-memory-utilization. Conservez-le sur un DGX Spark ou tout autre système à mémoire unifiée, où le GPU partage la mémoire avec StartOS.
- Configurations personnalisées : le --block-size par défaut est désormais 64 (au lieu de 16) ; passez --block-size 16 pour conserver l'ancien comportement. Supprimez VLLM_USE_V2_MODEL_RUNNER s'il vaut autre chose que 1. Les checkpoints fp_quant ne se chargent plus, et VLLM_MARLIN_INPUT_DTYPE est remplacé par --quantization humming.

Toutes les modifications en amont : https://github.com/vllm-project/vllm/compare/v0.33.0...v0.34.0`,
  },
  migrations: {
    // Preserves saved memory limits under either vLLM option alias.
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
