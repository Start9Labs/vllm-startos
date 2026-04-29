export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting vLLM!': 0,
  'vLLM API': 1,
  'The vLLM API is ready': 2,
  'The vLLM API is not ready': 3,
  'No model selected. Run the "Set Model" action.': 4,

  // interfaces.ts
  'vLLM API Server': 5,
  'OpenAI-compatible API for LLM inference': 6,

  // actions/getApiCredentials.ts
  'Get API Credentials': 7,
  'Retrieve your API key for connecting to the vLLM API': 8,

  // actions/setModel.ts
  'Set Model': 9,
  'Pick a curated preset (per Unsloth recommendations) or provide custom `vllm serve` arguments. The model will be downloaded on first startup if not already cached.': 10,
  Model: 11,
  'Changing the model will restart the service and may require downloading a new model.': 13,
  Configuration: 20,
  'vLLM serve arguments': 21,
  "The full argument string passed after `vllm serve`. Starts with the model id, then any flags. Split on whitespace, so quoted JSON values won't survive — use a preset for those.":
    22,
  Custom: 23,
  'Qwen3.6 35B-A3B': 24,
  'Qwen3.6 27B': 26,
  'Qwen3-Next 80B-A3B': 28,
  'Qwen3 30B-A3B': 29,
  'Llama 3.3 70B Instruct': 30,
  'Mistral Small 3.2 24B Instruct': 31,

  // actions/deleteModelCache.ts
  'Delete Model Cache': 14,
  'Remove a downloaded model from the cache to free up disk space': 15,
  'HuggingFace model ID to delete from cache (e.g. meta-llama/Llama-3.1-8B-Instruct)':
    16,
  'This will permanently delete the cached model files. The model will need to be re-downloaded if selected again.':
    17,

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
