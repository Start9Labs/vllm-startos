# overrides to s9pk.mk must precede the include statement
# Leaf-level matrix targets: each <variant>-<arch> entry builds exactly one
# s9pk, so the release workflow's matrix fans out one runner per entry instead
# of building a variant's arches serially on one runner. This keeps each nvidia
# arch's CUDA image on its own runner — packing both on one runner exhausted its
# disk. cpu is x86_64-only: an emulated aarch64 source build is impractical
# (multi-hour), and upstream's default cpu build stage is amd64-only zentorch.
TARGETS := nvidia-x86 nvidia-arm rocm-x86 cpu-x86
ARCHES := x86 arm

include node_modules/@start9labs/start-sdk/s9pk.mk

.PHONY += nvidia nvidia-x86 nvidia-arm rocm rocm-x86 cpu cpu-x86 patch-dockerfiles

# Aggregate variant targets so `make nvidia` still builds every arch locally;
# the matrix uses the leaf targets in TARGETS directly. rocm uses vLLM's prebuilt
# ROCm image (amd64 only) and cpu is built x86_64-only, so each has one arch.
nvidia: nvidia-x86 nvidia-arm
rocm: rocm-x86
cpu: cpu-x86

# nvidia and rocm use vLLM's prebuilt images, so a leaf just packs that arch.
nvidia-%:; VARIANT=nvidia $(MAKE) $*
rocm-%:; VARIANT=rocm $(MAKE) $*

# cpu is the only source-built variant, and the default/unsuffixed one: VARIANT
# stays unset so the manifest defaults to 'cpu' and BASE_NAME stays 'vllm'
# (artifact name unchanged). Its upstream Dockerfile derives the version from git,
# which fails because vllm/ is a submodule with no usable .git in the build
# context; patch-dockerfiles writes a version-injected copy to .dockerfiles/
# (scripts/patch-dockerfiles.sh). It's a prerequisite (not in-recipe) so it
# finishes before the sub-make, even under `make -j`.
cpu-%: patch-dockerfiles
	$(MAKE) $*

patch-dockerfiles:
	./scripts/patch-dockerfiles.sh
