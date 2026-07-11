import { setupManifest } from '@start9labs/start-sdk'
import { cpus, totalmem } from 'node:os'
import { long, short } from './i18n'

const variant = process.env.VARIANT || 'cpu'

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
const mutable = <T>(value: T): Mutable<T> => value as Mutable<T>

// Pinned upstream vLLM nightly commit. nvidia and rocm both run vLLM's official
// prebuilt images at this commit, so they stay in lockstep — bump it on a vllm
// update (and bump the submodule + versions to match). See UPDATING.md.
const NIGHTLY_SHA = 'a16dbd5b8572d4128be9f10b9dcff4999b594b25'

// Upstream vLLM version of the bundled submodule, fed to the cpu source build as
// SETUPTOOLS_SCM_PRETEND_VERSION (the submodule's .git isn't usable in the Docker
// build context, so setuptools-scm can't derive it). MUST match the upstream half
// of the package version in versions/current.ts and the bundled submodule's tag.
// See UPDATING.md.
const UPSTREAM_VLLM_VERSION = '0.23.1rc0'

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

// ROCm is unreliable on integrated Radeon (e.g. the 680M in Ryzen APUs), so
// match only discrete AMD GPUs by product name. StartOS's regex engine has no
// lookahead, so this is a positive allowlist rather than an iGPU exclusion.
const AMD_DISCRETE_GPU =
  '(?i)(Navi\\s*\\d+|Radeon\\s*RX\\s*\\d{3}|Radeon\\s*RX\\s*Vega|Radeon\\s*VII|Instinct)'

// hardwareRequirements per accelerator variant. StartOS auto-selects the most
// hardware-specific compatible variant per host, and the registry keys a
// version's s9pks by hardwareRequirements, so each accelerator variant needs a
// distinct one. cpu carries no entry here and is the sole no-requirement fallback.
const hwDevices = {
  nvidia: [
    {
      class: 'display' as const,
      product: null,
      vendor: null,
      driver: 'nvidia',
      description: 'An NVIDIA GPU',
    },
  ],
  rocm: [
    {
      class: 'display' as const,
      product: AMD_DISCRETE_GPU,
      vendor: null,
      driver: 'amdgpu',
      description:
        'A discrete AMD GPU supported by ROCm (integrated Radeon graphics are not supported)',
    },
  ],
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
  hardwareRequirements: {
    device: [...(hwDevices[variant as keyof typeof hwDevices] ?? [])],
  },
})
