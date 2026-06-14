import { setupManifest } from '@start9labs/start-sdk'
import { cpus, totalmem } from 'node:os'
import { long, short } from './i18n'

const variant = process.env.VARIANT || 'cpu'

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
const mutable = <T>(value: T): Mutable<T> => value as Mutable<T>

// Pinned upstream vLLM nightly commit. nvidia and rocm both run vLLM's official
// prebuilt images at this commit, so they stay in lockstep — bump it on a vllm
// update (and bump the submodule + versions to match). See UPDATING.md.
const NIGHTLY_SHA = '54bbf5166842932fa7abc34a14df850594daeb5e'

// Upstream vLLM version of the bundled submodule, fed to the cpu source build as
// SETUPTOOLS_SCM_PRETEND_VERSION (the submodule's .git isn't usable in the Docker
// build context, so setuptools-scm can't derive it). MUST match the upstream half
// of the package version in versions/current.ts and the bundled submodule's tag.
// See UPDATING.md.
const UPSTREAM_VLLM_VERSION = '0.22.1rc0'

// Parallelism for the cpu source build (gcc): cap at available cores, budgeting
// ~3 GB RAM per compile job.
const maxJobs = Math.max(
  1,
  Math.min(cpus().length, Math.floor(totalmem() / (1024 * 1024 * 1024) / 3)),
)

const imageConfigs = {
  nvidia: {
    source: { dockerTag: `vllm/vllm-openai:nightly-${NIGHTLY_SHA}` },
    arch: ['x86_64', 'aarch64'],
    nvidiaContainer: true,
  },
  // vLLM's official ROCm serve image at the same commit as nvidia (amd64 only).
  rocm: {
    source: { dockerTag: `vllm/vllm-openai-rocm:nightly-${NIGHTLY_SHA}` },
    arch: ['x86_64'],
  },
  // No prebuilt cpu image exists at this nightly commit, so cpu is built from the
  // submodule via a version-injected copy of upstream's Dockerfile.cpu
  // (scripts/patch-dockerfiles.sh, run by the Makefile before packing).
  cpu: {
    source: {
      dockerBuild: {
        workdir: './vllm',
        dockerfile: './.dockerfiles/Dockerfile.cpu',
        buildArgs: {
          max_jobs: String(maxJobs),
          VLLM_VERSION: UPSTREAM_VLLM_VERSION,
        },
      },
    },
    // x86_64 only: an emulated aarch64 source build is impractical (multi-hour
    // under QEMU), and upstream's default cpu build stage is amd64-only zentorch.
    arch: ['x86_64'],
  },
} as const

export const manifest = setupManifest({
  id: 'vllm',
  title: 'vLLM',
  license: 'Apache-2.0',
  packageRepo: 'https://github.com/Start9Labs/vllm-startos',
  upstreamRepo: 'https://github.com/vllm-project/vllm',
  marketingUrl: 'https://docs.vllm.ai/',
  donationUrl: null,
  docsUrls: ['https://docs.vllm.ai/'],
  description: { short, long },
  volumes: ['main', 'public'],
  images: {
    vllm: mutable(
      imageConfigs[variant as keyof typeof imageConfigs] ?? imageConfigs.cpu,
    ),
  },
  // Uniform across variants on purpose. The registry merges a version's variant
  // s9pks into one entry and compares PackageMetadata — which includes
  // hardwareAcceleration — for exact equality; a per-variant value (cpu=false,
  // gpu=true) fails publish with "package metadata mismatch". The field that
  // legitimately distinguishes variants is hardwareRequirements below, which the
  // registry keys per-s9pk rather than comparing.
  hardwareAcceleration: true,
  dependencies: {},
  // Each variant needs a distinct hardware requirement: the registry keys a
  // version's s9pks by hardwareRequirements, so two variants sharing one (e.g.
  // two with an empty requirement) would clobber each other. cpu is the sole
  // no-requirement fallback.
  hardwareRequirements: {
    device:
      variant === 'nvidia'
        ? [
            {
              class: 'display',
              product: null,
              vendor: null,
              driver: 'nvidia',
              description: 'An NVIDIA GPU',
            },
          ]
        : variant === 'rocm'
          ? [
              {
                class: 'display',
                product: null,
                vendor: null,
                driver: 'amdgpu',
                description: 'An AMD GPU',
              },
            ]
          : [],
  },
})
