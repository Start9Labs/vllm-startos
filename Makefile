# overrides to s9pk.mk must precede the include statement
TARGETS := generic rocm
ARCHES := x86 arm

include s9pk.mk

generic:
	$(MAKE) arches VARIANT=generic

rocm:
	ROCM=1 $(MAKE) arches VARIANT=rocm ARCHES=x86
