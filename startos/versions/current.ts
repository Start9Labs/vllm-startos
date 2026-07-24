import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.23.1-rc.0:13',
  releaseNotes: {
    en_US: `Advanced the pinned vLLM nightly build to upstream commit \`9e57de7\`.

- Moves all three variants — NVIDIA (CUDA), AMD (ROCm) and CPU — to the same upstream commit, picking up roughly 460 commits of engine, model-support and stability work.
- The upstream release version is unchanged (still 0.23.1rc0); vLLM has not cut a newer release on this branch, so this is a build refresh rather than a new vLLM release.

vLLM does not publish changelogs for nightly builds.`,
    es_ES: `Actualiza la compilación nocturna fijada de vLLM al commit \`9e57de7\`.

- Lleva las tres variantes —NVIDIA (CUDA), AMD (ROCm) y CPU— al mismo commit de origen, incorporando unos 460 commits de mejoras en el motor, la compatibilidad con modelos y la estabilidad.
- La versión de lanzamiento de origen no cambia (sigue siendo 0.23.1rc0); vLLM no ha publicado una versión más reciente en esta rama, por lo que se trata de una actualización de compilación y no de una nueva versión de vLLM.

vLLM no publica registros de cambios para las compilaciones nocturnas.`,
    de_DE: `Hebt den fixierten vLLM-Nightly-Build auf den Upstream-Commit \`9e57de7\` an.

- Bringt alle drei Varianten – NVIDIA (CUDA), AMD (ROCm) und CPU – auf denselben Upstream-Commit und übernimmt dabei rund 460 Commits mit Verbesserungen an Engine, Modellunterstützung und Stabilität.
- Die Upstream-Release-Version bleibt unverändert (weiterhin 0.23.1rc0); vLLM hat auf diesem Zweig keine neuere Version veröffentlicht, es handelt sich also um eine Build-Auffrischung und nicht um ein neues vLLM-Release.

vLLM veröffentlicht keine Änderungsprotokolle für Nightly-Builds.`,
    pl_PL: `Podnosi przypiętą kompilację nocną vLLM do commita \`9e57de7\`.

- Przenosi wszystkie trzy warianty — NVIDIA (CUDA), AMD (ROCm) i CPU — na ten sam commit źródłowy, obejmując około 460 commitów z ulepszeniami silnika, obsługi modeli i stabilności.
- Wersja wydania źródłowego nie ulega zmianie (nadal 0.23.1rc0); vLLM nie wydał nowszej wersji na tej gałęzi, więc jest to odświeżenie kompilacji, a nie nowe wydanie vLLM.

vLLM nie publikuje list zmian dla kompilacji nocnych.`,
    fr_FR: `Fait passer la version nightly épinglée de vLLM au commit amont \`9e57de7\`.

- Amène les trois variantes — NVIDIA (CUDA), AMD (ROCm) et CPU — au même commit amont, en intégrant environ 460 commits d'améliorations du moteur, de la prise en charge des modèles et de la stabilité.
- La version de publication amont reste inchangée (toujours 0.23.1rc0) : vLLM n'a pas publié de version plus récente sur cette branche, il s'agit donc d'une actualisation de build et non d'une nouvelle version de vLLM.

vLLM ne publie pas de journal des modifications pour les versions nightly.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
