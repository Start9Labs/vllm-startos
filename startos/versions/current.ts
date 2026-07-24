import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.25.1:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.25.1**, the latest stable upstream release (from the previous 0.23.1rc0 pre-release build).

- All three variants — NVIDIA (CUDA), AMD (ROCm) and CPU — now run vLLM's official prebuilt **release** images. This replaces the earlier ephemeral nightly-build pins (which Docker Hub periodically deletes, breaking package rebuilds) and the from-source CPU build, so the package builds and updates reliably going forward.`,
    es_ES: `Actualiza vLLM a **0.25.1**, la última versión estable oficial (desde la anterior compilación preliminar 0.23.1rc0).

- Las tres variantes —NVIDIA (CUDA), AMD (ROCm) y CPU— ahora ejecutan las imágenes oficiales precompiladas de **lanzamiento** de vLLM. Esto reemplaza los anclajes anteriores a compilaciones nocturnas efímeras (que Docker Hub elimina periódicamente, rompiendo las recompilaciones del paquete) y la compilación de CPU desde el código fuente, de modo que el paquete se compila y actualiza de forma fiable en adelante.`,
    de_DE: `Aktualisiert vLLM auf **0.25.1**, die neueste stabile Upstream-Version (vom vorherigen Vorabversions-Build 0.23.1rc0).

- Alle drei Varianten – NVIDIA (CUDA), AMD (ROCm) und CPU – nutzen jetzt vLLMs offizielle vorgefertigte **Release**-Images. Dies ersetzt die früheren Verweise auf kurzlebige Nightly-Builds (die Docker Hub regelmäßig löscht, was Neubauten des Pakets zerstört) sowie den CPU-Build aus dem Quellcode, sodass das Paket künftig zuverlässig gebaut und aktualisiert wird.`,
    pl_PL: `Aktualizuje vLLM do **0.25.1**, najnowszego stabilnego wydania upstream (z poprzedniej kompilacji przedpremierowej 0.23.1rc0).

- Wszystkie trzy warianty — NVIDIA (CUDA), AMD (ROCm) i CPU — korzystają teraz z oficjalnych, gotowych obrazów **wydań** vLLM. Zastępuje to wcześniejsze przypięcia do efemerycznych kompilacji nocnych (które Docker Hub okresowo usuwa, psując ponowne kompilacje pakietu) oraz kompilację CPU ze źródeł, dzięki czemu pakiet buduje się i aktualizuje niezawodnie w przyszłości.`,
    fr_FR: `Met à jour vLLM vers **0.25.1**, la dernière version stable en amont (depuis la précédente préversion 0.23.1rc0).

- Les trois variantes — NVIDIA (CUDA), AMD (ROCm) et CPU — utilisent désormais les images **de version** précompilées officielles de vLLM. Cela remplace les anciens épinglages sur des versions nightly éphémères (que Docker Hub supprime périodiquement, cassant les reconstructions du paquet) et la compilation CPU depuis les sources, afin que le paquet se construise et se mette à jour de manière fiable à l'avenir.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
