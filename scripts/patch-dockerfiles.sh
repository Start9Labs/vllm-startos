#!/usr/bin/env bash
#
# Inject a setuptools-scm version into a build-time copy of vllm's upstream
# Dockerfile.cpu (the only source-built variant; nvidia and rocm use prebuilt
# images).
#
# Why: `vllm/` is a pristine-upstream git submodule, so its `.git` is an
# unresolvable pointer file inside the Docker build context. vllm derives its
# package version from git via setuptools-scm, which therefore fails with
# "setuptools-scm was unable to detect version" during `setup.py bdist_wheel`.
#
# Rather than vendor a full copy of this Dockerfile, we copy it here at build
# time and inject a single ENV line into the root build stage (inherited by the
# stage that runs setup.py). The version value itself comes from the VLLM_VERSION
# build arg supplied by the manifest, so it stays a single hand-maintained
# literal there.
#
# Run automatically by the Makefile's `cpu` target. If the anchor stops matching
# after a vllm bump, this fails loudly rather than silently producing an
# unpatched (and still-broken) Dockerfile — see UPDATING.md.

set -euo pipefail

cd "$(dirname "$0")/.."

src=vllm/docker
out=.dockerfiles
mkdir -p "$out"

inject() {
  local name=$1 anchor=$2
  local in="$src/$name" dst="$out/$name"

  if ! grep -qE "$anchor" "$in"; then
    echo "patch-dockerfiles: anchor '$anchor' not found in $in." >&2
    echo "  Upstream Dockerfile layout changed; update scripts/patch-dockerfiles.sh." >&2
    exit 1
  fi

  awk -v anchor="$anchor" '
    { print }
    $0 ~ anchor && !injected {
      print "ARG VLLM_VERSION"
      print "ENV SETUPTOOLS_SCM_PRETEND_VERSION_FOR_VLLM=${VLLM_VERSION}"
      injected = 1
    }
  ' "$in" > "$dst"

  echo "patch-dockerfiles: wrote $dst (version injected at '$anchor')"
}

# cpu is the only source-built variant (nvidia and rocm use prebuilt images).
# base-common is its root build stage; the ENV propagates to vllm-build's
# bdist_wheel step.
inject Dockerfile.cpu '^FROM .* AS base-common$'
