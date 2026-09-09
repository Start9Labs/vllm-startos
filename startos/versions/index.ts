import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_28_0_0 } from './v0.28.0_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_28_0_0],
})
