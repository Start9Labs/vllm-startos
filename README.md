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
| `rocm` | Source build via `vllm/docker/Dockerfile.rocm` | x86_64, aarch64 | AMD `amdgpu` driver (ROCm) |
| `cpu` | Source build via `vllm/docker/Dockerfile.cpu` | x86_64, aarch64 | None (CPU inference) |

The `nvidia` variant declares `nvidiaContainer: true`, so it requires the NVIDIA Container Toolkit on the StartOS host. The `rocm` variant declares an `amdgpu` hardware requirement.

`hardwareAcceleration` is `true` for the `nvidia` and `rocm` variants and `false` for `cpu`.

---

## Volume and Data Layout

| Volume | Mount point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | Model weights cache and StartOS-managed config |

Layout under `/data`:

- `models/` -- HuggingFace model cache (`HF_HUB_CACHE=/data/models`, also passed as `--download-dir`)
- `store.json` -- StartOS-managed package state (API key, current `vllm serve` argv)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Install | `pip install vllm` or run upstream container | Install from marketplace or sideload `.s9pk` |
| Configure model | CLI flags to `vllm serve` | "Set Model" action (preset or custom argv) |
| Get API key | User-provided `--api-key` | "Get API Credentials" action (key generated at install) |
| Start server | `vllm serve <model> --host 0.0.0.0 --port 8000 ...` | Automatic; argv driven by store |

On install:

1. A 22-character random API key is generated and written to `store.json`.
2. Two critical tasks are queued: **Get API Credentials** and **Set Model**.
3. Until **Set Model** runs, the daemon idles (`sleep infinity`) and the health check reports "No model selected." Selecting a model restarts the service with the chosen argv.

The first start after a model selection downloads the weights into `/data/models`. For large quantized models from a cold cache, this plus JIT compilation can take 30+ minutes; the daemon `gracePeriod` is set to 60 minutes accordingly.

---

## Configuration Management

vLLM is configured through StartOS actions, not environment variables. The complete `vllm serve` argument vector is stored in `store.json` and rebuilt on every restart.

`store.json` shape:

| Field | Type | Set by |
|-------|------|--------|
| `apiKey` | string | install (auto-generated) |
| `serveArgs` | string[] | `Set Model` action |

**Fixed by StartOS (not configurable):**

- `--host` -- always `0.0.0.0`
- `--port` -- always `8000`
- `--download-dir` -- always `/data/models`
- `HF_HUB_CACHE` -- always `/data/models`
- `--api-key` -- read from `store.apiKey`

Anything else (tensor parallelism, KV cache dtype, quantization, chat template, max-model-len, tool-call parser, etc.) is part of `serveArgs` and is set either by a curated preset or by the **Custom** option in the Set Model action.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Type | Purpose |
|-----------|------|----------|------|---------|
| vLLM API Server | 8000 | HTTP | API | OpenAI-compatible inference API |

Set the base URL in any OpenAI-compatible client to your service address with `/v1` appended, and use the API key from **Get API Credentials**.

---

## Actions (StartOS UI)

| Action | Inputs | Effect |
|--------|--------|--------|
| **Get API Credentials** | none | Returns the auto-generated API key (masked, copyable). |
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

Bundled presets: Qwen3.6 35B-A3B, Qwen3.6 27B, Qwen3-Next 80B-A3B, Qwen3 30B-A3B, Llama 3.3 70B Instruct, Mistral Small 3.2 24B Instruct.

The **Custom** option splits its input string on whitespace, so quoted JSON values won't survive -- use a preset for those.

---

## Dependencies

None.

---

## Backups and Restore

**Included in backup:** the entire `main` volume, which means the model cache and `store.json` (API key + serve args).

**Note:** model weight files are large (a single 7B AWQ model is ~4 GB; a 70B model is 35--80 GB depending on quant). Backups will be correspondingly large unless `Delete Model Cache` is run first.

On restore, the service comes back with the same API key and the same selected model. Weights are restored from the backup, so no re-download is needed.

---

## Health Checks

| Check | Method | Grace period |
|-------|--------|--------------|
| `ldconfig` (oneshot) | refreshes the linker cache so Triton can find the host-injected `libcuda.so.1` (needed on some aarch64 NVIDIA images) | -- |
| vLLM API | port 8000 listening | 60 minutes (covers cold-cache model download + JIT compile) |

Messages:

- Success: "The vLLM API is ready"
- Error (no model selected): "No model selected. Run the \"Set Model\" action."
- Error (model selected, not yet listening): "The vLLM API is not ready"

---

## Limitations and Differences

1. **Variants are mutually exclusive.** A single StartOS host runs one of `nvidia`, `rocm`, or `cpu` -- swapping requires uninstalling and reinstalling with the appropriate `.s9pk`. There is a registered migration between the cpu/rocm and nvidia variant version IDs but it does not move data automatically.
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
  rocm:
    image: source build (vllm/docker/Dockerfile.rocm)
    arches: [x86_64, aarch64]
    hardware: amdgpu
  cpu:
    image: source build (vllm/docker/Dockerfile.cpu)
    arches: [x86_64, aarch64]
volumes:
  main: /data
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
  - --api-key <store.apiKey>
actions:
  - get-api-credentials
  - set-model
  - delete-model-cache
store_file: /data/store.json
store_shape:
  apiKey: string
  serveArgs: string[]
health_check_grace_period_ms: 3600000
```
