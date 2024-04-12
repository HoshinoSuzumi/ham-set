'use client'

import './styles.scss'
import { useRef, useState } from 'react'
import useSWR from 'swr'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { Banner, Input } from '@douyinfe/semi-ui'
import { IconSearch } from '@douyinfe/semi-icons'
import { BaseResponse, LatestTleSet, Satellite } from '@/app/api/types'
import { SatelliteTable } from '@/app/satellites/SatelliteTable'

export const Main = () => {
  const compositionRef = useRef({ isComposition: false })
  const [filteredValue, setFilteredValue] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const {
    data: satellitesData,
    isLoading: isSatellitesLoading,
    error: satellitesError,
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
        { satellitesData && satellitesData.code !== 0 && (
          <Banner
            className={ 'mb-4 mx-4 md:mx-0' }
            fullMode={ false }
            title="加载失败"
            type="danger"
            bordered
            description="加载卫星数据时出现错误，请检查网络"
          ></Banner>
        ) }

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