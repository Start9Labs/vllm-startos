import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { credentialsJson } from '../fileModels/credentials.json'

/**
 * Keep the public credentials.json in sync with the apiKey stored in the
 * private store.json.
 *
 * Uses `.const(effects)` to register a reactive watcher on the apiKey
 * field — whenever it changes (rotation, restore-from-backup, fresh
 * install) this init re-runs and rewrites the public file. The watcher
 * lives for the container lifetime and re-registers on every container
 * rebuild because it lives inside `setupOnInit`.
 */
export const syncCredentials = sdk.setupOnInit(async (effects, _kind) => {
  const apiKey = await storeJson.read((s) => s.apiKey).const(effects)
  if (apiKey) {
    await credentialsJson.write(effects, { apiKey })
  }
})
