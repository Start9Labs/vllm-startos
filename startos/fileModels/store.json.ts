import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  serveArgs: z.array(z.string()).optional().catch(undefined),
  modelSelection: z
    .object({
      selection: z.string(),
      customArgs: z.string().optional(),
    })
    .optional()
    .catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
