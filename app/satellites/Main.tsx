'use client'

import './styles.scss'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { Input } from '@douyinfe/semi-ui'
import { IconSearch } from '@douyinfe/semi-icons'
import { BaseResponse, LatestTleSet, Satellite } from '@/app/api/types'
import { SatelliteTable } from '@/app/satellites/SatelliteTable'
import dayjs from '@/app/utils/dayjs'

export const Main = () => {
  const compositionRef = useRef({ isComposition: false })
  const [filteredValue, setFilteredValue] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const tle_case = [
    'ISS (ZARYA)',
    '1 25544U 98067A   23006.23627037  .00014367  00000+0  25952-3 0  9997',
    '2 25544  51.6447  50.7420 0004899 231.6381 243.6067 15.49962952376670',
  ]

  const startMS = dayjs().unix() * 1000 // current time
  const endMS = dayjs().add(1, 'day').unix() * 1000 // 1 day later

  // console.log(getPasses(tle_case as TLE, startMS, endMS, 1000))

  const {
    data: satellitesData,
    isLoading: isSatellitesLoading,
  } = useSWR<BaseResponse<Satellite[]>>('/api/satellite/satnogs/satellites', {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  // const {
  //   data: transmittersData,
  //   isLoading: isTransmittersLoading,
  // } = useSWR<BaseResponse<Transmitter[]>>(`/api/satellite/satnogs/${ encodeURIComponent('transmitters/?format=json&service=Amateur') }`, {
  //   refreshWhenHidden: false,
  //   refreshWhenOffline: false,
  // })

  const {
    data: tleData,
    isLoading: isTleLoading,
  } = useSWR<BaseResponse<LatestTleSet[]>>(`/api/satellite/satnogs/${ encodeURIComponent('tle?format=json') }`, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  function handleCompositionStart() {
    compositionRef.current.isComposition = true
  }

  function handleCompositionEnd(event: any) {
    compositionRef.current.isComposition = false
    const value = event.target?.value
    const newFilteredValue = value ? [value] : []
    setFilteredValue(newFilteredValue)
  }

  function handleChange(value: any) {
    if (compositionRef.current.isComposition) {
      return
    }
    const newFilteredValue = value ? [value] : []
    setFilteredValue(newFilteredValue)
  }

  return (
    <div className={ 'w-full h-full flex flex-col gap-8 items-center pt-8 md:p-8 bg-white dark:bg-neutral-900' }>
      <div>
        <h1 className={ `flex flex-col items-center text-lg font-medium ${ noto_sc.className }` }>
          <Icon icon={ 'tabler:satellite' } className={ 'text-4xl mb-2' }/>
          <span>业余无线电卫星数据库</span>
          <span className={ `text-xs opacity-50 ${ rubik.className }` }>Amateur Radio Satellites Database</span>
        </h1>
        <Input
          placeholder={ '搜索卫星名称、NORAD ID' }
          className={ '!w-64 mt-4' }
          size={ 'large' }
          disabled={ isSatellitesLoading }
          prefix={ <IconSearch/> }
          onCompositionStart={ handleCompositionStart }
          onCompositionEnd={ handleCompositionEnd }
          onChange={ handleChange }
        />
      </div>
      <div className={ 'w-full xl:w-[80%]' }>
        <SatelliteTable
          satellites={ (satellitesData?.data || []) }
          tleList={ tleData?.data || [] }
          loading={ isSatellitesLoading }
          compact={ false }
          filteredValue={ filteredValue }
          sorter={ (a, b) => {
            return a.name.localeCompare(b.name)
          } }
        />
      </div>
    </div>
  )
}