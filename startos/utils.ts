export const apiPort = 8000
export const apiHostId = 'api-multi'

// vLLM accepts option names spelled with underscores as well as hyphens.
export const isServedModelNameFlag = (arg: string) =>
  arg.split('=', 1)[0].replace(/_/g, '-') === '--served-model-name'

export const qwen3Original = {
  nvfp4Model: 'RedHatAI/Qwen3-30B-A3B-NVFP4',
  fp8Model: 'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
  maxContextLength: 40960,
} as const
