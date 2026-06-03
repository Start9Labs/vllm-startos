import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.21.1-rc.0:1',
  releaseNotes: {
    en_US:
      'Internal: the API key is now regenerated automatically whenever it is missing, and the Set Model prompt appears whenever no model is selected (not only on first install). Removes the redundant API-key setup task, and fixes the saved model selection being cleared on restore or container rebuild.',
    es_ES:
      'Interno: la clave API ahora se regenera automáticamente cuando falta, y el aviso de Seleccionar modelo aparece siempre que no haya un modelo seleccionado (no solo en la primera instalación). Elimina la tarea redundante de configuración de la clave API y corrige que la selección de modelo guardada se borrara al restaurar o reconstruir el contenedor.',
    de_DE:
      'Intern: Der API-Schlüssel wird jetzt automatisch neu erzeugt, wenn er fehlt, und die Aufforderung „Modell auswählen“ erscheint immer, wenn kein Modell ausgewählt ist (nicht nur bei der Erstinstallation). Entfernt die überflüssige Einrichtungsaufgabe für den API-Schlüssel und behebt, dass die gespeicherte Modellauswahl bei einer Wiederherstellung oder einem Container-Neuaufbau gelöscht wurde.',
    pl_PL:
      'Wewnętrzne: klucz API jest teraz automatycznie generowany ponownie, gdy go brakuje, a monit Wybierz model pojawia się zawsze, gdy nie wybrano modelu (nie tylko przy pierwszej instalacji). Usuwa zbędne zadanie konfiguracji klucza API i naprawia usuwanie zapisanego wyboru modelu podczas przywracania lub przebudowy kontenera.',
    fr_FR:
      "Interne : la clé API est désormais régénérée automatiquement lorsqu'elle est absente, et l'invite Choisir le modèle apparaît dès qu'aucun modèle n'est sélectionné (pas seulement lors de la première installation). Supprime la tâche de configuration redondante de la clé API et corrige l'effacement de la sélection de modèle enregistrée lors d'une restauration ou d'une reconstruction du conteneur.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
