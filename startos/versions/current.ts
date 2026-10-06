import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.31.0:1',
  releaseNotes: {
    en_US: `Updates vLLM to **0.31.0**.

- Improves CUDA kernel warmup, Gemma 4 weight loading, Mamba prefix caching and structured-output termination. AMD images move to torch 2.13 / triton 3.8.
- Security: rejects per-request multimodal processing overrides by default and hardens request validation and error sanitization. Trusted clients that need \`mm_processor_kwargs\` or \`media_io_kwargs\` require \`--trust-request-mm-kwargs\` in Custom serve arguments.
- Custom selections must remove \`--tokenizer-mode slow\`. For online quantization of an unquantized checkpoint, replace \`--quantization fp8\` with \`--quantization fp8_per_tensor\`; pre-quantized FP8 checkpoints are unaffected.
- **Set Model** now sizes NVIDIA presets to the first GPU's memory instead of adding every card's memory. Presets do not enable tensor parallelism; if a saved selection is too large for one card, choose a smaller preset. Unified-memory NVIDIA still uses system RAM.

[Full upstream changes](https://github.com/vllm-project/vllm/compare/v0.30.0...v0.31.0)

- **Set Model**'s Configuration field explains why a preset can be unavailable and what Custom does.
- **Delete Model Cache** no longer preselects a model; you choose the one to delete.
- Set Model's field descriptions no longer show stray backtick characters.`,
    es_ES: `Actualiza vLLM a **0.31.0**.

- Mejora el precalentamiento de kernels CUDA, la carga de pesos de Gemma 4, la caché de prefijos Mamba y la terminación de salidas estructuradas. Las imágenes AMD pasan a torch 2.13 / triton 3.8.
- Seguridad: rechaza por defecto las modificaciones del procesamiento multimedia por solicitud y refuerza la validación de solicitudes y el saneamiento de errores. Los clientes de confianza que necesitan \`mm_processor_kwargs\` o \`media_io_kwargs\` requieren \`--trust-request-mm-kwargs\` en los argumentos personalizados.
- Las selecciones personalizadas deben eliminar \`--tokenizer-mode slow\`. Para cuantizar un modelo no cuantizado al cargarlo, sustituye \`--quantization fp8\` por \`--quantization fp8_per_tensor\`; los modelos ya cuantizados en FP8 no se ven afectados.
- **Establecer modelo** ahora dimensiona los presets NVIDIA según la memoria de la primera GPU en lugar de sumar todas las tarjetas. Los presets no activan el paralelismo tensorial; si una selección guardada es demasiado grande para una tarjeta, elige un preset más pequeño. NVIDIA con memoria unificada sigue usando la RAM del sistema.

[Todos los cambios de upstream](https://github.com/vllm-project/vllm/compare/v0.30.0...v0.31.0)

- El campo Configuración de **Establecer modelo** explica por qué un preset puede no estar disponible y qué hace Personalizado.
- **Eliminar caché del modelo** ya no preselecciona un modelo; usted elige el que desea eliminar.
- Las descripciones de los campos de Establecer modelo ya no muestran acentos graves sueltos.`,
    de_DE: `Aktualisiert vLLM auf **0.31.0**.

- Verbessert das Vorwärmen der CUDA-Kernel, das Laden von Gemma-4-Gewichten, das Mamba-Präfix-Caching und die Beendigung strukturierter Ausgaben. AMD-Images wechseln auf torch 2.13 / triton 3.8.
- Sicherheit: weist anfragespezifische Änderungen der Multimediaverarbeitung standardmäßig zurück und härtet die Anfragevalidierung und Bereinigung von Fehlermeldungen. Vertrauenswürdige Clients, die \`mm_processor_kwargs\` oder \`media_io_kwargs\` benötigen, erfordern \`--trust-request-mm-kwargs\` in den benutzerdefinierten Serve-Argumenten.
- Entfernen Sie \`--tokenizer-mode slow\` aus benutzerdefinierten Konfigurationen. Ersetzen Sie bei der Quantisierung eines unquantisierten Modells während des Ladens \`--quantization fp8\` durch \`--quantization fp8_per_tensor\`; bereits FP8-quantisierte Modelle sind nicht betroffen.
- **Modell festlegen** bemisst NVIDIA-Presets jetzt nach dem Speicher der ersten GPU statt der Summe aller Karten. Presets aktivieren keinen Tensorparallelismus; wählen Sie ein kleineres Preset, wenn eine gespeicherte Auswahl für eine Karte zu groß ist. NVIDIA mit Unified Memory verwendet weiterhin den System-RAM.

[Alle Upstream-Änderungen](https://github.com/vllm-project/vllm/compare/v0.30.0...v0.31.0)

- Das Feld „Konfiguration“ in **Modell festlegen** erklärt, warum ein Preset nicht verfügbar sein kann und was Benutzerdefiniert bewirkt.
- **Modell-Cache löschen** wählt kein Modell mehr vor; Sie wählen das zu löschende selbst aus.
- Die Feldbeschreibungen in „Modell festlegen“ zeigen keine überzähligen Backticks mehr.`,
    pl_PL: `Aktualizuje vLLM do **0.31.0**.

- Ulepsza rozgrzewanie jąder CUDA, ładowanie wag Gemma 4, buforowanie prefiksów Mamba i kończenie wyjść strukturalnych. Obrazy AMD przechodzą na torch 2.13 / triton 3.8.
- Bezpieczeństwo: domyślnie odrzuca zmiany przetwarzania multimediów w poszczególnych żądaniach oraz wzmacnia walidację żądań i oczyszczanie komunikatów błędów. Zaufane klienty wymagające \`mm_processor_kwargs\` lub \`media_io_kwargs\` potrzebują \`--trust-request-mm-kwargs\` we własnych argumentach uruchomieniowych.
- Usuń \`--tokenizer-mode slow\` z własnych konfiguracji. Przy kwantyzacji nieskwantyzowanego modelu podczas ładowania zastąp \`--quantization fp8\` przez \`--quantization fp8_per_tensor\`; modele już skwantyzowane do FP8 pozostają bez zmian.
- **Ustaw model** dobiera teraz ustawienia NVIDIA według pamięci pierwszej karty, zamiast sumować pamięć wszystkich kart. Gotowe konfiguracje nie włączają równoległości tensorowej; jeśli zapisany wybór jest zbyt duży dla jednej karty, wybierz mniejszy model. NVIDIA z pamięcią zunifikowaną nadal korzysta z pamięci RAM systemu.

[Wszystkie zmiany upstream](https://github.com/vllm-project/vllm/compare/v0.30.0...v0.31.0)

- Pole Konfiguracja w akcji **Ustaw model** wyjaśnia, dlaczego gotowa konfiguracja może być niedostępna i do czego służy opcja Niestandardowe.
- **Usuń pamięć podręczną modelu** nie zaznacza już modelu z góry; to Ty wybierasz model do usunięcia.
- Opisy pól w akcji Ustaw model nie wyświetlają już zbędnych znaków grawisu.`,
    fr_FR: `Met à jour vLLM vers **0.31.0**.

- Améliore le préchauffage des noyaux CUDA, le chargement des poids de Gemma 4, le cache de préfixes Mamba et la terminaison des sorties structurées. Les images AMD passent à torch 2.13 / triton 3.8.
- Sécurité : refuse par défaut les modifications du traitement multimédia par requête et renforce la validation des requêtes et le nettoyage des erreurs. Les clients de confiance nécessitant \`mm_processor_kwargs\` ou \`media_io_kwargs\` doivent ajouter \`--trust-request-mm-kwargs\` aux arguments personnalisés.
- Retirez \`--tokenizer-mode slow\` des configurations personnalisées. Pour quantifier un modèle non quantifié lors du chargement, remplacez \`--quantization fp8\` par \`--quantization fp8_per_tensor\` ; les modèles déjà quantifiés en FP8 ne sont pas affectés.
- **Définir le modèle** dimensionne désormais les préréglages NVIDIA selon la mémoire du premier GPU, au lieu d'additionner celle de toutes les cartes. Les préréglages n'activent pas le parallélisme tensoriel ; choisissez un modèle plus petit si une sélection enregistrée dépasse la mémoire d'une carte. NVIDIA à mémoire unifiée utilise toujours la RAM du système.

[Tous les changements en amont](https://github.com/vllm-project/vllm/compare/v0.30.0...v0.31.0)

- Le champ Configuration de **Définir le modèle** explique pourquoi un préréglage peut être indisponible et à quoi sert Personnalisé.
- **Supprimer le cache du modèle** ne présélectionne plus de modèle ; vous choisissez celui à supprimer.
- Les descriptions des champs de Définir le modèle n'affichent plus de caractères accent grave parasites.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
