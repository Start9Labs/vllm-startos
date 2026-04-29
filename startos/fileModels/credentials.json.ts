import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Public credentials file. Lives on the `public` volume so that other
 * StartOS services depending on vLLM can mount it read-only and discover
 * the API key without having to invoke an action or scrape the main
 * volume.
 */
const shape = z.object({
  apiKey: z.string(),
})

export const credentialsJson = FileHelper.json(
  { base: sdk.volumes.public, subpath: 'credentials.json' },
  shape,
)
