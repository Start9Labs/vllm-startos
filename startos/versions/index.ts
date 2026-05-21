import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_16_0_0 } from './v0.16.0_0'
import { v_0_16_0_1 } from './v0.16.0_1'
import { v_0_16_0_2 } from './v0.16.0_2'

export const versionGraph = VersionGraph.of({
  current: v_0_16_0_2,
  other: [v_0_16_0_0, v_0_16_0_1],
})
