export const apiPort = 8000
export const apiHostId = 'api-multi'

// The first alias of the last --served-model-name takes precedence.
export function servedModelName(serveArgs: string[]): string {
  for (let i = serveArgs.length - 1; i > 0; i--) {
    const arg = serveArgs[i]
    if (arg.split('=', 1)[0].replace(/_/g, '-') !== '--served-model-name') {
      continue
    }
    const equals = arg.indexOf('=')
    return equals < 0 ? (serveArgs[i + 1] ?? '') : arg.slice(equals + 1)
  }
  return serveArgs[0] ?? ''
}

export const qwen3Original = {
  nvfp4Model: 'RedHatAI/Qwen3-30B-A3B-NVFP4',
  fp8Model: 'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
  maxContextLength: 40960,
} as const
