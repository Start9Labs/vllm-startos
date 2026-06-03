import { utils } from '@start9labs/start-sdk'
import { setModel } from '../actions/setModel'
import { credentialsJson } from '../fileModels/credentials.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

// Runs on every init (install, update, restore, and plain restart), and
// re-runs reactively when the watched files change.
export const initializeService = sdk.setupOnInit(async (effects) => {
  // Ensure an API key always exists — generated on install and any time it has
  // been cleared, so "delete it and restart" rotates the key. The Get API Key
  // action just displays whatever is here.
  const apiKey = await credentialsJson.read((c) => c.apiKey).const(effects)
  if (!apiKey) {
    // allowWriteAfterConst: the read above is reactive (so this init re-runs
    // when the key is cleared); writing it back in the same run is intentional
    // and settles after one re-run (key now present).
    await credentialsJson.merge(
      effects,
      { apiKey: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 }) },
      { allowWriteAfterConst: true },
    )
  }

  // Prompt for a model whenever none is selected — covers first install and
  // guards against the selection being cleared from store.json.
  const serveArgs = await storeJson.read((s) => s.serveArgs).const(effects)
  if (!serveArgs || serveArgs.length === 0) {
    await sdk.action.createOwnTask(effects, setModel, 'critical', {
      reason: i18n('Select which AI model vLLM should serve'),
    })
  }
})
