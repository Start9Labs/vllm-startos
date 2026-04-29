import { VersionInfo } from '@start9labs/start-sdk'

export const v_0_16_0_0_5_b0 = VersionInfo.of({
  version: '0.16.0:0.5-beta.0',
  releaseNotes: {
    en_US:
      'Expose API key on a new `public` volume (credentials.json) so dependent services like Open WebUI can read it via mountDependency.',
    es_ES:
      'Expone la clave de API en un nuevo volumen `public` (credentials.json) para que los servicios dependientes como Open WebUI puedan leerla mediante mountDependency.',
    de_DE:
      'API-Schlüssel auf einem neuen `public`-Volume (credentials.json) verfügbar machen, damit abhängige Dienste wie Open WebUI ihn über mountDependency lesen können.',
    pl_PL:
      'Udostępnia klucz API w nowym wolumenie `public` (credentials.json), aby zależne usługi, takie jak Open WebUI, mogły go odczytać przez mountDependency.',
    fr_FR:
      'Expose la clé API sur un nouveau volume `public` (credentials.json) afin que les services dépendants comme Open WebUI puissent la lire via mountDependency.',
  },
  // No migration body needed: the reactive `syncCredentials` init script
  // mirrors store.json's apiKey to the new public credentials.json on the
  // first start after upgrade.
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
