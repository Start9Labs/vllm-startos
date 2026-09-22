import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.30.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.30.0**.

- Adds support for DeepSeek V4.1 Flash, DeepSeek V4 Flash Vision, GLM 5.3 Flash, K2 Horizon, Cohere Compass, Bailing V3 VL and Nanbeige 4.2, alongside broad NVIDIA, AMD and CPU performance improvements.
- Limits validation-error responses and client-supplied sparse embeddings to reduce denial-of-service risk.
- Scale-out endpoints now require \`--enable-scale-out\`; custom configurations that use \`/render\`, \`/derender\` or \`/inference/v1/generate\` must add it. GPTQ activation ordering is no longer supported, and some YaRN models now derive shorter context limits.
- On a host with a supported AMD GPU, **Set Model** offers the curated model presets that fit the card's VRAM.
- **Custom** serve arguments follow shell quoting, so \`--foo "a b"\` and \`--bar '{"k": 1}'\` each stay one argument; nothing is expanded.
- **Set Model** also takes environment variables, such as an \`HF_TOKEN\` for a gated model or a \`VLLM_*\` tuning flag. They apply to preset and Custom selections.
- Documents that the API key also protects \`/cohere\`; unauthenticated endpoints on the same interface remain accessible.

[Full upstream release notes](https://github.com/vllm-project/vllm/releases/tag/v0.30.0)`,
    es_ES: `Actualiza vLLM a **0.30.0**.

- Añade compatibilidad con DeepSeek V4.1 Flash, DeepSeek V4 Flash Vision, GLM 5.3 Flash, K2 Horizon, Cohere Compass, Bailing V3 VL y Nanbeige 4.2, además de amplias mejoras de rendimiento para NVIDIA, AMD y CPU.
- Limita las respuestas de errores de validación y los embeddings dispersos proporcionados por el cliente para reducir el riesgo de denegación de servicio.
- Los endpoints de escalado ahora requieren \`--enable-scale-out\`; las configuraciones personalizadas que usan \`/render\`, \`/derender\` o \`/inference/v1/generate\` deben añadirlo. Ya no se admite el orden de activación de GPTQ y algunos modelos YaRN ahora calculan límites de contexto más cortos.
- En un equipo con una GPU AMD compatible, **Establecer modelo** ofrece los presets de modelo curados que caben en la VRAM de la tarjeta.
- Los argumentos de arranque **Personalizados** siguen el entrecomillado de un shell, de modo que \`--foo "a b"\` y \`--bar '{"k": 1}'\` siguen siendo un único argumento; no se expande nada.
- **Establecer modelo** también acepta variables de entorno, como un \`HF_TOKEN\` para un modelo restringido o un flag de ajuste \`VLLM_*\`. Se aplican tanto a los preajustes como a las selecciones personalizadas.
- Documenta que la clave API también protege \`/cohere\`; los endpoints no autenticados de la misma interfaz siguen siendo accesibles.

[Notas completas de upstream](https://github.com/vllm-project/vllm/releases/tag/v0.30.0)`,
    de_DE: `Aktualisiert vLLM auf **0.30.0**.

- Ergänzt Unterstützung für DeepSeek V4.1 Flash, DeepSeek V4 Flash Vision, GLM 5.3 Flash, K2 Horizon, Cohere Compass, Bailing V3 VL und Nanbeige 4.2 sowie umfassende Leistungsverbesserungen für NVIDIA, AMD und CPU.
- Begrenzt Antworten auf Validierungsfehler und vom Client bereitgestellte Sparse Embeddings, um das Risiko von Denial-of-Service-Angriffen zu verringern.
- Scale-out-Endpunkte erfordern nun \`--enable-scale-out\`; eigene Konfigurationen mit \`/render\`, \`/derender\` oder \`/inference/v1/generate\` müssen es ergänzen. GPTQ-Aktivierungsreihenfolgen werden nicht mehr unterstützt, und einige YaRN-Modelle leiten nun kürzere Kontextgrenzen ab.
- Auf einem Host mit einer unterstützten AMD-GPU bietet **Modell festlegen** die kuratierten Modell-Presets an, die in den VRAM der Karte passen.
- **Benutzerdefinierte** Serve-Argumente folgen den Anführungsregeln einer Shell, sodass \`--foo "a b"\` und \`--bar '{"k": 1}'\` jeweils ein einzelnes Argument bleiben; nichts wird expandiert.
- **Modell festlegen** nimmt auch Umgebungsvariablen entgegen, etwa ein \`HF_TOKEN\` für ein zugangsbeschränktes Modell oder ein \`VLLM_*\`-Optimierungs-Flag. Sie gelten für Voreinstellungen und benutzerdefinierte Auswahlen.
- Dokumentiert, dass der API-Schlüssel auch \`/cohere\` schützt; nicht authentifizierte Endpunkte derselben Schnittstelle bleiben erreichbar.

[Vollständige Upstream-Versionshinweise](https://github.com/vllm-project/vllm/releases/tag/v0.30.0)`,
    pl_PL: `Aktualizuje vLLM do **0.30.0**.

- Dodaje obsługę DeepSeek V4.1 Flash, DeepSeek V4 Flash Vision, GLM 5.3 Flash, K2 Horizon, Cohere Compass, Bailing V3 VL i Nanbeige 4.2 oraz liczne ulepszenia wydajności dla NVIDIA, AMD i CPU.
- Ogranicza rozmiar odpowiedzi z błędami walidacji oraz rozrzedzonych embeddingów dostarczanych przez klienta, aby zmniejszyć ryzyko odmowy usługi.
- Punkty końcowe skalowania wymagają teraz \`--enable-scale-out\`; własne konfiguracje korzystające z \`/render\`, \`/derender\` lub \`/inference/v1/generate\` muszą go dodać. Kolejność aktywacji GPTQ nie jest już obsługiwana, a niektóre modele YaRN wyznaczają teraz krótsze limity kontekstu.
- Na komputerze z obsługiwaną kartą graficzną AMD **Ustaw model** udostępnia wyselekcjonowane ustawienia modeli, które mieszczą się w pamięci VRAM karty.
- **Niestandardowe** argumenty uruchomieniowe przestrzegają reguł cytowania powłoki, więc \`--foo "a b"\` i \`--bar '{"k": 1}'\` pozostają pojedynczym argumentem; nic nie jest rozwijane.
- **Ustaw model** przyjmuje również zmienne środowiskowe, takie jak \`HF_TOKEN\` do modelu z ograniczonym dostępem albo flaga strojenia \`VLLM_*\`. Obowiązują zarówno dla gotowych konfiguracji, jak i wyborów niestandardowych.
- Dokumentuje, że klucz API chroni również \`/cohere\`; nieuwierzytelnione punkty końcowe tego samego interfejsu pozostają dostępne.

[Pełne informacje o wydaniu upstream](https://github.com/vllm-project/vllm/releases/tag/v0.30.0)`,
    fr_FR: `Met à jour vLLM vers **0.30.0**.

- Ajoute la prise en charge de DeepSeek V4.1 Flash, DeepSeek V4 Flash Vision, GLM 5.3 Flash, K2 Horizon, Cohere Compass, Bailing V3 VL et Nanbeige 4.2, ainsi que de nombreuses améliorations de performances pour NVIDIA, AMD et CPU.
- Limite les réponses d'erreur de validation et les embeddings creux fournis par le client afin de réduire le risque de déni de service.
- Les endpoints de mise à l'échelle nécessitent désormais \`--enable-scale-out\` ; les configurations personnalisées utilisant \`/render\`, \`/derender\` ou \`/inference/v1/generate\` doivent l'ajouter. L'ordre d'activation GPTQ n'est plus pris en charge et certains modèles YaRN calculent maintenant des limites de contexte plus courtes.
- Sur un hôte doté d'un GPU AMD pris en charge, **Définir le modèle** propose les préréglages de modèles sélectionnés qui tiennent dans la VRAM de la carte.
- Les arguments de démarrage **Personnalisés** suivent les règles de guillemets d'un shell, si bien que \`--foo "a b"\` et \`--bar '{"k": 1}'\` restent chacun un seul argument ; rien n'est développé.
- **Définir le modèle** accepte aussi des variables d'environnement, comme un \`HF_TOKEN\` pour un modèle à accès restreint ou un indicateur de réglage \`VLLM_*\`. Elles s'appliquent aux préréglages comme aux sélections personnalisées.
- Indique que la clé API protège aussi \`/cohere\` ; les endpoints non authentifiés de la même interface restent accessibles.

[Notes de version amont complètes](https://github.com/vllm-project/vllm/releases/tag/v0.30.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: async ({ effects }) => {},
  },
})
