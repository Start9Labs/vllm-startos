import { setupManifest } from '@start9labs/start-sdk'
import { short, long, alertInstall } from './i18n'

const ROCM = process.env.ROCM

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
  volumes: ['main'],
  images: {
    vllm: {
      source: {
        dockerBuild: {
          workdir: './vllm',
          dockerfile: ROCM
            ? './vllm/docker/Dockerfile.rocm'
            : './vllm/docker/Dockerfile',
        },
      },
      nvidiaContainer: !ROCM,
    },
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  hardwareAcceleration: true,
  dependencies: {},
  hardwareRequirements: {
    device: ROCM
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
