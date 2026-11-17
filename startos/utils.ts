export const apiPort = 8000
export const apiHostId = 'api-multi'

// vLLM accepts option names spelled with underscores as well as hyphens.
const isFlag =
  (...flags: string[]) =>
  (arg: string) =>
    flags.includes(arg.split('=', 1)[0].replace(/_/g, '-'))

export const isServedModelNameFlag = isFlag('--served-model-name')

export const isGpuMemoryUtilizationFlag = isFlag(
  '--gpu-memory-utilization',
  '--device-memory-utilization',
)

export const qwen3Original = {
  nvfp4Model: 'RedHatAI/Qwen3-30B-A3B-NVFP4',
  fp8Model: 'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
  maxContextLength: 40960,
} as const
