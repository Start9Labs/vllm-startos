# overrides to s9pk.mk must precede the include statement
TARGETS := nvidia rocm arches

include s9pk.mk

.PHONY += nvidia nvidia/x86 nvidia/arm rocm

nvidia: nvidia/x86 nvidia/arm

nvidia/%:
	VARIANT=nvidia $(MAKE) $*

rocm:
	VARIANT=rocm $(MAKE) arches ARCHES=x86

