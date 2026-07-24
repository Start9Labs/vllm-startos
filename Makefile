# overrides to s9pk.mk must precede the include statement
# Leaf-level matrix targets: each <variant>-<arch> entry builds exactly one
# s9pk, so the release workflow's matrix fans out one runner per entry instead
# of building a variant's arches serially on one runner. This keeps each nvidia
# arch's CUDA image on its own runner — packing both on one runner exhausted its
# disk. rocm and cpu are amd64-only (upstream publishes no arm64 ROCm image, and
# arm64 CPU inference is impractically slow).
TARGETS := nvidia-x86 nvidia-arm rocm-x86 cpu-x86
ARCHES := x86 arm

include node_modules/@start9labs/start-sdk/s9pk.mk

.PHONY += nvidia nvidia-x86 nvidia-arm rocm rocm-x86 cpu cpu-x86

# Aggregate variant targets so `make nvidia` still builds every arch locally;
# the matrix uses the leaf targets in TARGETS directly. rocm and cpu each pack a
# single amd64 image, so each has one arch.
nvidia: nvidia-x86 nvidia-arm
rocm: rocm-x86
cpu: cpu-x86

# All three variants pack vLLM's official prebuilt images, so a leaf just packs
# that arch. cpu is the default/unsuffixed variant: VARIANT stays unset so the
# manifest defaults to 'cpu' and BASE_NAME stays 'vllm' (artifact name unchanged).
nvidia-%:; VARIANT=nvidia $(MAKE) $*
rocm-%:; VARIANT=rocm $(MAKE) $*
cpu-%:; $(MAKE) $*
