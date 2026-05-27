import { utils } from '@start9labs/start-sdk'
import { getApiCredentials } from '../actions/getApiCredentials'
import { setModel } from '../actions/setModel'
import { credentialsJson } from '../fileModels/credentials.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await credentialsJson.write(effects, {
      apiKey: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 }),
    })

    await sdk.action.createOwnTask(effects, getApiCredentials, 'critical', {
      reason: i18n('Retrieve your API key so you can connect to vLLM'),
    })

    await sdk.action.createOwnTask(effects, setModel, 'critical', {
      reason: i18n('Select which AI model vLLM should serve'),
    })
  } else {
    await storeJson.write(effects, {})
  }
})
