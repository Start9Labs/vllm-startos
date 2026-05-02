## How the upstream version is pulled

This package builds three variants, selected via `VARIANT` env var (driven by the `Makefile`).

- **nvidia**: prebuilt container, `dockerTag` in `startos/manifest/index.ts` (currently `vllm/vllm-openai:nightly-<sha>`)
- **rocm**: source build via `./vllm/docker/Dockerfile.rocm` (the `vllm/` git submodule pinned in this repo)
- **cpu**: source build via `./vllm/docker/Dockerfile.cpu` (same submodule)

To bump the upstream version:

- For `nvidia`: update the `dockerTag` string in `startos/manifest/index.ts`.
- For `rocm` / `cpu`: bump the `vllm/` submodule (`git -C vllm fetch && git -C vllm checkout <ref>`), then commit the new submodule SHA.

All three variants share a single version chain under `startos/versions/`. The `VARIANT` env var only selects the image source / arch / hardware-requirement block in the manifest; `versionGraph` itself is variant-agnostic.

## Public credentials volume

The `public` volume is a derived projection of `store.apiKey`. The reactive init script `startos/init/syncCredentials.ts` writes `credentials.json` (`{ apiKey }`) on every start, using `.const(effects)` so the watcher re-runs whenever the apiKey changes. Do not write to `credentials.json` from anywhere else — let the init handle it. The file model is in `startos/fileModels/credentials.json.ts`.

Dependent packages (e.g. open-webui) consume the apiKey by `mountDependency`-ing `vllm:public` read-only and reading `credentials.json` from the mountpoint.
