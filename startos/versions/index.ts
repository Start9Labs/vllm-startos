import { VersionGraph, VersionInfo } from '@start9labs/start-sdk'
import * as nvidia from './nvidia'
import { v_0_16_0_0 } from './v0.16.0_0'

const variant = process.env.VARIANT || 'cpu'

const baseCurrent = v_0_16_0_0
const baseOther: VersionInfo<string>[] = []

const allOther = [baseCurrent, ...baseOther, nvidia.current, ...nvidia.other]

export const versionGraph = VersionGraph.of({
  current: variant === 'nvidia' ? nvidia.current : baseCurrent,
  other: allOther.filter(
    (v) => v !== (variant === 'nvidia' ? nvidia.current : baseCurrent),
  ),
})
