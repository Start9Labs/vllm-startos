export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting vLLM!': 0,
  'vLLM API': 1,
  'The vLLM API is ready': 2,
  'The vLLM API is not ready': 3,
  'No model selected. Run the "Set Model" action.': 4,
  'The vLLM API is starting. A first-time model download plus load can take 30+ minutes; loading an already-cached model can take 15+ minutes. Exact time depends on your hardware resources and network bandwidth.': 35,
  'The vLLM API did not come up within 35 minutes. Check the service logs for errors.': 40,

  // interfaces.ts
  'vLLM API Server': 5,
  'OpenAI-compatible API for LLM inference': 6,

  // actions/getApiCredentials.ts
  'Get API Key': 7,
  'Retrieve your API key for connecting to the vLLM API': 8,
  'API Key': 36,
  'Use this key to connect any OpenAI-compatible client to your vLLM instance. Set the base URL to your vLLM service address with /v1 appended.': 37,

  // actions/setModel.ts
  'Set Model': 9,
  'Pick a curated preset (per Unsloth recommendations) or provide custom `vllm serve` arguments. The model will be downloaded on first startup if not already cached.': 10,
  Model: 11,
  'Changing the model will restart the service and may require downloading a new model.': 13,
  Configuration: 20,
  'vLLM serve arguments': 21,
  "The full argument string passed after `vllm serve`. Starts with the model id, then any flags. Split on whitespace, so quoted JSON values won't survive — use a preset for those.": 22,
  Custom: 23,
  'Qwen3.6 35B-A3B': 24,
  'Qwen3.6 27B': 26,
  'Qwen3-Next 80B-A3B': 28,
  'Qwen3 30B-A3B': 29,
  'Llama 3.3 70B Instruct': 30,
  'Mistral Small 3.2 24B Instruct': 31,
  'Nemotron 3 Elastic 30B-A3B': 32,
  'Gemma 4 31B Instruct': 33,
  'Gemma 4 26B-A4B Instruct': 34,

  // actions/deleteModelCache.ts
  'Delete Model Cache': 14,
  'Remove a downloaded model from the cache to free up disk space': 15,
  'The downloaded model to remove from the cache.': 41,
  'No models are cached.': 42,
  'This will permanently delete the cached model files. The model will need to be re-downloaded if selected again.': 17,
  'Cache Deleted': 38,
  'Model cache for "${model}" has been deleted.': 39,

  // init/initializeService.ts
  'Retrieve your API key so you can connect to vLLM': 18,
  'Select which AI model vLLM should serve': 19,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
