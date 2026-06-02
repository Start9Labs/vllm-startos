import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:1',
  releaseNotes: {
    en_US:
      'Advance bundled vLLM to the 2026-06-01 nightly (f91fb2f) — adds JetBrains Mellum v2 code-generation model support, a ~20% cutlass FP8 scaled-mm kernel speedup, a ROCm AITER upgrade to v0.1.13.post1, and assorted bug fixes (Gemma4-MM, MiniCPM-O audio, GLM-5.1).',
    es_ES:
      'Actualiza el vLLM incluido a la nightly del 2026-06-01 (f91fb2f): añade soporte para el modelo de generación de código JetBrains Mellum v2, una aceleración de ~20 % del kernel cutlass FP8 scaled-mm, una actualización de ROCm AITER a v0.1.13.post1 y diversas correcciones de errores (Gemma4-MM, audio de MiniCPM-O, GLM-5.1).',
    de_DE:
      'Aktualisiert das mitgelieferte vLLM auf den Nightly-Build vom 2026-06-01 (f91fb2f) — ergänzt Unterstützung für das Codegenerierungsmodell JetBrains Mellum v2, eine ~20 % schnellere cutlass-FP8-scaled-mm-Kernel-Leistung, ein ROCm-AITER-Upgrade auf v0.1.13.post1 sowie diverse Fehlerbehebungen (Gemma4-MM, MiniCPM-O-Audio, GLM-5.1).',
    pl_PL:
      'Aktualizuje dołączony vLLM do kompilacji nightly z 2026-06-01 (f91fb2f) — dodaje obsługę modelu generowania kodu JetBrains Mellum v2, ~20 % przyspieszenie jądra cutlass FP8 scaled-mm, aktualizację ROCm AITER do v0.1.13.post1 oraz różne poprawki błędów (Gemma4-MM, dźwięk MiniCPM-O, GLM-5.1).',
    fr_FR:
      'Met à jour le vLLM intégré vers la nightly du 2026-06-01 (f91fb2f) — ajoute la prise en charge du modèle de génération de code JetBrains Mellum v2, une accélération d’environ 20 % du kernel cutlass FP8 scaled-mm, une mise à niveau de ROCm AITER vers v0.1.13.post1 et diverses corrections de bugs (Gemma4-MM, audio MiniCPM-O, GLM-5.1).',
  },
  // No state changes: the vllm bump is an image/submodule swap.
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
