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

export async function detectHardware(
  effects: T.Effects,
): Promise<HardwareInfo> {
  if (cached) return cached
  const result = await detect(effects)
  // Only cache a real detection. A `cpu`/`0GB` result is the "everything
  // failed" sentinel — caching it would leave every preset disabled in the
  // Set Model form for the lifetime of this process, even after a transient
  // probe failure clears up.
  if (result.tier !== 'cpu' || result.memoryGB > 0) {
    cached = result
  }
  return result
}

async function detect(effects: T.Effects): Promise<HardwareInfo> {
  // Try NVIDIA first
  let nvidiaTier: HardwareTier | null = null
  try {
    const result = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'vllm' },
      sdk.Mounts.of(),
      'detect-hw',
      async (sub) => {
        // Mirror main.ts: refresh linker cache so nvidia-smi can resolve
        // libnvidia-ml.so.1 on aarch64 images where the host-injected driver
        // libs aren't in the default search paths.
        await sub.exec(['ldconfig'])
        return sub.exec([
          'nvidia-smi',
          '--query-gpu=compute_cap,memory.total',
          '--format=csv,noheader,nounits',
        ])
      },
    )
    if (result.exitCode === 0 && typeof result.stdout === 'string') {
      const lines = result.stdout
        .trim()
        .split('\n')
        .map((l) => l.split(',').map((s) => s.trim()))
      if (lines.length > 0 && lines[0]?.[0]) {
        const cap = lines[0][0]
        const major = parseInt(cap.split('.')[0] ?? '0', 10)
        nvidiaTier =
          major >= 12
            ? 'nvidia-blackwell'
            : major === 9
              ? 'nvidia-hopper'
              : 'nvidia-older'
        // Sum memory across all GPUs (MiB → GiB). On unified-memory parts
        // like the GB10 Spark, nvidia-smi reports `[N/A]` for memory.total,
        // which makes the sum NaN — treat that as "no per-GPU memory
        // reported" and fall through to the /proc/meminfo path below while
        // keeping the GPU tier we just detected.
        const perGpuMiB = lines.map((l) => parseInt(l[1] ?? '', 10))
        if (perGpuMiB.every((m) => Number.isFinite(m))) {
          const memoryGB = Math.floor(
            perGpuMiB.reduce((sum, m) => sum + m / 1024, 0),
          )
          return { tier: nvidiaTier, memoryGB }
        }
      }
    }
    if (nvidiaTier === null) {
      console.warn(
        `[detectHardware] nvidia-smi probe did not yield GPU info; falling back. exitCode=${result.exitCode} stdout=${JSON.stringify(String(result.stdout))} stderr=${JSON.stringify(String(result.stderr))}`,
      )
    }
  } catch (err) {
    console.warn(
      `[detectHardware] nvidia-smi probe threw; falling back: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    )
  }
  // Either no NVIDIA GPU, or a unified-memory NVIDIA part (Spark/GB10)
  // where per-GPU memory isn't reported. Either way, read system RAM.
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
      return { tier: nvidiaTier ?? 'cpu', memoryGB }
    }
    console.warn(
      `[detectHardware] /proc/meminfo probe failed. exitCode=${result.exitCode} stderr=${JSON.stringify(String(result.stderr))}`,
    )
  } catch (err) {
    console.warn(
      `[detectHardware] /proc/meminfo probe threw: ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    )
  }
  return { tier: nvidiaTier ?? 'cpu', memoryGB: 0 }
}
