# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `vllm`.** Exposes a single OpenAI-compatible `api` interface (host `api-multi`, port 8000) and publishes the API key as `credentials.json` on the `public` volume so dependent services can mount it read-only.
- **Variant package.** One codebase builds three variants selected by the `VARIANT` env var in the `Makefile`: `nvidia` and `rocm` pack vLLM's official prebuilt images at a pinned nightly commit, while `cpu` (the default/unsuffixed variant) is source-built from the bundled `vllm/` submodule via a version-injected `Dockerfile.cpu` (`scripts/patch-dockerfiles.sh`). The Makefile's `TARGETS`/`ARCHES`/`VARIANT` overrides must precede the `s9pk.mk` include. On a version bump, keep `NIGHTLY_SHA`, `UPSTREAM_VLLM_VERSION` (manifest), the submodule tag, and `versions/current.ts` in lockstep — see `UPDATING.md`.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach vllm -n vllm -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `vllm-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
