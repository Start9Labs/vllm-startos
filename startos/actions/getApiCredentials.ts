import { credentialsJson } from '../fileModels/credentials.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const getApiCredentials = sdk.Action.withoutInput(
  // id
  'get-api-credentials',

  // metadata
  async ({ effects }) => ({
    name: i18n('Get API Key'),
    description: i18n('Retrieve your API key for connecting to the vLLM API'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // the execution function
  async ({ effects }) => {
    const apiKey = await credentialsJson.read((c) => c.apiKey).once()
    if (!apiKey) {
      throw new Error('no API key')
    }

    return {
      version: '1',
      title: i18n('API Key'),
      message: i18n(
        'Use this key to connect any OpenAI-compatible client to your vLLM instance. Set the base URL to your vLLM service address with /v1 appended.',
      ),
      result: {
        type: 'single',
        name: i18n('API Key'),
        value: apiKey,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
