import { VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { qwen3Original } from '../utils'

export const v_0_33_0_0 = VersionInfo.of({
  version: '0.33.0:0',
  releaseNotes: {
    en_US: `Updates vLLM to **0.33.0**.

- Faster startup and inference, broader model support, token embeddings with optional late chunking, and the new OpenAI-compatible /v1/decisions endpoint.
- Security: limits downloaded and decoded media bytes per request. Upstream images now include fixed CA stores and certifi, so the temporary eMudhra workaround is removed without restoring trust in the compromised root.
- NVIDIA images use CUDA 13.0; AMD images now require a ROCm 10.0-compatible host.
- Fixes Qwen3 30B-A3B startup failures on Blackwell and AMD by capping the original checkpoints at their native 40,960-token context. Oversized saved preset selections are repaired automatically; Custom selections are unchanged.
- Custom configurations: Medusa, the MLP speculator and the legacy Ray compiled-graph executor are removed. Remove VLLM_USE_RAY_V2_EXECUTOR_BACKEND; --mamba-cache-mode no longer has any effect. Requests made while generation is paused now return HTTP 503. Remove VLLM_ROCM_AITER_MLA_DCP_VERIFY, VLLM_ROCM_USE_AITER_FP4_ASM_GEMM and VLLM_ROCM_AITER_MEGA_MOE_FUSE_SHARED_EXPERTS; replace VLLM_ROCM_MONO_DECODE with --monokernel.
- Internal: updates start-sdk to 3.1.1.

Full upstream changes: https://github.com/vllm-project/vllm/compare/v0.32.0...v0.33.0`,
    es_ES: `Actualiza vLLM a **0.33.0**.

- Arranque e inferencia más rápidos, mayor compatibilidad de modelos, embeddings de tokens con fragmentación tardía opcional y el nuevo endpoint /v1/decisions compatible con OpenAI.
- Seguridad: limita los bytes de medios descargados y decodificados por petición. Las imágenes oficiales ya incluyen almacenes de CA y certifi corregidos, por lo que se elimina la solución temporal para eMudhra sin volver a confiar en la raíz comprometida.
- Las imágenes NVIDIA usan CUDA 13.0; las imágenes AMD ahora requieren un servidor compatible con ROCm 10.0.
- Corrige fallos de arranque de Qwen3 30B-A3B en Blackwell y AMD al limitar los modelos originales a su contexto nativo de 40.960 tokens. Los preajustes guardados que lo exceden se corrigen automáticamente; las selecciones personalizadas no cambian.
- Configuraciones personalizadas: se eliminan Medusa, el especulador MLP y el antiguo ejecutor de grafos compilados de Ray. Elimine VLLM_USE_RAY_V2_EXECUTOR_BACKEND; --mamba-cache-mode ya no tiene efecto. Las peticiones realizadas mientras la generación está en pausa ahora devuelven HTTP 503. Elimine VLLM_ROCM_AITER_MLA_DCP_VERIFY, VLLM_ROCM_USE_AITER_FP4_ASM_GEMM y VLLM_ROCM_AITER_MEGA_MOE_FUSE_SHARED_EXPERTS; sustituya VLLM_ROCM_MONO_DECODE por --monokernel.
- Interno: actualiza start-sdk a 3.1.1.

Cambios completos: https://github.com/vllm-project/vllm/compare/v0.32.0...v0.33.0`,
    de_DE: `Aktualisiert vLLM auf **0.33.0**.

- Schnellerer Start und schnellere Inferenz, breitere Modellunterstützung, Token-Embeddings mit optionalem Late Chunking und der neue OpenAI-kompatible Endpunkt /v1/decisions.
- Sicherheit: begrenzt heruntergeladene und dekodierte Medienbytes pro Anfrage. Die Upstream-Images enthalten nun korrigierte CA-Speicher und certifi; der vorübergehende eMudhra-Workaround entfällt, ohne der kompromittierten Stammzertifizierungsstelle erneut zu vertrauen.
- NVIDIA-Images verwenden CUDA 13.0; AMD-Images erfordern nun einen ROCm-10.0-kompatiblen Host.
- Behebt Startfehler von Qwen3 30B-A3B auf Blackwell und AMD, indem die ursprünglichen Checkpoints auf ihre native Kontextlänge von 40.960 Tokens begrenzt werden. Zu große gespeicherte Voreinstellungen werden automatisch korrigiert; benutzerdefinierte Auswahlen bleiben unverändert.
- Benutzerdefinierte Konfigurationen: Medusa, der MLP-Spekulator und der alte Ray-Executor für kompilierte Graphen wurden entfernt. VLLM_USE_RAY_V2_EXECUTOR_BACKEND entfernen; --mamba-cache-mode hat keine Wirkung mehr. Anfragen während pausierter Generierung liefern nun HTTP 503. VLLM_ROCM_AITER_MLA_DCP_VERIFY, VLLM_ROCM_USE_AITER_FP4_ASM_GEMM und VLLM_ROCM_AITER_MEGA_MOE_FUSE_SHARED_EXPERTS entfernen; VLLM_ROCM_MONO_DECODE durch --monokernel ersetzen.
- Intern: aktualisiert start-sdk auf 3.1.1.

Alle Upstream-Änderungen: https://github.com/vllm-project/vllm/compare/v0.32.0...v0.33.0`,
    pl_PL: `Aktualizuje vLLM do **0.33.0**.

- Szybsze uruchamianie i wnioskowanie, szersza obsługa modeli, embeddingi tokenów z opcjonalnym późnym dzieleniem na fragmenty oraz nowy endpoint /v1/decisions zgodny z OpenAI.
- Bezpieczeństwo: ogranicza liczbę pobranych i zdekodowanych bajtów multimediów na żądanie. Obrazy upstream zawierają już poprawione magazyny CA i certifi, więc tymczasowe obejście dla eMudhra zostaje usunięte bez przywracania zaufania do przejętego certyfikatu głównego.
- Obrazy NVIDIA używają CUDA 13.0; obrazy AMD wymagają teraz hosta zgodnego z ROCm 10.0.
- Naprawia błędy uruchamiania Qwen3 30B-A3B na Blackwell i AMD, ograniczając oryginalne modele do ich natywnego kontekstu 40 960 tokenów. Zapisane gotowe konfiguracje przekraczające limit są automatycznie poprawiane; własne konfiguracje pozostają bez zmian.
- Własne konfiguracje: usunięto Medusa, spekulator MLP i stary wykonawca skompilowanych grafów Ray. Usuń VLLM_USE_RAY_V2_EXECUTOR_BACKEND; --mamba-cache-mode nie ma już efektu. Żądania podczas wstrzymanej generacji zwracają teraz HTTP 503. Usuń VLLM_ROCM_AITER_MLA_DCP_VERIFY, VLLM_ROCM_USE_AITER_FP4_ASM_GEMM i VLLM_ROCM_AITER_MEGA_MOE_FUSE_SHARED_EXPERTS; zastąp VLLM_ROCM_MONO_DECODE opcją --monokernel.
- Wewnętrzne: aktualizuje start-sdk do 3.1.1.

Pełna lista zmian upstream: https://github.com/vllm-project/vllm/compare/v0.32.0...v0.33.0`,
    fr_FR: `Met à jour vLLM vers **0.33.0**.

- Démarrage et inférence plus rapides, prise en charge élargie des modèles, embeddings de tokens avec découpage tardif facultatif et nouveau point d'accès /v1/decisions compatible OpenAI.
- Sécurité : limite les octets de médias téléchargés et décodés par requête. Les images en amont incluent désormais des magasins de CA et certifi corrigés ; le contournement temporaire pour eMudhra est supprimé sans rétablir la confiance dans la racine compromise.
- Les images NVIDIA utilisent CUDA 13.0 ; les images AMD nécessitent désormais un hôte compatible ROCm 10.0.
- Corrige les échecs de démarrage de Qwen3 30B-A3B sur Blackwell et AMD en limitant les modèles d'origine à leur contexte natif de 40 960 tokens. Les préréglages enregistrés dépassant cette limite sont corrigés automatiquement ; les sélections personnalisées restent inchangées.
- Configurations personnalisées : Medusa, le spéculateur MLP et l'ancien exécuteur de graphes compilés Ray sont supprimés. Retirez VLLM_USE_RAY_V2_EXECUTOR_BACKEND ; --mamba-cache-mode n'a plus d'effet. Les requêtes pendant une pause de génération renvoient désormais HTTP 503. Retirez VLLM_ROCM_AITER_MLA_DCP_VERIFY, VLLM_ROCM_USE_AITER_FP4_ASM_GEMM et VLLM_ROCM_AITER_MEGA_MOE_FUSE_SHARED_EXPERTS ; remplacez VLLM_ROCM_MONO_DECODE par --monokernel.
- Interne : met à jour start-sdk vers 3.1.1.

Tous les changements en amont : https://github.com/vllm-project/vllm/compare/v0.32.0...v0.33.0`,
  },
  migrations: {
    up: async ({ effects }) => {
      await storeJson.update(effects, (store) => {
        if (store?.modelSelection?.selection !== 'qwen3-30b-a3b') return null
        const args = store.serveArgs
        if (
          !args ||
          (args[0] !== qwen3Original.nvfp4Model &&
            args[0] !== qwen3Original.fp8Model)
        ) {
          return null
        }
        const index = args.indexOf('--max-model-len')
        const contextLength = Number(args[index + 1])
        if (
          index < 0 ||
          !Number.isFinite(contextLength) ||
          contextLength <= qwen3Original.maxContextLength
        ) {
          return null
        }
        const serveArgs = [...args]
        serveArgs[index + 1] = String(qwen3Original.maxContextLength)
        return { ...store, serveArgs }
      })
    },
    down: async ({ effects }) => {},
  },
})
