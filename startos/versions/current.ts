import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:0',
  releaseNotes: {
    en_US:
      'Advance bundled vLLM to the 2026-05-30 nightly (3fd9d2d), crossing the v0.22.0 release — adds new model support (Step-3.7-Flash, Cosmos3 Reasoner, DeepSeek V4 MTP), CPU top-k/top-p sampling kernels with zentorch routing for AMD Zen CPUs, and Responses API chat_template_kwargs support, plus assorted performance and bug fixes.',
    es_ES:
      'Actualiza el vLLM incluido a la nightly del 2026-05-30 (3fd9d2d), abarcando la versión v0.22.0: añade soporte para nuevos modelos (Step-3.7-Flash, Cosmos3 Reasoner, DeepSeek V4 MTP), kernels de muestreo top-k/top-p para CPU con enrutamiento zentorch para CPUs AMD Zen y soporte de chat_template_kwargs en la Responses API, además de diversas mejoras de rendimiento y correcciones de errores.',
    de_DE:
      'Aktualisiert das mitgelieferte vLLM auf den Nightly-Build vom 2026-05-30 (3fd9d2d) und umfasst das Release v0.22.0 — ergänzt Unterstützung für neue Modelle (Step-3.7-Flash, Cosmos3 Reasoner, DeepSeek V4 MTP), CPU-Sampling-Kernels (top-k/top-p) mit zentorch-Routing für AMD-Zen-CPUs und Unterstützung für chat_template_kwargs in der Responses-API sowie diverse Performance- und Fehlerbehebungen.',
    pl_PL:
      'Aktualizuje dołączony vLLM do kompilacji nightly z 2026-05-30 (3fd9d2d), obejmując wydanie v0.22.0 — dodaje obsługę nowych modeli (Step-3.7-Flash, Cosmos3 Reasoner, DeepSeek V4 MTP), jądra próbkowania top-k/top-p dla CPU z routingiem zentorch dla procesorów AMD Zen oraz obsługę chat_template_kwargs w Responses API, a także różne usprawnienia wydajności i poprawki błędów.',
    fr_FR:
      'Met à jour le vLLM intégré vers la nightly du 2026-05-30 (3fd9d2d), couvrant la version v0.22.0 — ajoute la prise en charge de nouveaux modèles (Step-3.7-Flash, Cosmos3 Reasoner, DeepSeek V4 MTP), des kernels d’échantillonnage top-k/top-p pour CPU avec routage zentorch pour les CPU AMD Zen et la prise en charge de chat_template_kwargs dans la Responses API, ainsi que diverses améliorations de performances et corrections de bugs.',
  },
  // No state changes: the vllm bump is an image/submodule swap.
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
