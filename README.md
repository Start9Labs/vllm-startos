<p align="center">
  <img src="icon.svg" alt="vLLM Logo" width="21%">
</p>

# vLLM on StartOS

> Everything not listed in this document should behave the same as upstream
> vLLM. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[vLLM](https://github.com/vllm-project/vllm) serves large language models over an OpenAI-compatible API. This package ships one variant per accelerator, generates an API key and publishes it where dependent services can read it, and offers model presets filtered to what your hardware can actually run.

- **Upstream repo:** <https://github.com/vllm-project/vllm>
- **Wrapper repo:** <https://github.com/Start9Labs/vllm-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Three variants, each packing one of vLLM's own prebuilt images, and **StartOS picks one for you** — the most hardware-specific variant compatible with the machine.

| Variant  | Image                   | Architectures   | Declared for                              |
| -------- | ----------------------- | --------------- | ----------------------------------------- |
| `nvidia` | `vllm/vllm-openai`      | x86_64, aarch64 | Any NVIDIA GPU                            |
| `rocm`   | `vllm/vllm-openai-rocm` | x86_64          | A discrete AMD GPU on the `amdgpu` driver |
| `cpu`    | `vllm/vllm-openai-cpu`  | x86_64          | Everything else — the sole fallback       |

| Subcontainer | Purpose                                       |
| ------------ | --------------------------------------------- |
| `vllm-sub`   | The `primary` daemon — the one to `attach` to |

All three variants track one pinned upstream release, so they stay in lockstep. Release tags are used rather than nightlies because nightly tags are garbage-collected and would break a rebuild.

**Integrated AMD GPUs are excluded on purpose.** The `rocm` requirement matches discrete families by product name — Navi, Radeon RX, Radeon VII, Instinct — because ROCm is unreliable on integrated Radeon; those machines fall back to `cpu`. It is a positive allowlist rather than an iGPU exclusion because StartOS's regex engine has no lookahead.

One oneshot, `ldconfig`, refreshes the linker cache before the daemon starts. The NVIDIA container toolkit mounts the host driver libraries into the container, but on some aarch64 images they land outside the cached search paths and Triton cannot find `libcuda.so.1` without this.

## Volume and Data Layout

Two volumes, and one of them exists to be read by other services.

| Volume   | Mount Point   | Purpose                                               |
| -------- | ------------- | ----------------------------------------------------- |
| `main`   | `/data`       | `store.json` and the downloaded model cache           |
| `public` | — (host side) | `credentials.json`; never mounted into this container |

**Model weights dominate the `main` volume** — a single model is commonly tens of gigabytes, and the cache keeps every one you have downloaded until you delete it.

The `public` volume holds only the API key, and it is there so a dependent service can mount it read-only and discover the key without invoking an action or reaching into the main volume.

## File Models

Two models, and the split between them is the interesting part.

| File               | Volume   | Format | Modelled                | Written by           |
| ------------------ | -------- | ------ | ----------------------- | -------------------- |
| `store.json`       | `main`   | JSON   | Yes — `FileHelper.json` | The Set Model action |
| `credentials.json` | `public` | JSON   | Yes — `FileHelper.json` | Init                 |

`store.json` holds the resolved `vllm serve` arguments, the environment variables to run them under, and the preset selection behind both. `credentials.json` holds the API key alone.

**The API key regenerates whenever it is missing.** Init reads it reactively and writes a new one if it is absent — so deleting the key and restarting is how you rotate it, and Get API Key only ever displays whatever is there.

**vLLM itself takes no configuration file.** Everything is command-line arguments built at daemon start, plus three environment variables pointing the HuggingFace cache at the volume and making its output unbuffered so downloads are visible in the service log. A Custom selection may add environment variables of its own; they are spread over those three, so naming one of them replaces it.

## Dependencies

None. vLLM is at the bottom of the stack — Open WebUI and similar services depend on it, not the other way round.

## Network Access and Interfaces

One interface: vLLM's OpenAI-compatible API.

| Interface       | Id    | Type | Port | Description                             |
| --------------- | ----- | ---- | ---- | --------------------------------------- |
| vLLM API Server | `api` | api  | 8000 | OpenAI-compatible API for LLM inference |

The port is bound on the `api-multi` MultiHost and is not masked.

**Unlike upstream's default, the inference API requires a key.** It is passed to `vllm serve` at start, and it is the same key published on the `public` volume for dependent services to read.

**The key does not cover the whole port.** vLLM authenticates the `/v1`, `/v2` and `/inference` prefixes only. Everything else the server exposes on port 8000 answers without a key, including `/invocations`, which runs the same inference as `/v1/chat/completions`, and `/pause`, which stops the engine serving. Treat the interface address as the boundary: give it out only to clients you would trust with the key, and read upstream's [security notes](https://docs.vllm.ai/en/latest/usage/security.html#api-key-authentication-limitations) for the full endpoint list.

## Installation and First-Run Flow

Install generates the API key and raises a `critical` task: choose a model. **No model is bundled**, and until one is selected the service starts but serves nothing — the daemon idles and the health check says so explicitly.

The task is checked on every start rather than only at install, so clearing the selection brings it back.

Choosing a model starts a download that can be very large. Expect the first start after a selection to take a long time.

## Actions

Three actions, all available whether or not the service is running.

### Set Model

Picks which model vLLM serves — a curated preset, or your own `vllm serve` arguments.

- **What it changes:** `serveArgs`, `serveEnv` and the selection in `store.json`.
- **Cost:** seconds to write, then a restart — and **a first-time model download plus load can take over half an hour.**
- **Repeat safety:** idempotent. Re-selecting the same model is a no-op; the previous model's files stay cached.
- **Presets are filtered to your hardware.** The package detects the accelerator tier and its memory, and offers only presets that fit — a Blackwell card, a Hopper card, older CUDA, ROCm, and CPU each see a different list.
- **Custom arguments bypass that check.** They are passed to `vllm serve` as given, so a model too large for the hardware fails at load rather than being refused up front.
- **Custom also takes environment variables**, a name/value list validated against `^[A-Za-z_][A-Za-z0-9_]*$` and unique by name — an `HF_TOKEN` for a gated model, a `VLLM_*` tuning flag. They are stored as `serveEnv` and applied to the daemon's `exec.env`. Selecting a preset writes `serveEnv: []`, so the variables apply to a Custom selection only; `customEnv` under `modelSelection` remembers them for the next time Custom is chosen, exactly as `customArgs` remembers the argument string.

### Get API Key

Displays the API key.

- **Cost:** seconds. Changes nothing.
- **To rotate it**, clear `credentials.json` and restart — init generates a new one. This action only ever shows what is currently there.

### Delete Model Cache

Removes a downloaded model's files from the cache.

- **When to run it:** to reclaim disk space from a model you no longer serve.
- **The form lists what is actually cached.** It reads the HuggingFace cache directories on the `main` volume — `models/`, which the daemon sees as `/data/models` — and offers each one labelled with its size on disk, so there is nothing to type and no way to name a model that isn't there. With an empty cache the field is disabled.
- **Cost:** seconds. The form walks the cache to size each model before it opens.
- **This is permanent.** The model has to be downloaded again if you select it later.
- **It does not change the selection**, so deleting the model currently being served leaves vLLM pointing at files that are gone.

## Tasks

One task, and it can come back.

| Task      | Severity   | Raised when          | Cleared when    |
| --------- | ---------- | -------------------- | --------------- |
| Set Model | `critical` | No model is selected | The action runs |

Checked on every init. `critical` because with no model the API never comes up — the container runs, but nothing answers on the port.

## Health Checks

One check, and it reports three distinct states.

| Check     | Displayed  | Method                 |
| --------- | ---------- | ---------------------- |
| `primary` | "vLLM API" | Port 8000 is listening |

- **No model selected** — the daemon idles and the check says so, pointing at the Set Model action rather than reporting a generic failure.
- **Starting** — the check reports `loading` with an explicit warning that a first-time download plus load can take 30+ minutes, and that even a cached model can take 15+. That window is real, and the message exists so a long start is not mistaken for a hang.
- **Overrun** — past 35 minutes it stops reporting `loading` and fails, pointing at the service logs. That is the signal something is actually wrong rather than slow.

The logs are worth reading during a start: the package makes vLLM's output unbuffered and its HuggingFace downloads verbose precisely so progress is visible there.

## Backups and Restore

Both volumes are copied wholesale — `sdk.Backups.ofVolumes('main', 'public')`. No dump step and nothing excluded.

- **Included:** the API key, the model selection, and **every downloaded model**.
- **Size:** this is a very large backup. The model cache is the whole of it, and every model in it is re-downloadable from upstream.
- **Restore:** complete, and the API key is unchanged — dependent services keep working without reconfiguration. The selected model is already cached, so the first start skips the download.

## Limitations and Differences

1. **The variant is chosen by StartOS, not by you**, from the machine's hardware.
2. **No model is bundled**, and the service serves nothing until one is selected.
3. **Integrated AMD GPUs fall back to the CPU variant** rather than attempting ROCm.
4. **The ROCm and CPU variants are x86_64 only.** aarch64 exists for NVIDIA only.
5. **Custom `vllm serve` arguments are not validated** against your hardware, and neither are custom environment variables — a variable named `HF_HUB_CACHE` displaces the package's own and moves the model cache off the persistent volume.
6. **Deleting a cached model does not clear the selection.**
7. **The API key is on a volume other services can read.** That is deliberate, and it means any package granted that mount can use your inference endpoint.
8. **The API key protects the `/v1`, `/v2` and `/inference` prefixes only.** Other endpoints on the same port, `/invocations` and `/pause` among them, answer unauthenticated.
9. **First start after selecting a model can take over half an hour**, and the health check will keep saying `loading` for up to 35 minutes before it treats that as a failure.

---

## Quick Reference for AI Consumers

```yaml
package_id: vllm
image: vllm/vllm-openai # -rocm and -cpu variants of the same upstream release
architectures:
  - x86_64
  - aarch64 # nvidia variant only; rocm and cpu are x86_64
subcontainers:
  - vllm-sub # the only container; also runs the ldconfig oneshot
volumes:
  main: /data # store.json and the model cache
  public: host side (credentials.json, readable by dependents)
file_models:
  - store.json
  - credentials.json
startos_managed_env_vars:
  - HF_HUB_CACHE
  - PYTHONUNBUFFERED
  - HF_HUB_VERBOSITY # any of the three is overridable by a custom env var of the same name
dependencies: []
interfaces:
  api: { type: api, port: 8000 } # /v1, /v2, /inference require the generated API key; other paths do not
actions:
  - get-api-credentials
  - set-model
  - delete-model-cache
tasks:
  - { action: set-model, severity: critical } # re-raises whenever no model is set
health_checks:
  - primary # displayed "vLLM API"; distinguishes no-model, loading, and overrun
```
