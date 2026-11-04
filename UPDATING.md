# Updating the upstream version

vLLM ships three variants in `startos/manifest/index.ts`, each packing one of vLLM's official prebuilt **release** images at the same version tag:

- `nvidia` — `vllm/vllm-openai:<tag>` (x86_64 + aarch64)
- `rocm` — `vllm/vllm-openai-rocm:<tag>` (x86_64 only; upstream publishes no arm64 ROCm image)
- `cpu` — `vllm/vllm-openai-cpu:<tag>` (x86_64 only; this package does not offer arm64 CPU inference)

All three are pinned to the single `VLLM_VERSION` constant in the manifest. Verify availability and architecture coverage on every update.

## Determining the upstream version

1. Read the upstream tag list, not GitHub's Latest release:

   ```bash
   gh api 'repos/vllm-project/vllm/tags?per_page=100' --jq '.[].name'
   ```

   Pick the newest stable `vX.Y.Z` tag. Paginate if necessary. Never pin a release candidate (`vX.Y.Zrc1`) or a nightly. GitHub release entries can lag the stable tags and published images.

2. Confirm the exact tag resolves for **all three** Docker Hub repositories, with `linux/amd64` in each and `linux/arm64` in the NVIDIA image. If any required artifact is absent, use the newest stable tag that meets these requirements:

   ```bash
   for repo in vllm/vllm-openai vllm/vllm-openai-rocm vllm/vllm-openai-cpu; do
     curl -sS --fail "https://hub.docker.com/v2/repositories/$repo/tags/vX.Y.Z/" |
       jq -e '{name, images: [.images[] | {os, architecture, digest}]}' || break
   done
   ```

3. Classify the change using upstream's [release policy](https://github.com/vllm-project/vllm/blob/main/docs/contributing/release_process.md): vLLM's regular releases advance the `0.x` minor component and can remove deprecated functionality.

## Applying the bump

1. Bump **`VLLM_VERSION`** in `startos/manifest/index.ts` to the verified tag. This advances all three variants at once.
2. The package version in `startos/versions/current.ts` is the complete upstream version without the `v` — e.g. `v0.31.0` → `0.31.0:0`.
3. For regular releases, confirm `vllm serve` still accepts every argument in `startos/main.ts` and the presets in `startos/actions/presets.ts`, including their parser names and template paths. Check saved Custom arguments for upstream removals and explain required changes in the release notes.
