# overrides to s9pk.mk must precede the include statement
TARGETS := nvidia rocm cpu

include s9pk.mk

.PHONY += nvidia nvidia/x86 nvidia/arm rocm cpu patch-dockerfiles

nvidia: nvidia/x86 nvidia/arm

nvidia/%:
	VARIANT=nvidia $(MAKE) $*

# rocm uses vLLM's prebuilt ROCm image (amd64 only), so it just packs — no build.
rocm:
	VARIANT=rocm $(MAKE) arches ARCHES=x86

# cpu is the only source-built variant. Its upstream Dockerfile derives the
# version from git, which fails because vllm/ is a submodule with no usable .git
# in the build context; patch-dockerfiles writes a version-injected copy to
# .dockerfiles/ (scripts/patch-dockerfiles.sh). It's a prerequisite (not
# in-recipe) so it finishes before the sub-make, even under `make -j`.
patch-dockerfiles:
	./scripts/patch-dockerfiles.sh

# cpu is the default, unsuffixed variant: VARIANT stays unset, so the manifest
# defaults to 'cpu' and BASE_NAME stays 'vllm' (artifact name unchanged). Wraps
# the built-in `arches` target so the patch runs first. ARCHES is pinned to match
# the cpu image's declared arches (x86_64, aarch64) — the default would also try
# riscv, which the manifest doesn't build.
cpu: patch-dockerfiles
	$(MAKE) arches ARCHES="x86 arm"

