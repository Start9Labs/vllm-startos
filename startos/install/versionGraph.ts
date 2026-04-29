import { VersionGraph } from '@start9labs/start-sdk'
import * as base from './versions'
import * as nvidia from './versions/nvidia'

const variant = process.env.VARIANT || 'cpu'

const allOther = [base.current, ...base.other, nvidia.current, ...nvidia.other]

export const versionGraph = VersionGraph.of({
  current: variant === 'nvidia' ? nvidia.current : base.current,
  other: allOther.filter(
    (v) => v !== (variant === 'nvidia' ? nvidia.current : base.current),
  ),
})
