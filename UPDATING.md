# Updating the upstream version

vLLM ships three variants in `startos/manifest/index.ts`:

- `nvidia` — vLLM's prebuilt image `vllm/vllm-openai:nightly-<sha>` via `dockerTag` (x86_64 + aarch64).
- `rocm` — vLLM's prebuilt image `vllm/vllm-openai-rocm:nightly-<sha>` via `dockerTag` (x86_64 only).
- `cpu` — source-built from the `vllm/` git submodule via a patched copy of `vllm/docker/Dockerfile.cpu` (no prebuilt cpu image is published at a nightly commit).

nvidia and rocm pin the **same** nightly commit (`NIGHTLY_SHA` in the manifest), and the submodule is checked out at that commit too — keep all of them on the same upstream commit.

## Version must be kept in sync in four places

`vllm` derives its Python version from git via setuptools-scm, which can't read the submodule's `.git` inside the Docker build context, so the cpu build's version is supplied explicitly and **hand-maintained** — there is no way to derive it automatically. On every upstream bump, set these to the same upstream vLLM commit/version:

1. **`NIGHTLY_SHA`** in `startos/manifest/index.ts` — the commit for the prebuilt nvidia + rocm `dockerTag`s.
2. **`UPSTREAM_VLLM_VERSION`** in `startos/manifest/index.ts` — fed to the cpu source build as the `VLLM_VERSION` build arg → `SETUPTOOLS_SCM_PRETEND_VERSION`. **PEP 440** notation (no hyphen): `0.21.1rc0`.
3. **`startos/versions/current.ts`** — `version`'s upstream half (left of the final `:`; the StartOS revision is everything to the right). **ExVer** notation: a hyphen introduces the pre-release, and its alpha and numeric parts are **separate dot-delimited identifiers** — `rc` and `0` cannot be glued together (ExVer rejects `rc0` with `Expected ".", ":", or [a-zA-Z]`). So tag `v0.21.1rc0` → `0.21.1-rc.0:0`.
4. **The `vllm/` submodule** — checked out at the matching tag/commit.

Items 2–4 are the *same* upstream version in three notations (PEP 440 / ExVer / git); item 1 is the matching commit SHA for the prebuilt images. Keep them consistent.

## The patched cpu Dockerfile

The `cpu` variant does **not** build from `vllm/docker/Dockerfile.cpu` directly. `scripts/patch-dockerfiles.sh` copies it to `.dockerfiles/` (gitignored) and injects an `ENV SETUPTOOLS_SCM_PRETEND_VERSION` line into the root build stage (`AS base-common`, inherited by the stage that runs `setup.py`). The Makefile's `cpu` target runs it automatically before packing. We do this instead of vendoring a full copy of the Dockerfile.

We inject the **generic** `SETUPTOOLS_SCM_PRETEND_VERSION`, not the dist-named `..._FOR_VLLM` form. vllm's `setup.py` calls `setuptools_scm.get_version()` with no `dist_name`, and setuptools-scm v10 (refactored onto the `vcs_versioning` backend) no longer infers the project name from `pyproject.toml` in that legacy call — so it never matches the named override and only consults the generic variable. The generic var is safe here because this Dockerfile builds exactly one project.

The injection is keyed to the `AS base-common` stage anchor. If a vllm bump restructures that stage, the script **fails loudly** — re-check the anchor in `scripts/patch-dockerfiles.sh` against the new upstream Dockerfile.

## Steps

1. Bump `NIGHTLY_SHA` in `startos/manifest/index.ts` to the new commit. This advances both the `nvidia` and `rocm` prebuilt `dockerTag`s. Confirm the tag exists for both repos (`vllm/vllm-openai`, `vllm/vllm-openai-rocm`) on Docker Hub.
2. Bump the `vllm/` submodule to the matching commit for the cpu source build:
   ```bash
   cd vllm && git fetch --tags && git checkout <commit-or-tag>
   cd .. && git add vllm
   ```
3. Update the version in the four places listed above to the new upstream vLLM version.
