'use server'

import { LatestTleSet } from '@/app/api/types'

export async function getTle() {
  return new Promise<LatestTleSet[]>((resolve, reject) => {
    fetch('https://db-satnogs.freetls.fastly.net/api/tle/?format=json')
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
