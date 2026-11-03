import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_29_0_0 } from './v0.29.0_0'
import { v_0_33_0_0 } from './v0.33.0_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_29_0_0, v_0_33_0_0],
})
