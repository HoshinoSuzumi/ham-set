import {Main} from '@/app/satellites/Main'
import {Metadata} from 'next'

export const metadata: Metadata = {
  title: '业余无线电卫星数据库',
  description: '业余无线电卫星数据库',
}

export interface FrequenciesRawData {
  status: string
  name: string
  norad_id: string
  satnogs_id: string
  uplink: string
  downlink: string
  beacon: string
  mode: string
}

export interface Transponder {
  uplink?: string
  downlink?: string
  beacon?: string
  mode?: string
  callsign?: string
  status: string
}

export interface FrequenciesData {
  name: string
  norad_id: string
  satnogs_id: string
  transponders: Transponder[]
}

export default function Page() {
  return <Main/>
}