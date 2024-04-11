'use client'

import { getVisibleSatellites, TLE } from 'tle.js'

export const getPasses = (
  tle: TLE,
  startMS: number,
  endMS: number,
  stepMS: number = 1000,
) => {
  const passes = []

  let ms = startMS
  let prevElevation = 0

  while (ms <= endMS) {
    try {
      const pass = getVisibleSatellites({
        tles: [tle],
        observerLat: 29.590509292552934,
        observerLng: 106.31482098268704,
        observerHeight: 240,
        elevationThreshold: 20,
        timestampMS: ms / 1000,
      })
      if (pass && pass.length > 0) {
        passes.push(pass[0])
      }
    } catch (e) {
      console.error(e)
    }
    ms += stepMS
  }

  return passes
}