import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const envVar = z.object({
  name: z.string(),
  value: z.string(),
})

const shape = z.object({
  serveArgs: z.array(z.string()).optional().catch(undefined),
  serveEnv: z.array(envVar).optional().catch(undefined),
  modelSelection: z
    .object({
      selection: z.string(),
      customArgs: z.string().optional(),
      customEnv: z.array(envVar).optional(),
    })
    .optional()
    .catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
