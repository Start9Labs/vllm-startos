import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.27.1:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.27.1**.

- New model support: Kimi K3, Qwen3.5 (dense and MoE), K-EXAONE-2.0, VaultGemma and jina-embeddings-v5, on top of PyTorch 2.13 and Transformers 5.14.1.
- Faster first request: kernels are now warmed up at startup, removing the compilation stall that used to hit the first prompt.
- The OpenAI-compatible API gains Cohere chat v2 support, a per-request \`stream_interval\` option and clearer request errors; startup logging is much quieter.
- AMD: ROCm adds gfx1250 support along with several accuracy and performance fixes.
- Upstream removed the Plamo2 and Ouro models and the \`--max-num-partial-prefills\` / \`--max-long-partial-prefills\` flags. Neither model is offered as a preset here, but drop those flags if you set them as custom serve arguments.
- 0.27.1 is a patch release adding support for quantized DSpark Markov heads.

Full upstream release notes: https://github.com/vllm-project/vllm/releases/tag/v0.27.1`,
    es_ES: `Actualiza vLLM a **0.27.1**.

- Nuevos modelos compatibles: Kimi K3, Qwen3.5 (denso y MoE), K-EXAONE-2.0, VaultGemma y jina-embeddings-v5, sobre PyTorch 2.13 y Transformers 5.14.1.
- Primera petición más rápida: los kernels se precalientan al arrancar, eliminando la pausa de compilación que afectaba al primer prompt.
- La API compatible con OpenAI incorpora soporte para Cohere chat v2, una opción \`stream_interval\` por petición y errores de petición más claros; el registro de arranque es mucho menos ruidoso.
- AMD: ROCm añade soporte para gfx1250 junto con varias correcciones de precisión y rendimiento.
- Upstream eliminó los modelos Plamo2 y Ouro y las opciones \`--max-num-partial-prefills\` / \`--max-long-partial-prefills\`. Ninguno de esos modelos se ofrece como preajuste aquí, pero elimina esas opciones si las habías añadido como argumentos personalizados.
- 0.27.1 es una versión de mantenimiento que añade soporte para cabezales Markov DSpark cuantizados.

Notas de la versión completas: https://github.com/vllm-project/vllm/releases/tag/v0.27.1`,
    de_DE: `Aktualisiert vLLM auf **0.27.1**.

- Neue Modellunterstützung: Kimi K3, Qwen3.5 (dicht und MoE), K-EXAONE-2.0, VaultGemma und jina-embeddings-v5, auf Basis von PyTorch 2.13 und Transformers 5.14.1.
- Schnellere erste Anfrage: Kernel werden beim Start vorgewärmt, wodurch die Kompilierungspause beim ersten Prompt entfällt.
- Die OpenAI-kompatible API erhält Unterstützung für Cohere Chat v2, eine \`stream_interval\`-Option pro Anfrage und verständlichere Anfragefehler; die Startprotokollierung ist deutlich ruhiger.
- AMD: ROCm unterstützt nun gfx1250 und bringt mehrere Genauigkeits- und Leistungskorrekturen.
- Upstream hat die Modelle Plamo2 und Ouro sowie die Optionen \`--max-num-partial-prefills\` / \`--max-long-partial-prefills\` entfernt. Keines dieser Modelle wird hier als Voreinstellung angeboten; entfernen Sie diese Optionen jedoch, falls Sie sie als eigene Serve-Argumente gesetzt haben.
- 0.27.1 ist eine Patch-Version, die Unterstützung für quantisierte DSpark-Markov-Köpfe ergänzt.

Vollständige Upstream-Versionshinweise: https://github.com/vllm-project/vllm/releases/tag/v0.27.1`,
    pl_PL: `Aktualizuje vLLM do **0.27.1**.

- Obsługa nowych modeli: Kimi K3, Qwen3.5 (gęste i MoE), K-EXAONE-2.0, VaultGemma oraz jina-embeddings-v5, w oparciu o PyTorch 2.13 i Transformers 5.14.1.
- Szybsze pierwsze zapytanie: jądra obliczeniowe są rozgrzewane przy starcie, co eliminuje przestój na kompilację przy pierwszym prompcie.
- API zgodne z OpenAI zyskuje obsługę Cohere chat v2, opcję \`stream_interval\` na zapytanie oraz czytelniejsze komunikaty o błędach; logi startowe są znacznie mniej hałaśliwe.
- AMD: ROCm dodaje obsługę gfx1250 oraz kilka poprawek dokładności i wydajności.
- Upstream usunął modele Plamo2 i Ouro oraz opcje \`--max-num-partial-prefills\` / \`--max-long-partial-prefills\`. Żaden z tych modeli nie jest tu oferowany jako gotowa konfiguracja, ale usuń te opcje, jeśli ustawiono je jako własne argumenty uruchomieniowe.
- 0.27.1 to wydanie poprawkowe dodające obsługę skwantyzowanych głowic Markowa DSpark.

Pełne informacje o wydaniu: https://github.com/vllm-project/vllm/releases/tag/v0.27.1`,
    fr_FR: `Met à jour vLLM vers **0.27.1**.

- Nouveaux modèles pris en charge : Kimi K3, Qwen3.5 (dense et MoE), K-EXAONE-2.0, VaultGemma et jina-embeddings-v5, sur la base de PyTorch 2.13 et Transformers 5.14.1.
- Première requête plus rapide : les noyaux sont préchauffés au démarrage, ce qui supprime la pause de compilation qui affectait la première invite.
- L'API compatible OpenAI gagne la prise en charge de Cohere chat v2, une option \`stream_interval\` par requête et des erreurs de requête plus claires ; les journaux de démarrage sont bien moins bavards.
- AMD : ROCm ajoute la prise en charge de gfx1250 ainsi que plusieurs correctifs de précision et de performance.
- En amont, les modèles Plamo2 et Ouro ainsi que les options \`--max-num-partial-prefills\` / \`--max-long-partial-prefills\` ont été supprimés. Aucun de ces modèles n'est proposé comme préréglage ici, mais retirez ces options si vous les aviez ajoutées comme arguments personnalisés.
- 0.27.1 est une version corrective qui ajoute la prise en charge des têtes de Markov DSpark quantifiées.

Notes de version complètes : https://github.com/vllm-project/vllm/releases/tag/v0.27.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
