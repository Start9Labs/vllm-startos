import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.23.1-rc.0:10',
  releaseNotes: {
    en_US:
      'The AMD GPU (ROCm) variant is now offered only to discrete AMD GPUs. Servers whose only AMD graphics are integrated (such as the Radeon 680M in many Ryzen mini-PCs), where the ROCm build cannot run, now use the CPU variant instead.',
    es_ES:
      'La variante de GPU AMD (ROCm) ahora solo se ofrece a GPU AMD dedicadas. Los servidores cuyos únicos gráficos AMD son integrados (como la Radeon 680M de muchos mini-PC Ryzen), donde la compilación ROCm no puede ejecutarse, ahora usan la variante de CPU.',
    de_DE:
      'Die AMD-GPU-Variante (ROCm) wird jetzt nur noch für dedizierte AMD-GPUs angeboten. Server, deren einzige AMD-Grafik integriert ist (etwa die Radeon 680M in vielen Ryzen-Mini-PCs), auf denen der ROCm-Build nicht läuft, nutzen nun die CPU-Variante.',
    pl_PL:
      'Wariant GPU AMD (ROCm) jest teraz oferowany tylko dla dedykowanych układów AMD. Serwery, których jedyna grafika AMD jest zintegrowana (np. Radeon 680M w wielu mini-PC Ryzen), gdzie kompilacja ROCm nie może działać, korzystają teraz z wariantu CPU.',
    fr_FR:
      "La variante GPU AMD (ROCm) n'est désormais proposée qu'aux GPU AMD dédiés. Les serveurs dont la seule puce graphique AMD est intégrée (comme la Radeon 680M de nombreux mini-PC Ryzen), où le build ROCm ne peut pas fonctionner, utilisent maintenant la variante CPU.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
