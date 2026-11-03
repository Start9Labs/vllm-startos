export const apiPort = 8000
export const apiHostId = 'api-multi'

// The model name clients must send: the first --served-model-name, else the
// model id that leads the serve arguments.
export function servedModelName(serveArgs: string[]): string {
  const i = serveArgs.findIndex(
    (a) => a === '--served-model-name' || a.startsWith('--served-model-name='),
  )
  if (i < 0) return serveArgs[0] ?? ''
  return serveArgs[i].includes('=')
    ? serveArgs[i].slice(serveArgs[i].indexOf('=') + 1)
    : (serveArgs[i + 1] ?? '')
}

export const qwen3Original = {
  nvfp4Model: 'RedHatAI/Qwen3-30B-A3B-NVFP4',
  fp8Model: 'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
  maxContextLength: 40960,
} as const
