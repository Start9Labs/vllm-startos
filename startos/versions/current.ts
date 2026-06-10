import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.22.1-rc.0:6',
  releaseNotes: {
    en_US: `Advances the bundled vLLM nightly build to commit 2c9c07c (still upstream 0.22.1rc0). Highlights: two security fixes — hardened image EXIF/tRNS handling and a DoS guard against audio decompression bombs in the speech-to-text endpoint. Adds /tokenize and /detokenize endpoints plus API-key authentication to the Rust frontend, fixes a DeepSeek V4 out-of-memory issue, and corrects Qwen3.5 expert-parallel weight loading. Full changes: https://github.com/vllm-project/vllm/compare/d8218b1...2c9c07c`,
    es_ES: `Avanza la compilación nightly de vLLM incluida al commit 2c9c07c (sigue siendo upstream 0.22.1rc0). Novedades: dos correcciones de seguridad — manejo reforzado de EXIF/tRNS de imágenes y una protección DoS contra bombas de descompresión de audio en el endpoint de voz a texto. Añade los endpoints /tokenize y /detokenize y la autenticación por clave de API al frontend de Rust, corrige un problema de falta de memoria en DeepSeek V4 y arregla la carga de pesos en paralelo de expertos de Qwen3.5. Cambios completos: https://github.com/vllm-project/vllm/compare/d8218b1...2c9c07c`,
    de_DE: `Aktualisiert den gebündelten vLLM-Nightly-Build auf Commit 2c9c07c (weiterhin Upstream 0.22.1rc0). Highlights: zwei Sicherheitskorrekturen — gehärtete Bild-EXIF-/tRNS-Verarbeitung und ein DoS-Schutz gegen Audio-Dekompressionsbomben im Speech-to-Text-Endpunkt. Ergänzt die Endpunkte /tokenize und /detokenize sowie API-Schlüssel-Authentifizierung im Rust-Frontend, behebt ein DeepSeek-V4-Speicherproblem und korrigiert das Laden der Expert-Parallel-Gewichte von Qwen3.5. Vollständige Änderungen: https://github.com/vllm-project/vllm/compare/d8218b1...2c9c07c`,
    pl_PL: `Aktualizuje dołączoną kompilację nightly vLLM do commitu 2c9c07c (nadal upstream 0.22.1rc0). Najważniejsze: dwie poprawki bezpieczeństwa — wzmocniona obsługa EXIF/tRNS obrazów oraz zabezpieczenie DoS przed bombami dekompresji audio w endpointcie mowy na tekst. Dodaje endpointy /tokenize i /detokenize oraz uwierzytelnianie kluczem API do frontendu Rust, naprawia problem braku pamięci w DeepSeek V4 i poprawia ładowanie wag równoległości ekspertów Qwen3.5. Pełne zmiany: https://github.com/vllm-project/vllm/compare/d8218b1...2c9c07c`,
    fr_FR: `Met à jour la version nightly de vLLM incluse vers le commit 2c9c07c (toujours upstream 0.22.1rc0). Points forts : deux correctifs de sécurité — traitement renforcé des EXIF/tRNS d'images et une protection DoS contre les bombes de décompression audio dans l'endpoint speech-to-text. Ajoute les endpoints /tokenize et /detokenize ainsi que l'authentification par clé API au frontend Rust, corrige un problème de mémoire insuffisante sur DeepSeek V4 et corrige le chargement des poids en parallélisme d'experts de Qwen3.5. Changements complets : https://github.com/vllm-project/vllm/compare/d8218b1...2c9c07c`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
