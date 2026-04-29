import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export type HardwareTier =
  | 'nvidia-blackwell' // sm_120/sm_121 — DGX Spark, RTX 50, B100/B200 (NVFP4-capable)
  | 'nvidia-hopper' // sm_90 — H100, H200 (FP8-capable)
  | 'nvidia-older' // sm_80–sm_89 — A100, A6000, RTX 40/30
  | 'amd' // ROCm
  | 'cpu' // no GPU detected

export type HardwareInfo = {
  tier: HardwareTier
  /** Total accelerator memory in GiB; for NVIDIA, sum across all GPUs. For CPU, total system RAM. */
  memoryGB: number
}

let cached: HardwareInfo | null = null

export async function detectHardware(effects: T.Effects): Promise<HardwareInfo> {
  if (cached) return cached
  cached = await detect(effects)
  return cached
}

async function detect(effects: T.Effects): Promise<HardwareInfo> {
  // Try NVIDIA first
  try {
    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'vllm' },
      sdk.Mounts.of(),
      'detect-hw',
      (sub) =>
        sub.exec([
          'nvidia-smi',
          '--query-gpu=compute_cap,memory.total',
          '--format=csv,noheader,nounits',
        ]),
    )
    if (result.exitCode === 0 && typeof result.stdout === 'string') {
      const lines = result.stdout
        .trim()
        .split('\n')
        .map((l) => l.split(',').map((s) => s.trim()))
      if (lines.length > 0 && lines[0]?.[0]) {
        const cap = lines[0][0]
        const major = parseInt(cap.split('.')[0] ?? '0', 10)
        // Sum memory across all GPUs (MiB → GiB)
        const memoryGB = Math.floor(
          lines.reduce(
            (sum, l) => sum + parseInt(l[1] ?? '0', 10) / 1024,
            0,
          ),
        )
        const tier: HardwareTier =
          major >= 12
            ? 'nvidia-blackwell'
            : major === 9
              ? 'nvidia-hopper'
              : 'nvidia-older'
        return { tier, memoryGB }
      }
    }
  } catch {
    // fall through
  }
  // Fall back to CPU: use total system RAM
  try {
    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'vllm' },
      sdk.Mounts.of(),
      'detect-mem',
      (sub) => sub.exec(['cat', '/proc/meminfo']),
    )
    if (result.exitCode === 0 && typeof result.stdout === 'string') {
      const match = result.stdout.match(/MemTotal:\s+(\d+)\s+kB/)
      const memoryGB = match
        ? Math.floor(parseInt(match[1] ?? '0', 10) / 1024 / 1024)
        : 0
      return { tier: 'cpu', memoryGB }
    }
  } catch {
    // fall through
  }
  return { tier: 'cpu', memoryGB: 0 }
}
