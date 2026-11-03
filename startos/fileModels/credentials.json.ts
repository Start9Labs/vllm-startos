import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Public credentials file. Lives on the `public` volume so that other
 * StartOS services depending on vLLM can mount it read-only and discover
 * the API key and the served model name without having to invoke an action
 * or scrape the main volume.
 */
const shape = z.looseObject({
  apiKey: z.string(),
  // The name vLLM answers to; '' while no model is selected.
  model: z.string().catch(''),
})

export const credentialsJson = FileHelper.json(
  { base: sdk.volumes.public, subpath: 'credentials.json' },
  shape,
)
