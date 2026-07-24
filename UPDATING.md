# Updating the upstream version

vLLM ships three variants in `startos/manifest/index.ts`, each packing one of vLLM's official prebuilt **release** images at the same version tag:

- `nvidia` — `vllm/vllm-openai:<tag>` (x86_64 + aarch64)
- `rocm` — `vllm/vllm-openai-rocm:<tag>` (x86_64 only; upstream publishes no arm64 ROCm image)
- `cpu` — `vllm/vllm-openai-cpu:<tag>` (x86_64 only; arm64 CPU inference is impractically slow)

All three are pinned to the single `VLLM_VERSION` constant in the manifest. Release tags (`vX.Y.Z`) are immutable and retained by Docker Hub indefinitely, so builds stay reproducible — unlike the ephemeral `nightly-<sha>` tags this package previously tracked, which Docker Hub garbage-collects, breaking rebuilds once a pin ages out.

## Steps

1. Pick the new upstream release and confirm the tag exists for **all three** repos on Docker Hub (they publish in lockstep, but verify — a rebuild breaks if any one is missing):

   ```bash
   for repo in vllm/vllm-openai vllm/vllm-openai-rocm vllm/vllm-openai-cpu; do
     curl -s -o /dev/null -w "$repo %{http_code}\n" \
       "https://hub.docker.com/v2/repositories/$repo/tags/vX.Y.Z/"
   done
   ```

2. Bump **`VLLM_VERSION`** in `startos/manifest/index.ts` to the new tag (e.g. `v0.25.1`). This advances all three variants at once.

3. Bump the version in **`startos/versions/current.ts`**: set the upstream half (left of the final `:`) to the new release in **ExVer** notation and reset the StartOS revision to `:0`. ExVer separates a pre-release's alpha and numeric parts as distinct dot-delimited identifiers, so tag `v0.25.1` → `0.25.1:0`, and `v0.26.0rc1` → `0.26.0-rc.1:0`. Rewrite the release notes.

4. Confirm `vllm serve` still accepts the arguments passed in `startos/main.ts` and the stored `serveArgs` — upstream occasionally renames flags across minor releases.
