import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.29.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.29.0**.

- Model Runner V2 is now the default for nearly all models, with better KV-cache sizing, lower sampling memory use and broader speculative-decoding support. The default batched-token budget also increases from 8192 to 16384, and prefix caching is enabled by default for Mamba models.
- Adds Muse Glimmer, Ling 3.0 Flash, Dots3, Interns2mobius, Hy4-preview, Qwen3.8-Flash-Next, GraniteSWA, GraniteMoeSWA, NemotronH Omni Reasoning V3 and Kimi K3 NVFP4 support.
- AMD moves to torch 2.12 / triton 3.7, adds Qwen3.8 and Kimi K3, runs DeepSeek V4 on gfx11 and gfx950, and gains dual-stream decode with hipgraphs.
- Adds queue admission controls, per-request speculative-decoding metrics, render endpoints for Anthropic Messages and Cohere Chat, and keep-alive comments on idle event streams.
- Improves OpenAI API compatibility and rejects more malformed requests with client errors instead of server errors.
- Protects the server better by fixing an audio sample-rate denial of service, redacting API and HuggingFace credentials from logs, rejecting oversized media earlier and limiting \`cache_salt\` to prevent scheduler exhaustion.
- FlashInfer all-reduce is now on by default for eligible CUDA tensor-parallel groups.
- Ten deprecated model architectures and the PyAV video decoder were removed. Custom video workloads must use OpenCV or TorchCodec. Drop \`calculate_kv_scales\`, \`override_attention_dtype\` and \`--attention-config.use_prefill_decode_attention\` if you set them as custom serve arguments.
- **Delete Model Cache** now lists cached models and their sizes, so you select one instead of typing its HuggingFace model id.
- Upstream moved bitsandbytes quantization into a separate plugin that the official images do not carry. The **Mistral Small 3.2 24B** preset on Hopper and older NVIDIA cards now uses an INT4 checkpoint that loads without it, and an existing selection is switched during the update. Choose another quantization if custom serve arguments use \`--quantization bitsandbytes\` or \`--load-format bitsandbytes\`.
- The package documentation now identifies the API-key boundary: the key covers \`/v1\`, \`/v2\` and \`/inference\`, while other endpoints on the same port answer without it.

Full upstream release notes: [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) and [v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)`,
    es_ES: `Actualiza vLLM a **0.29.0**.

- Model Runner V2 es ahora el predeterminado para casi todos los modelos, con un mejor dimensionamiento de la caché KV, menor uso de memoria durante el muestreo y una compatibilidad más amplia con la decodificación especulativa. El presupuesto de tokens por lote también aumenta de 8192 a 16384 y la caché de prefijos se activa por defecto para los modelos Mamba.
- Añade compatibilidad con Muse Glimmer, Ling 3.0 Flash, Dots3, Interns2mobius, Hy4-preview, Qwen3.8-Flash-Next, GraniteSWA, GraniteMoeSWA, NemotronH Omni Reasoning V3 y Kimi K3 NVFP4.
- AMD pasa a torch 2.12 / triton 3.7, añade Qwen3.8 y Kimi K3, ejecuta DeepSeek V4 en gfx11 y gfx950 y obtiene decodificación de doble flujo con hipgraphs.
- Añade controles de admisión de cola, métricas de decodificación especulativa por solicitud, endpoints de renderizado para Anthropic Messages y Cohere Chat, y comentarios de mantenimiento en flujos de eventos inactivos.
- Mejora la compatibilidad con la API de OpenAI y rechaza más solicitudes mal formadas con errores de cliente en lugar de errores de servidor.
- Protege mejor el servidor al corregir una denegación de servicio mediante la frecuencia de muestreo de audio, ocultar las credenciales de la API y de HuggingFace en los registros, rechazar antes los archivos multimedia demasiado grandes y limitar \`cache_salt\` para evitar el agotamiento del planificador.
- FlashInfer all-reduce está activado por defecto para los grupos de paralelismo tensorial CUDA compatibles.
- Se eliminaron diez arquitecturas de modelos obsoletas y el decodificador de vídeo PyAV. Las cargas de vídeo personalizadas deben usar OpenCV o TorchCodec. Elimina \`calculate_kv_scales\`, \`override_attention_dtype\` y \`--attention-config.use_prefill_decode_attention\` si los configuraste como argumentos personalizados.
- **Eliminar caché del modelo** ahora muestra los modelos almacenados y sus tamaños, para que selecciones uno en lugar de escribir su ID de HuggingFace.
- Upstream trasladó la cuantización bitsandbytes a un complemento separado que las imágenes oficiales no incluyen. El preajuste **Mistral Small 3.2 24B** en tarjetas NVIDIA Hopper y anteriores usa ahora un modelo INT4 que se carga sin él, y una selección existente se cambia durante la actualización. Elige otra cuantización si tus argumentos personalizados usan \`--quantization bitsandbytes\` o \`--load-format bitsandbytes\`.
- La documentación del paquete identifica ahora el límite de la clave de API: la clave cubre \`/v1\`, \`/v2\` e \`/inference\`, mientras que otros endpoints del mismo puerto responden sin ella.

Notas completas de upstream: [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) y [v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)`,
    de_DE: `Aktualisiert vLLM auf **0.29.0**.

- Model Runner V2 ist jetzt für fast alle Modelle voreingestellt und bietet eine bessere KV-Cache-Dimensionierung, geringeren Speicherbedarf beim Sampling und breitere Unterstützung für spekulative Dekodierung. Das Standardbudget für Batch-Tokens steigt außerdem von 8192 auf 16384, und Präfix-Caching ist für Mamba-Modelle standardmäßig aktiv.
- Ergänzt Unterstützung für Muse Glimmer, Ling 3.0 Flash, Dots3, Interns2mobius, Hy4-preview, Qwen3.8-Flash-Next, GraniteSWA, GraniteMoeSWA, NemotronH Omni Reasoning V3 und Kimi K3 NVFP4.
- AMD wechselt auf torch 2.12 / triton 3.7, ergänzt Qwen3.8 und Kimi K3, führt DeepSeek V4 auf gfx11 und gfx950 aus und erhält Dual-Stream-Dekodierung mit hipgraphs.
- Ergänzt Warteschlangen-Zulassungsgrenzen, Metriken zur spekulativen Dekodierung pro Anfrage, Render-Endpunkte für Anthropic Messages und Cohere Chat sowie Keep-alive-Kommentare in inaktiven Ereignisströmen.
- Verbessert die Kompatibilität mit der OpenAI-API und weist mehr fehlerhafte Anfragen mit Client- statt Serverfehlern zurück.
- Schützt den Server besser, indem ein Denial of Service über die Audio-Abtastrate behoben, API- und HuggingFace-Zugangsdaten aus Protokollen entfernt, übergroße Medien früher abgewiesen und \`cache_salt\` gegen eine Überlastung des Schedulers begrenzt werden.
- FlashInfer All-reduce ist für geeignete CUDA-Tensorparallelgruppen nun standardmäßig aktiv.
- Zehn veraltete Modellarchitekturen und der PyAV-Videodekoder wurden entfernt. Eigene Video-Workloads müssen OpenCV oder TorchCodec verwenden. Entfernen Sie \`calculate_kv_scales\`, \`override_attention_dtype\` und \`--attention-config.use_prefill_decode_attention\`, falls Sie diese als eigene Serve-Argumente gesetzt haben.
- **Modell-Cache löschen** listet jetzt zwischengespeicherte Modelle samt Größe auf, sodass Sie eines auswählen, statt seine HuggingFace-Modell-ID einzugeben.
- Upstream hat die bitsandbytes-Quantisierung in ein separates Plugin verschoben, das die offiziellen Images nicht enthalten. Die Voreinstellung **Mistral Small 3.2 24B** verwendet auf Hopper- und älteren NVIDIA-Karten jetzt ein INT4-Modell, das ohne dieses Plugin lädt; eine bestehende Auswahl wird bei der Aktualisierung umgestellt. Wählen Sie eine andere Quantisierung, wenn eigene Serve-Argumente \`--quantization bitsandbytes\` oder \`--load-format bitsandbytes\` verwenden.
- Die Paketdokumentation benennt jetzt die Grenze des API-Schlüssels: Er schützt \`/v1\`, \`/v2\` und \`/inference\`, während andere Endpunkte am selben Port ohne ihn antworten.

Vollständige Upstream-Versionshinweise: [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) und [v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)`,
    pl_PL: `Aktualizuje vLLM do **0.29.0**.

- Model Runner V2 jest teraz domyślny dla prawie wszystkich modeli i zapewnia lepsze dobieranie rozmiaru pamięci podręcznej KV, mniejsze zużycie pamięci podczas próbkowania oraz szerszą obsługę dekodowania spekulacyjnego. Domyślny budżet tokenów w partii rośnie też z 8192 do 16384, a buforowanie prefiksów jest domyślnie włączone dla modeli Mamba.
- Dodaje obsługę Muse Glimmer, Ling 3.0 Flash, Dots3, Interns2mobius, Hy4-preview, Qwen3.8-Flash-Next, GraniteSWA, GraniteMoeSWA, NemotronH Omni Reasoning V3 oraz Kimi K3 NVFP4.
- AMD przechodzi na torch 2.12 / triton 3.7, dodaje Qwen3.8 i Kimi K3, uruchamia DeepSeek V4 na gfx11 i gfx950 oraz zyskuje dwustrumieniowe dekodowanie z hipgraphs.
- Dodaje limity przyjmowania żądań do kolejki, metryki dekodowania spekulacyjnego dla poszczególnych żądań, punkty renderowania dla Anthropic Messages i Cohere Chat oraz komentarze podtrzymujące bezczynne strumienie zdarzeń.
- Poprawia zgodność z API OpenAI i odrzuca więcej błędnych żądań jako błędy klienta zamiast błędów serwera.
- Lepiej chroni serwer przez naprawienie odmowy usługi związanej z częstotliwością próbkowania dźwięku, ukrywanie danych logowania API i HuggingFace w dziennikach, wcześniejsze odrzucanie zbyt dużych multimediów oraz ograniczenie \`cache_salt\`, aby zapobiec przeciążeniu planisty.
- FlashInfer all-reduce jest domyślnie włączony dla zgodnych grup równoległości tensorowej CUDA.
- Usunięto dziesięć przestarzałych architektur modeli i dekoder wideo PyAV. Własne zastosowania wideo muszą korzystać z OpenCV lub TorchCodec. Usuń \`calculate_kv_scales\`, \`override_attention_dtype\` i \`--attention-config.use_prefill_decode_attention\`, jeśli ustawiono te niestandardowe argumenty uruchomieniowe.
- **Usuń pamięć podręczną modelu** wyświetla teraz zapisane modele wraz z ich rozmiarem, więc wybierasz jeden zamiast wpisywać jego identyfikator HuggingFace.
- Upstream przeniósł kwantyzację bitsandbytes do osobnej wtyczki, której oficjalne obrazy nie zawierają. Gotowa konfiguracja **Mistral Small 3.2 24B** na kartach NVIDIA Hopper i starszych korzysta teraz z modelu INT4, który ładuje się bez tej wtyczki, a istniejący wybór zostaje przełączony podczas aktualizacji. Wybierz inną kwantyzację, jeśli własne argumenty używają \`--quantization bitsandbytes\` lub \`--load-format bitsandbytes\`.
- Dokumentacja pakietu określa teraz granicę klucza API: klucz obejmuje \`/v1\`, \`/v2\` oraz \`/inference\`, natomiast inne punkty końcowe na tym samym porcie odpowiadają bez niego.

Pełne informacje o wydaniach upstream: [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) i [v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)`,
    fr_FR: `Met à jour vLLM vers **0.29.0**.

- Model Runner V2 devient le moteur par défaut pour presque tous les modèles, avec un meilleur dimensionnement du cache KV, une consommation mémoire réduite lors de l'échantillonnage et une prise en charge élargie du décodage spéculatif. Le budget de jetons par lot passe aussi de 8192 à 16384, et la mise en cache des préfixes est activée par défaut pour les modèles Mamba.
- Ajoute la prise en charge de Muse Glimmer, Ling 3.0 Flash, Dots3, Interns2mobius, Hy4-preview, Qwen3.8-Flash-Next, GraniteSWA, GraniteMoeSWA, NemotronH Omni Reasoning V3 et Kimi K3 NVFP4.
- AMD passe à torch 2.12 / triton 3.7, ajoute Qwen3.8 et Kimi K3, exécute DeepSeek V4 sur gfx11 et gfx950 et bénéficie du décodage à double flux avec hipgraphs.
- Ajoute des limites d'admission dans la file d'attente, des métriques de décodage spéculatif par requête, des points de rendu pour Anthropic Messages et Cohere Chat, ainsi que des commentaires de maintien de connexion sur les flux d'événements inactifs.
- Améliore la compatibilité avec l'API OpenAI et rejette davantage de requêtes mal formées avec des erreurs client plutôt que serveur.
- Protège mieux le serveur en corrigeant un déni de service lié à la fréquence d'échantillonnage audio, en masquant les identifiants API et HuggingFace dans les journaux, en rejetant plus tôt les médias trop volumineux et en limitant \`cache_salt\` pour éviter l'épuisement du planificateur.
- FlashInfer all-reduce est désormais activé par défaut pour les groupes de parallélisme tensoriel CUDA compatibles.
- Dix architectures de modèles obsolètes et le décodeur vidéo PyAV ont été supprimés. Les charges vidéo personnalisées doivent utiliser OpenCV ou TorchCodec. Retirez \`calculate_kv_scales\`, \`override_attention_dtype\` et \`--attention-config.use_prefill_decode_attention\` si vous les aviez définis comme arguments personnalisés.
- **Supprimer le cache du modèle** répertorie désormais les modèles en cache avec leur taille, afin que vous en choisissiez un au lieu de saisir son identifiant HuggingFace.
- En amont, la quantification bitsandbytes a été déplacée vers un greffon distinct que les images officielles n'embarquent pas. Le préréglage **Mistral Small 3.2 24B** utilise maintenant, sur les cartes NVIDIA Hopper et antérieures, un modèle INT4 qui se charge sans ce greffon, et une sélection existante est basculée pendant la mise à jour. Choisissez une autre quantification si vos arguments personnalisés utilisent \`--quantization bitsandbytes\` ou \`--load-format bitsandbytes\`.
- La documentation du paquet précise maintenant la limite de la clé d'API : elle couvre \`/v1\`, \`/v2\` et \`/inference\`, tandis que d'autres points de terminaison du même port répondent sans elle.

Notes de version amont complètes : [v0.28.0](https://github.com/vllm-project/vllm/releases/tag/v0.28.0) et [v0.29.0](https://github.com/vllm-project/vllm/releases/tag/v0.29.0)`,
  },
  migrations: {
    up: async () => {},
  },
})
