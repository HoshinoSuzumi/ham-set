'use client'

import './styles.scss'
import { Key, useRef, useState } from 'react'
import { ColumnProps } from '@douyinfe/semi-ui/lib/es/table'
import useSWR from 'swr'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { Input, Table } from '@douyinfe/semi-ui'
import { IconSearch } from '@douyinfe/semi-icons'
import { BaseResponse, LatestTleSet, Satellite, Transmitter } from '@/app/api/types'
import { getSatelliteInfo } from 'tle.js'

export const Main = () => {
  const compositionRef = useRef({ isComposition: false })
  const [filteredValue, setFilteredValue] = useState<Satellite[]>([])

  const columns: ColumnProps<Satellite>[] = [
    {
      title: '收发器',
      dataIndex: 'transmitters',
      width: 100,
      align: 'center',
      render: (record: Satellite) => {
        const transmitters = transmittersData?.data?.filter(t => t.norad_cat_id === record?.norad_cat_id)
        return (
          <div
            className={ 'mx-auto flex w-10 h-1.5 rounded-lg bg-black overflow-hidden divide-x dark:divide-neutral-700' }>
            { transmitters?.map((transmitter: Transmitter, index: Key | null | undefined) => (
              <div
                key={ index }
                style={ {
                  width: 1 / transmitters.length * 100 + '%',
                } }
                className={ `h-full ${ transmitter.status === 'active' ? 'bg-green-500' : transmitter.status === 'inactive' ? 'bg-red-500' : 'bg-gray-300' }` }
              ></div>
            )) }
          </div>
        )
      },
    },
    {
      title: '卫星名称',
      dataIndex: 'name',
      sorter: (a, b) => a?.name.localeCompare(b?.name || '') || 0,
      onFilter: (value, record) => {
        const lowerValue = value.toLowerCase()
        return record?.name.toLowerCase().includes(lowerValue) || `${ record?.norad_cat_id || '' }`.includes(lowerValue) || false
      },
      filteredValue,
    },
    {
      title: 'NORAD ID',
      dataIndex: 'norad_cat_id',
    },
    {
      title: 'Position',
      render: (record) => {
        const tleRaw = tleData?.data?.find(tleItem => tleItem?.norad_cat_id == record?.norad_cat_id)
        if (!tleRaw) return 'none'
        const tle = getSatelliteInfo(
          [tleRaw.tle0, tleRaw.tle1, tleRaw.tle2],
          new Date().getMilliseconds(),
        )
        return (
          <pre>Lat: { tle.lat.toFixed(5) } | Lng: { tle.lng.toFixed(5) } | Ele: { tle.elevation.toFixed(2) }°</pre>
        )
      },
    },
  ]

  const {
    data: satellitesData,
    isLoading: isSatellitesLoading,
  } = useSWR<BaseResponse<Satellite[]>>('/api/satellite/satnogs/satellites', {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  const {
    data: transmittersData,
    isLoading: isTransmittersLoading,
  } = useSWR<BaseResponse<Transmitter[]>>(`/api/satellite/satnogs/${ encodeURIComponent('transmitters/?format=json&service=Amateur') }`, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

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
      <div className={ 'flex-1 w-full md:w-[80%]' }>
        <Table
          bordered
          rowKey={ 'name' }
          style={ rubik.style }
          columns={ columns }
          dataSource={ satellitesData?.data || [] }
          expandCellFixed
          expandedRowRender={ (record) => (
            <div>
              <pre>{ JSON.stringify(record, null, 2) }</pre>
            </div>
          ) }
          hideExpandedColumn={ false }
          pagination={ {
            pageSize: 30,
            position: 'both',
            formatPageText: (page) => `第 ${ page?.currentStart }-${ page?.currentEnd } 项，共 ${ page?.total } 组`,
          } }
          loading={ isSatellitesLoading }
        />
      </div>
    </div>
  )
}