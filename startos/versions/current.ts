import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:5',
  releaseNotes: {
    en_US: `Advances the bundled vLLM nightly build to commit d8218b1 (still upstream 0.22.1rc0). Highlights: integrates DeepEP v2 for wide expert parallelism, adds full-CUDA-graph ViT for GLM-4.1V image/video inference, adds /pause, /resume and /is_paused endpoints to the Rust frontend, and adds online FP8 PTPC quantization. Also fixes Qwen3-Omni ViT attention, canonicalizes FP8 weight layout, and propagates audio import errors more clearly. Full changes: https://github.com/vllm-project/vllm/compare/303916e...d8218b1`,
    es_ES: `Avanza la compilación nightly de vLLM incluida al commit d8218b1 (sigue siendo upstream 0.22.1rc0). Novedades: integra DeepEP v2 para paralelismo de expertos amplio, añade ViT con CUDA graph completo para inferencia de imagen/vídeo GLM-4.1V, añade los endpoints /pause, /resume e /is_paused al frontend de Rust y añade cuantización FP8 PTPC en línea. También corrige la atención ViT de Qwen3-Omni, canonicaliza el diseño de pesos FP8 y propaga con más claridad los errores de importación de audio. Cambios completos: https://github.com/vllm-project/vllm/compare/303916e...d8218b1`,
    de_DE: `Aktualisiert den gebündelten vLLM-Nightly-Build auf Commit d8218b1 (weiterhin Upstream 0.22.1rc0). Highlights: integriert DeepEP v2 für breite Expert-Parallelität, ergänzt vollständigen CUDA-Graph-ViT für GLM-4.1V-Bild-/Videoinferenz, fügt dem Rust-Frontend die Endpunkte /pause, /resume und /is_paused hinzu und ergänzt Online-FP8-PTPC-Quantisierung. Behebt außerdem die Qwen3-Omni-ViT-Attention, kanonisiert das FP8-Gewichtslayout und gibt Audio-Importfehler klarer weiter. Vollständige Änderungen: https://github.com/vllm-project/vllm/compare/303916e...d8218b1`,
    pl_PL: `Aktualizuje dołączoną kompilację nightly vLLM do commitu d8218b1 (nadal upstream 0.22.1rc0). Najważniejsze: integruje DeepEP v2 dla szerokiej równoległości ekspertów, dodaje pełny CUDA graph ViT dla wnioskowania obrazu/wideo GLM-4.1V, dodaje endpointy /pause, /resume i /is_paused do frontendu Rust oraz dodaje kwantyzację online FP8 PTPC. Naprawia także uwagę ViT w Qwen3-Omni, kanonizuje układ wag FP8 i wyraźniej propaguje błędy importu audio. Pełne zmiany: https://github.com/vllm-project/vllm/compare/303916e...d8218b1`,
    fr_FR: `Met à jour la version nightly de vLLM incluse vers le commit d8218b1 (toujours upstream 0.22.1rc0). Points forts : intègre DeepEP v2 pour le parallélisme d'experts à grande échelle, ajoute un ViT en CUDA graph complet pour l'inférence image/vidéo GLM-4.1V, ajoute les endpoints /pause, /resume et /is_paused au frontend Rust et ajoute la quantification FP8 PTPC en ligne. Corrige aussi l'attention ViT de Qwen3-Omni, canonicalise la disposition des poids FP8 et propage plus clairement les erreurs d'import audio. Changements complets : https://github.com/vllm-project/vllm/compare/303916e...d8218b1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
