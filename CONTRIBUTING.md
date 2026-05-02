# Contributing

## Building and Development

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for complete environment setup and build instructions.

### Quick Start

```bash
# Install dependencies
npm ci

# Build all variants (nvidia + rocm + cpu, all arches)
make

# Build a single variant
make nvidia        # NVIDIA GPU (uses upstream container, fast)
make rocm          # AMD ROCm GPU (source build, slow)
make cpu           # CPU only (source build, slow)
```

The `nvidia` variant pulls a prebuilt upstream container. The `rocm` and `cpu` variants build vLLM from source against the bundled `vllm/` submodule and require significant RAM and disk for CUDA/HIP kernel compilation.

## How to Contribute

1. Fork the repository and create a branch from `master`
2. Make your changes
3. Open a pull request to `master`
