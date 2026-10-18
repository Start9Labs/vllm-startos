import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.32.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.32.0** across NVIDIA, AMD and CPU variants.

- Security fixes address chat-template resource exhaustion, tokenizer bounds and peer-socket exhaustion; untrusted images are restricted to raster formats.
- Faster tokenizer loading from cached snapshots, broader low-precision KV-cache support and Model Runner V2 by default on AMD.
- Cross-origin browser clients must now be allowed explicitly. Use Set Model → Custom and add, for example, --allowed-origins '["https://chat.example.com"]' to your model arguments. Server-to-server clients are unaffected.
- Before updating a Custom selection, remove --mamba-cache-mode all and the retired compilation pass settings enable_sp, fuse_gemm_comms and sp_min_token_num. Cascade attention is removed; --disable-cascade-attn is accepted only as a deprecated no-op. Saved arguments are not rewritten automatically.
- API clients: max_tokens is an output ceiling rather than a context reservation. Responses API reasoning streams use response.content_part.added/done with part.type="reasoning_text" instead of response.reasoning_part.added/done.

[Full upstream release notes](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)`,
    es_ES: `Actualiza vLLM a **0.32.0** en las variantes NVIDIA, AMD y CPU.

- Las correcciones de seguridad abordan el agotamiento de recursos en plantillas de chat, los límites del tokenizador y el agotamiento de sockets entre pares; las imágenes no confiables se restringen a formatos ráster.
- Carga más rápida del tokenizador desde instantáneas en caché, mayor compatibilidad con cachés KV de baja precisión y Model Runner V2 por defecto en AMD.
- Los clientes de navegador de otro origen deben autorizarse explícitamente. Use Establecer modelo → Personalizado y añada, por ejemplo, --allowed-origins '["https://chat.example.com"]' a los argumentos del modelo. Los clientes de servidor a servidor no se ven afectados.
- Antes de actualizar una selección personalizada, elimine --mamba-cache-mode all y los ajustes de pasadas de compilación retirados enable_sp, fuse_gemm_comms y sp_min_token_num. Se elimina la atención en cascada; --disable-cascade-attn solo se acepta como opción obsoleta sin efecto. Los argumentos guardados no se reescriben automáticamente.
- Clientes API: max_tokens limita la salida en lugar de reservar contexto. Los flujos de razonamiento de la API Responses usan response.content_part.added/done con part.type="reasoning_text" en lugar de response.reasoning_part.added/done.

[Notas de la versión completas](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)`,
    de_DE: `Aktualisiert vLLM für NVIDIA, AMD und CPU auf **0.32.0**.

- Sicherheitskorrekturen verhindern Ressourcenerschöpfung durch Chat-Vorlagen, korrigieren Tokenizer-Grenzen und begrenzen Peer-Sockets; nicht vertrauenswürdige Bilder sind auf Rasterformate beschränkt.
- Schnelleres Laden des Tokenizers aus zwischengespeicherten Snapshots, breitere Unterstützung für KV-Caches mit niedriger Präzision und Model Runner V2 als Standard auf AMD.
- Browser-Clients anderer Ursprünge müssen ausdrücklich zugelassen werden. Unter Modell festlegen → Benutzerdefiniert beispielsweise --allowed-origins '["https://chat.example.com"]' zu den Modellargumenten hinzufügen. Server-zu-Server-Clients sind nicht betroffen.
- Vor dem Update einer benutzerdefinierten Auswahl --mamba-cache-mode all und die entfernten Kompilierungspass-Einstellungen enable_sp, fuse_gemm_comms und sp_min_token_num entfernen. Cascade Attention entfällt; --disable-cascade-attn wird nur noch als veraltete Option ohne Wirkung akzeptiert. Gespeicherte Argumente werden nicht automatisch umgeschrieben.
- API-Clients: max_tokens begrenzt die Ausgabe, statt Kontext zu reservieren. Reasoning-Streams der Responses-API verwenden response.content_part.added/done mit part.type="reasoning_text" statt response.reasoning_part.added/done.

[Vollständige Upstream-Versionshinweise](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)`,
    pl_PL: `Aktualizuje vLLM do **0.32.0** w wariantach NVIDIA, AMD i CPU.

- Poprawki bezpieczeństwa eliminują wyczerpywanie zasobów przez szablony czatu, korygują granice tokenizatora i ograniczają gniazda połączeń między węzłami; niezaufane obrazy są ograniczone do formatów rastrowych.
- Szybsze ładowanie tokenizatora z lokalnych migawek, szersza obsługa pamięci KV o niskiej precyzji oraz Model Runner V2 domyślnie na AMD.
- Klientów przeglądarkowych z innego źródła trzeba jawnie dopuścić. W Ustaw model → Niestandardowe dodaj do argumentów modelu na przykład --allowed-origins '["https://chat.example.com"]'. Nie dotyczy to klientów komunikujących się między serwerami.
- Przed aktualizacją niestandardowego wyboru usuń --mamba-cache-mode all oraz wycofane ustawienia przebiegów kompilacji enable_sp, fuse_gemm_comms i sp_min_token_num. Usunięto uwagę kaskadową; --disable-cascade-attn jest przyjmowane jedynie jako przestarzała opcja bez działania. Zapisane argumenty nie są automatycznie przepisywane.
- Klienci API: max_tokens ogranicza wyjście zamiast rezerwować kontekst. Strumienie rozumowania API Responses używają response.content_part.added/done z part.type="reasoning_text" zamiast response.reasoning_part.added/done.

[Pełne informacje o wydaniu upstream](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)`,
    fr_FR: `Met à jour vLLM vers **0.32.0** pour les variantes NVIDIA, AMD et CPU.

- Les correctifs de sécurité empêchent l'épuisement des ressources par les modèles de chat, corrigent les limites du tokenizer et limitent les sockets entre pairs ; les images non fiables sont limitées aux formats matriciels.
- Chargement plus rapide du tokenizer depuis les instantanés en cache, prise en charge élargie des caches KV à faible précision et Model Runner V2 par défaut sur AMD.
- Les clients de navigateur d'une autre origine doivent être autorisés explicitement. Dans Définir le modèle → Personnalisé, ajoutez par exemple --allowed-origins '["https://chat.example.com"]' aux arguments du modèle. Les clients serveur à serveur ne sont pas concernés.
- Avant de mettre à jour une sélection personnalisée, retirez --mamba-cache-mode all et les paramètres de passes de compilation supprimés enable_sp, fuse_gemm_comms et sp_min_token_num. L'attention en cascade est supprimée ; --disable-cascade-attn reste accepté uniquement comme option obsolète sans effet. Les arguments enregistrés ne sont pas réécrits automatiquement.
- Clients API : max_tokens plafonne la sortie au lieu de réserver du contexte. Les flux de raisonnement de l'API Responses utilisent response.content_part.added/done avec part.type="reasoning_text" au lieu de response.reasoning_part.added/done.

[Notes de version complètes en amont](https://github.com/vllm-project/vllm/releases/tag/v0.32.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
