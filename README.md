<p align="center">
  <img src="icon.svg" alt="vLLM Logo" width="21%">
</p>

# vLLM on StartOS

> **Upstream docs:** <https://docs.vllm.ai/>
>
> Everything not listed in this document should behave the same as upstream
> vLLM. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[vLLM](https://github.com/vllm-project/vllm) is a fast and easy-to-use library for LLM inference and serving. It exposes an OpenAI-compatible HTTP API backed by PagedAttention, continuous batching, and a wide range of HuggingFace models.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Dependent Services](#dependent-services)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

vLLM ships as three variants, each a separate `.s9pk`. The variant is chosen at build time and corresponds to a different image source.

| Variant | Image source | Architectures | GPU runtime |
|---------|--------------|---------------|-------------|
| `nvidia` | Upstream container `vllm/vllm-openai` (unmodified) | x86_64, aarch64 | NVIDIA Container Toolkit |
| `rocm` | Upstream container `vllm/vllm-openai-rocm` (unmodified) | x86_64 | AMD `amdgpu` driver (ROCm) |
| `cpu` | Source build via `vllm/docker/Dockerfile.cpu` | x86_64, aarch64 | None (CPU inference) |

`nvidia` and `rocm` use vLLM's prebuilt nightly images pinned to the same commit; `cpu` has no prebuilt image at that commit and is built from the bundled `vllm/` submodule.

The `nvidia` variant declares `nvidiaContainer: true`, so it requires the NVIDIA Container Toolkit on the StartOS host, and a matching `nvidia` GPU hardware requirement. The `rocm` variant declares an `amdgpu` hardware requirement, and `cpu` declares none. Each accelerator variant carries its own distinct hardware requirement so StartOS offers the right one per host (and so all three can publish under a single version).

`hardwareAcceleration` is `true` for the `nvidia` and `rocm` variants and `false` for `cpu`.

---

## Volume and Data Layout

| Volume | Mount point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | Model weights cache and StartOS-managed private config |
| `public` | -- | Read-only-mountable file(s) for dependent services (see [Dependent Services](#dependent-services)) |

Layout under `/data` (the `main` volume):

- `models/` -- HuggingFace model cache (`HF_HUB_CACHE=/data/models`, also passed as `--download-dir`)
- `store.json` -- StartOS-managed package state (current `vllm serve` argv + remembered model selection)

The `public` volume contains:

- `credentials.json` -- `{ "apiKey": "<22-char string>" }`. The canonical home for the API key: it is generated here at install, read here by the daemon (`--api-key`) and the **Get API Key** action, and mounted read-only by dependents (see [Dependent Services](#dependent-services)).

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Install | `pip install vllm` or run upstream container | Install from marketplace or sideload `.s9pk` |
| Configure model | CLI flags to `vllm serve` | "Set Model" action (preset or custom argv) |
| Get API key | User-provided `--api-key` | "Get API Key" action (key generated at install) |
| Start server | `vllm serve <model> --host 0.0.0.0 --port 8000 ...` | Automatic; argv driven by store |

On install:

1. A 22-character random API key is generated and written to `credentials.json` on the `public` volume.
2. Two critical tasks are queued: **Get API Key** and **Set Model**.
3. Until **Set Model** runs, the daemon idles (`sleep infinity`) and the health check reports "No model selected." Selecting a model restarts the service with the chosen argv.

The first start after a model selection downloads the weights into `/data/models`. For large quantized models from a cold cache, this plus JIT compilation can take 30+ minutes; during that window the health check reports a **loading** state with a message explaining the wait, rather than a failure.

---

## Configuration Management

vLLM is configured through StartOS actions, not environment variables. The complete `vllm serve` argument vector is stored in `store.json` and rebuilt on every restart.

`store.json` shape:

| Field | Type | Set by |
|-------|------|--------|
| `serveArgs` | string[] | `Set Model` action |
| `modelSelection` | object | `Set Model` action (remembers the chosen preset to pre-fill the form) |

The API key is **not** in `store.json`; it lives in `credentials.json` on the `public` volume (see [Volume and Data Layout](#volume-and-data-layout)).

**Fixed by StartOS (not configurable):**

- `--host` -- always `0.0.0.0`
- `--port` -- always `8000`
- `--download-dir` -- always `/data/models`
- `HF_HUB_CACHE` -- always `/data/models`
- `--api-key` -- read from `credentials.json` on the `public` volume

Anything else (tensor parallelism, KV cache dtype, quantization, chat template, max-model-len, tool-call parser, etc.) is part of `serveArgs` and is set either by a curated preset or by the **Custom** option in the Set Model action.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Type | Purpose |
|-----------|------|----------|------|---------|
| vLLM API Server | 8000 | HTTP | API | OpenAI-compatible inference API |

Set the base URL in any OpenAI-compatible client to your service address with `/v1` appended, and use the API key from **Get API Key**.

---

## Actions (StartOS UI)

| Action | Inputs | Effect |
|--------|--------|--------|
| **Get API Key** | none | Returns the auto-generated API key (masked, copyable). |
| **Set Model** | preset choice _or_ custom `vllm serve` argv | Detects host hardware tier and memory, filters the preset list to compatible options, writes `serveArgs` to the store, and restarts the service. |
| **Delete Model Cache** | HuggingFace model id (e.g. `meta-llama/Llama-3.1-8B-Instruct`) | Removes `models/models--<org>--<name>` from the cache to free disk. |

### Set Model presets

The preset list is filtered against detected hardware and memory at action-open time. Hardware tiers:

| Tier | GPUs |
|------|------|
| `nvidia-blackwell` | sm_120/sm_121 -- DGX Spark, RTX 50, B100/B200 (NVFP4-capable) |
| `nvidia-hopper` | sm_90 -- H100, H200 (FP8-capable) |
| `nvidia-older` | sm_80--sm_89 -- A100, A6000, RTX 40/30 |
| `amd` | ROCm-capable, MI300+ class |
| `cpu` | no GPU detected |

Each preset specifies per-tier argv and a minimum memory budget (weights + ~30% for KV cache, activations, CUDA graphs, Python overhead). Quantizations:

- Blackwell -- NVFP4
- Hopper -- AWQ INT4
- Older NVIDIA -- AWQ INT4
- AMD -- FP8 (only quant other than GGUF that vllm-rocm supports)

Bundled presets: Qwen3.6 35B-A3B, Qwen3.6 27B, Qwen3-Next 80B-A3B, Qwen3 30B-A3B, Llama 3.3 70B Instruct, Mistral Small 3.2 24B Instruct, Nemotron 3 Elastic 30B-A3B, Gemma 4 31B Instruct, Gemma 4 26B-A4B Instruct.

The **Custom** option splits its input string on whitespace, so quoted JSON values won't survive -- use a preset for those.

---

## Dependencies

None.

---

## Dependent Services

Other StartOS packages can consume vLLM as an OpenAI-compatible backend (e.g. Open WebUI). To pick up the API key without invoking an action, mount the `public` volume read-only via `mountDependency`:

```ts
sdk.Mounts.of().mountDependency<typeof VllmManifest>({
  dependencyId: 'vllm',
  volumeId: 'public',
  subpath: null,
  mountpoint: '/vllm-public',
  readonly: true,
})
```

Then read `/vllm-public/credentials.json` and use `apiKey` to authenticate against the vLLM API.

The `public` volume is intentionally separate from `main`: `main` holds the model weights and StartOS-managed package state (`store.json`), while `public` holds only `credentials.json` — the API key, which vLLM is OK with dependents reading.

---

## Backups and Restore

**Included in backup:** the `main` volume (model cache + `store.json` serve args / model selection) **and** the `public` volume (`credentials.json`), so the API key and selected model are both preserved.

**Note:** model weight files are large (a single 7B AWQ model is ~4 GB; a 70B model is 35--80 GB depending on quant). Backups will be correspondingly large unless `Delete Model Cache` is run first.

On restore, the service comes back with the same API key and the same selected model. Weights are restored from the backup, so no re-download is needed.

---

## Health Checks

| Check | Method | Behavior while starting |
|-------|--------|-------------------------|
| `ldconfig` (oneshot) | refreshes the linker cache so Triton can find the host-injected `libcuda.so.1` (needed on some aarch64 NVIDIA images) | -- |
| vLLM API | port 8000 listening | reports **loading** for the first 35 minutes, then **failure** |

Once a model is selected, the API health check reports `loading` (not failure) while the weights download/compile, so a slow cold start doesn't look like a crash. If the port is still not listening **35 minutes** after the daemon starts, the check flips to a hard `failure` that tells the user to check the logs — a genuine hang or misconfiguration won't stay "loading" forever.

Messages:

- Success: "The vLLM API is ready"
- No model selected: "No model selected. Run the \"Set Model\" action."
- Loading (model selected, not yet listening): explains that a first-time download + load can take 30+ minutes and an already-cached load 15+ minutes, depending on hardware resources and bandwidth.
- Failure (after 35 minutes): "The vLLM API did not come up within 35 minutes. Check the service logs for errors."

---

## Limitations and Differences

1. **Variants are mutually exclusive.** A single StartOS host runs one of `nvidia`, `rocm`, or `cpu` -- swapping requires uninstalling and reinstalling with the appropriate `.s9pk`. All three variants share a single version chain, so version IDs match across variants.
2. **No CLI access.** Model management is via the **Set Model** and **Delete Model Cache** actions, not `vllm` CLI on the host.
3. **`--host`, `--port`, `--download-dir`, `--api-key` are fixed.** They cannot be overridden through the **Custom** argv input -- StartOS appends them after your args.
4. **Whitespace-only argv splitting.** The custom argv input cannot represent arguments containing spaces (notably JSON-valued flags like `--speculative-config '{"method":"..."}'`). Curated presets are the only way to use those.
5. **Cold-start time can exceed 30 minutes** for large quantized models on a cold cache. The 60-minute health-check grace period accommodates this; the service is not actually hung.
6. **CPU variant is not practical for serious inference.** It exists for testing and very small models; throughput is far below GPU variants.
7. **Memory detection.** For NVIDIA, total memory is summed across all detected GPUs. For CPU, total system RAM is used. There is no per-GPU pinning or NUMA awareness in preset selection.

---

## What Is Unchanged from Upstream

- OpenAI-compatible API surface (`/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/models`, etc.)
- PagedAttention, continuous batching, chunked prefill, prefix caching
- Quantization support (AWQ, GPTQ, FP8, NVFP4, bitsandbytes, etc.) per upstream's hardware matrix
- Tool calling, reasoning parsers, chat templates (presets pre-configure these per model family)
- HuggingFace model loading (`models/`, `tokenizers/`, etc.)
- Tensor / pipeline / data parallelism flags (pass via Custom argv)
- All upstream client library compatibility (Python, JS, Go, etc.)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: vllm
variants:
  nvidia:
    image: vllm/vllm-openai          # upstream container
    nvidia_container: true
    arches: [x86_64, aarch64]
    hardware: nvidia
  rocm:
    image: vllm/vllm-openai-rocm     # upstream container
    arches: [x86_64]
    hardware: amdgpu
  cpu:
    image: source build (vllm/docker/Dockerfile.cpu)
    arches: [x86_64]
volumes:
  main: /data
  public: (mountable read-only by dependents; contains credentials.json)
ports:
  api: 8000
dependencies: none
startos_managed_env_vars:
  - HF_HUB_CACHE=/data/models
  - PYTHONUNBUFFERED=1
  - HF_HUB_VERBOSITY=info
fixed_serve_flags:
  - --host 0.0.0.0
  - --port 8000
  - --download-dir /data/models
  - --api-key <credentials.json apiKey>
actions:
  - get-api-credentials
  - set-model
  - delete-model-cache
store_file: /data/store.json
store_shape:
  serveArgs: string[]
  modelSelection: object
public_files:
  credentials.json:
    apiKey: string          # canonical home for the API key
health_check:
  api: loading until port 8000 is up (first start can take 30+ min)
```
