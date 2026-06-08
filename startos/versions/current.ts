import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:4',
  releaseNotes: {
    en_US: `Advances the bundled vLLM nightly build to commit 303916e (still upstream 0.22.1rc0). Bugfix-focused: fixes a MambaManager slot-allocation assertion and a FunASR-Nano init crash, enables permute_cols on ROCm, and adds GLM-4.6V video and Cohere Mini Code model support. Full changes: https://github.com/vllm-project/vllm/compare/9c7f774...303916e`,
    es_ES: `Avanza la compilación nightly de vLLM incluida al commit 303916e (sigue siendo upstream 0.22.1rc0). Centrado en correcciones: arregla una aserción de asignación de slots en MambaManager y un fallo de inicialización de FunASR-Nano, habilita permute_cols en ROCm y añade soporte para vídeo GLM-4.6V y el modelo Cohere Mini Code. Cambios completos: https://github.com/vllm-project/vllm/compare/9c7f774...303916e`,
    de_DE: `Aktualisiert den gebündelten vLLM-Nightly-Build auf Commit 303916e (weiterhin Upstream 0.22.1rc0). Fehlerbehebungen: behebt eine Slot-Zuweisungs-Assertion im MambaManager und einen FunASR-Nano-Initialisierungsabsturz, aktiviert permute_cols auf ROCm und ergänzt Unterstützung für GLM-4.6V-Video und das Cohere-Mini-Code-Modell. Vollständige Änderungen: https://github.com/vllm-project/vllm/compare/9c7f774...303916e`,
    pl_PL: `Aktualizuje dołączoną kompilację nightly vLLM do commitu 303916e (nadal upstream 0.22.1rc0). Skupione na poprawkach: naprawia asercję alokacji slotów w MambaManager oraz awarię inicjalizacji FunASR-Nano, włącza permute_cols na ROCm i dodaje obsługę wideo GLM-4.6V oraz modelu Cohere Mini Code. Pełne zmiany: https://github.com/vllm-project/vllm/compare/9c7f774...303916e`,
    fr_FR: `Met à jour la version nightly de vLLM incluse vers le commit 303916e (toujours upstream 0.22.1rc0). Axé sur les corrections : corrige une assertion d'allocation de slots dans MambaManager et un plantage d'initialisation de FunASR-Nano, active permute_cols sur ROCm et ajoute la prise en charge de la vidéo GLM-4.6V et du modèle Cohere Mini Code. Changements complets : https://github.com/vllm-project/vllm/compare/9c7f774...303916e`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
