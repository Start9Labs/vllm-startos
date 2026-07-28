import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.26.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.26.0**.

- Security: removes pickle deserialization from the disk cache, closes a race that bypassed an earlier CVE fix, and hardens the API server against unbounded prompt lists and slow regular-expression compilation.
- Stability: a failed grammar compilation no longer crashes the engine.
- Broader model support via Transformers 5.13.0, plus faster inference on both NVIDIA and AMD hardware.
- The OpenAI-compatible API gains \`bad_words\` on \`/v1/completions\` and an \`include_reasoning\` option.
- Upstream removed the TeleChat, Persimmon and Fuyu models; none are offered as presets in this package.

Full upstream release notes: https://github.com/vllm-project/vllm/releases/tag/v0.26.0`,
    es_ES: `Actualiza vLLM a **0.26.0**.

- Seguridad: elimina la deserialización pickle de la caché en disco, cierra una condición de carrera que eludía una corrección de CVE anterior y refuerza el servidor API frente a listas de prompts sin límite y a la compilación lenta de expresiones regulares.
- Estabilidad: un fallo al compilar una gramática ya no bloquea el motor.
- Mayor compatibilidad de modelos gracias a Transformers 5.13.0, además de una inferencia más rápida en hardware NVIDIA y AMD.
- La API compatible con OpenAI incorpora \`bad_words\` en \`/v1/completions\` y una opción \`include_reasoning\`.
- Upstream eliminó los modelos TeleChat, Persimmon y Fuyu; ninguno se ofrece como preajuste en este paquete.

Notas de la versión completas: https://github.com/vllm-project/vllm/releases/tag/v0.26.0`,
    de_DE: `Aktualisiert vLLM auf **0.26.0**.

- Sicherheit: entfernt die Pickle-Deserialisierung aus dem Festplatten-Cache, schließt eine Race Condition, die eine frühere CVE-Behebung umging, und härtet den API-Server gegen unbegrenzte Prompt-Listen und langsame Kompilierung regulärer Ausdrücke ab.
- Stabilität: eine fehlgeschlagene Grammatik-Kompilierung bringt die Engine nicht mehr zum Absturz.
- Breitere Modellunterstützung durch Transformers 5.13.0 sowie schnellere Inferenz auf NVIDIA- und AMD-Hardware.
- Die OpenAI-kompatible API erhält \`bad_words\` unter \`/v1/completions\` sowie eine \`include_reasoning\`-Option.
- Upstream hat die Modelle TeleChat, Persimmon und Fuyu entfernt; keines davon wird in diesem Paket als Voreinstellung angeboten.

Vollständige Upstream-Versionshinweise: https://github.com/vllm-project/vllm/releases/tag/v0.26.0`,
    pl_PL: `Aktualizuje vLLM do **0.26.0**.

- Bezpieczeństwo: usuwa deserializację pickle z pamięci podręcznej na dysku, likwiduje wyścig omijający wcześniejszą poprawkę CVE oraz zabezpiecza serwer API przed nieograniczonymi listami promptów i powolną kompilacją wyrażeń regularnych.
- Stabilność: nieudana kompilacja gramatyki nie powoduje już awarii silnika.
- Szersza obsługa modeli dzięki Transformers 5.13.0 oraz szybsze wnioskowanie na sprzęcie NVIDIA i AMD.
- API zgodne z OpenAI zyskuje \`bad_words\` w \`/v1/completions\` i opcję \`include_reasoning\`.
- Upstream usunął modele TeleChat, Persimmon i Fuyu; żaden z nich nie jest oferowany jako gotowa konfiguracja w tym pakiecie.

Pełne informacje o wydaniu: https://github.com/vllm-project/vllm/releases/tag/v0.26.0`,
    fr_FR: `Met à jour vLLM vers **0.26.0**.

- Sécurité : supprime la désérialisation pickle du cache disque, corrige une situation de compétition qui contournait un correctif CVE antérieur et renforce le serveur API contre les listes d'invites non bornées et la compilation lente d'expressions régulières.
- Stabilité : l'échec de la compilation d'une grammaire ne fait plus planter le moteur.
- Prise en charge de modèles élargie grâce à Transformers 5.13.0, ainsi qu'une inférence plus rapide sur matériel NVIDIA et AMD.
- L'API compatible OpenAI gagne \`bad_words\` sur \`/v1/completions\` et une option \`include_reasoning\`.
- En amont, les modèles TeleChat, Persimmon et Fuyu ont été supprimés ; aucun n'est proposé comme préréglage dans ce paquet.

Notes de version complètes : https://github.com/vllm-project/vllm/releases/tag/v0.26.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
