## How the upstream version is pulled

This package builds three variants, selected via `VARIANT` env var (driven by the `Makefile`).

- **nvidia**: prebuilt container, `dockerTag` in `startos/manifest/index.ts` (currently `vllm/vllm-openai:nightly-<sha>`)
- **rocm**: source build via `./vllm/docker/Dockerfile.rocm` (the `vllm/` git submodule pinned in this repo)
- **cpu**: source build via `./vllm/docker/Dockerfile.cpu` (same submodule)

To bump the upstream version:

- For `nvidia`: update the `dockerTag` string in `startos/manifest/index.ts`.
- For `rocm` / `cpu`: bump the `vllm/` submodule (`git -C vllm fetch && git -C vllm checkout <ref>`), then commit the new submodule SHA.

Because nvidia and cpu/rocm have independent upstream versions, they have separate `VersionInfo` entries under `startos/versions/` (cpu/rocm at top level, nvidia in `nvidia/`). The variant-aware version graph in `startos/versions/index.ts` picks the right `current` at build time.
