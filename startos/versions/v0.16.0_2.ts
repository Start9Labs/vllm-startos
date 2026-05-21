import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_16_0_2 = VersionInfo.of({
  version: '0.16.0:0.2',
  releaseNotes: {
    en_US:
      'Add Gemma 4 31B and 26B-A4B Instruct presets with MTP speculative decoding and reasoning ("thinking") enabled by default. Fix hardware detection on unified-memory NVIDIA parts (DGX Spark / GB10), where every preset previously appeared disabled. Bump bundled vLLM to upstream master.',
    es_ES:
      'Añade los presets de Gemma 4 31B y 26B-A4B Instruct con decodificación especulativa MTP y razonamiento ("thinking") activado por defecto. Corrige la detección de hardware en GPUs NVIDIA de memoria unificada (DGX Spark / GB10), donde previamente todos los presets aparecían deshabilitados. Actualiza el vLLM incluido a la rama master de upstream.',
    de_DE:
      'Fügt Gemma-4-31B- und 26B-A4B-Instruct-Presets mit MTP-spekulativer Dekodierung und standardmäßig aktiviertem Reasoning ("Thinking") hinzu. Behebt die Hardware-Erkennung auf NVIDIA-Chips mit Unified Memory (DGX Spark / GB10), bei denen zuvor alle Presets als deaktiviert angezeigt wurden. Aktualisiert das mitgelieferte vLLM auf den Upstream-Master.',
    pl_PL:
      'Dodaje ustawienia Gemma 4 31B oraz 26B-A4B Instruct z dekodowaniem spekulacyjnym MTP i włączonym domyślnie rozumowaniem („thinking"). Naprawia wykrywanie sprzętu na układach NVIDIA z pamięcią zunifikowaną (DGX Spark / GB10), gdzie wcześniej wszystkie ustawienia były pokazywane jako wyłączone. Aktualizuje dołączony vLLM do gałęzi master upstreamu.',
    fr_FR:
      'Ajoute les presets Gemma 4 31B et 26B-A4B Instruct avec décodage spéculatif MTP et raisonnement (« thinking ») activé par défaut. Corrige la détection du matériel sur les GPU NVIDIA à mémoire unifiée (DGX Spark / GB10), où tous les presets apparaissaient auparavant comme désactivés. Met à jour le vLLM intégré vers la branche master en amont.',
  },
  // No state changes: the new presets are added entries in setModel, the
  // hardware-detection fix is pure runtime logic, and the vllm bump is an
  // image swap.
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
