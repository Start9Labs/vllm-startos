# Updating the upstream version

vLLM ships three variants in `startos/manifest/index.ts`:

- `nvidia` — pinned upstream container `vllm/vllm-openai:nightly-<sha>` via `dockerTag`.
- `rocm` — source-built from the `vllm/` git submodule using `./vllm/docker/Dockerfile.rocm`.
- `cpu` — source-built from the `vllm/` git submodule using `./vllm/docker/Dockerfile.cpu`.

The nvidia tag and the submodule track the same upstream project ([`vllm-project/vllm`](https://github.com/vllm-project/vllm)) and should generally be advanced together so the variants stay in sync.

1. Bump the `nvidia` variant's `dockerTag` in `startos/manifest/index.ts` to the new `vllm/vllm-openai:nightly-<sha>`.
2. Bump the `vllm/` submodule for the `rocm` and `cpu` variants:
   ```bash
   cd vllm && git fetch --tags && git checkout v<new version>
   cd .. && git add vllm
   ```
