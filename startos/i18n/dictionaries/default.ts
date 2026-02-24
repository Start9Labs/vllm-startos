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
  'Choose which HuggingFace model to serve. The model will be downloaded on first startup if not already cached.': 10,
  Model: 11,
  'HuggingFace model ID (e.g. meta-llama/Llama-3.1-8B-Instruct)': 12,
  'Changing the model will restart the service and may require downloading a new model.': 13,

  // actions/deleteModelCache.ts
  'Delete Model Cache': 14,
  'Remove a downloaded model from the cache to free up disk space': 15,
  'HuggingFace model ID to delete from cache (e.g. meta-llama/Llama-3.1-8B-Instruct)': 16,
  'This will permanently delete the cached model files. The model will need to be re-downloaded if selected again.': 17,

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
