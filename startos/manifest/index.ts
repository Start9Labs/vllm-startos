import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

const variant = process.env.VARIANT || 'cpu'

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
const mutable = <T>(value: T): Mutable<T> => value as Mutable<T>

// Pinned upstream vLLM release. All three variants pack vLLM's official prebuilt
// images at this tag, so they stay in lockstep — bump it on a vllm update (and
// bump versions/current.ts to match). Release tags are immutable and retained by
// Docker Hub indefinitely, unlike the ephemeral `nightly-<sha>` tags they replaced
// (which get garbage-collected, breaking rebuilds). See UPDATING.md.
const VLLM_VERSION = 'v0.27.1'

const imageConfigs = {
  nvidia: {
    source: { dockerTag: `vllm/vllm-openai:${VLLM_VERSION}` },
    arch: ['x86_64', 'aarch64'],
    nvidiaContainer: true,
  },
  // vLLM's official ROCm serve image (amd64 only).
  rocm: {
    source: { dockerTag: `vllm/vllm-openai-rocm:${VLLM_VERSION}` },
    arch: ['x86_64'],
  },
  // vLLM's official CPU serve image. amd64 only, matching the arch scope of the
  // prior source-built cpu variant (arm64 CPU inference is impractically slow).
  cpu: {
    source: { dockerTag: `vllm/vllm-openai-cpu:${VLLM_VERSION}` },
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
