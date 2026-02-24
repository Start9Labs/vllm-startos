import { sdk } from '../sdk'
import { getApiCredentials } from './getApiCredentials'
import { setModel } from './setModel'
import { deleteModelCache } from './deleteModelCache'

export const actions = sdk.Actions.of()
  .addAction(getApiCredentials)
  .addAction(setModel)
  .addAction(deleteModelCache)
