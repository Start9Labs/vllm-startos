import { cpus, totalmem } from 'node:os'
import { setupManifest } from '@start9labs/start-sdk'
import { short, long, alertInstall } from './i18n'

const variant = process.env.VARIANT || 'cpu'

type Mutable<T> = { -readonly [K in keyof T]: Mutable<T[K]> }
const mutable = <T>(value: T): Mutable<T> => value as Mutable<T>

const dockerfiles: Record<string, string> = {
  rocm: './vllm/docker/Dockerfile.rocm',
  cpu: './vllm/docker/Dockerfile.cpu',
}

// Build parallelism for source builds (rocm, cpu).
// Each nvcc thread can use ~2-3 GB of RAM during CUDA kernel compilation.
// Total parallelism is maxJobs * nvccThreads, so budget them together.
const totalGb = totalmem() / (1024 * 1024 * 1024)
const numCpus = cpus().length
const totalSlots = Math.max(1, Math.min(numCpus, Math.floor(totalGb / 3)))
const nvccThreads = Math.min(8, totalSlots)
const maxJobs = Math.max(1, Math.floor(totalSlots / nvccThreads))

const sourceBuild = (v: string) => ({
  dockerBuild: {
    workdir: './vllm',
    dockerfile: dockerfiles[v],
    buildArgs: {
      max_jobs: String(maxJobs),
      nvcc_threads: String(nvccThreads),
    },
  },
})

const imageConfigs = {
  nvidia: {
    source: {
      dockerTag:
        'vllm/vllm-openai:nightly-07351e0883470724dd5a7e9730ed10e01fc99d08',
    },
    arch: ['x86_64', 'aarch64'],
    nvidiaContainer: true,
  },
  rocm: {
    source: sourceBuild('rocm'),
    arch: ['x86_64', 'aarch64'],
  },
  cpu: {
    source: sourceBuild('cpu'),
    arch: ['x86_64', 'aarch64'],
  },
} as const

const license = 'Apache-2.0'

export const manifest = setupManifest({
  id: 'vllm',
  title: 'vLLM',
  license,
  packageRepo: 'https://github.com/Start9Labs/vllm-startos',
  upstreamRepo: 'https://github.com/vllm-project/vllm',
  marketingUrl: 'https://docs.vllm.ai/',
  donationUrl: null,
  docsUrls: ['https://docs.vllm.ai/'],
  description: { short, long },
  volumes: ['main'],
  images: {
    vllm: mutable(
      imageConfigs[variant as keyof typeof imageConfigs] ?? imageConfigs.cpu,
    ),
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  hardwareAcceleration: variant !== 'cpu',
  dependencies: {},
  hardwareRequirements: {
    device:
      variant === 'rocm'
        ? [
            {
              class: 'display' as const,
              product: null,
              vendor: null,
              driver: 'amdgpu',
              description: 'An AMD GPU',
            },
          ]
        : [],
  },
})
