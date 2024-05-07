'use client'

import './styles.scss'
import { BaseResponse, LatestTleSet, Satellite, Transmitter } from '@/app/api/types'
import dayjs from '@/app/utils/dayjs'
import { CSSProperties, ReactNode, useState } from 'react'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { IconSpinner } from '@/components/Icon/IconSpinner'
import { Button, Pagination, Select, SideSheet, Tooltip } from '@douyinfe/semi-ui'
import useSWR, { SWRConfig } from 'swr'
import { ObserverLocationStore, SatelliteSighting } from '@/types/types'
import Image from 'next/image'
import { TransponderCard } from '@/app/satellites/TransponderCard'
import { TablerAngle } from '@/components/Icon/TablerAngle'
import { TablerClock } from '@/components/Icon/TablerClock'
import { TablerWaveSine } from '@/components/Icon/TablerWaveSine'
import { TablerRoute } from '@/components/Icon/TablerRoute'
import IconNoObserve from '@/components/IconNoObserve'

const NationalFlag = ({ countries }: { countries: string }) => {
  const countriesList = countries.split(',')
  const firstCountry = countriesList[0]

  return (
    <div className={ 'relative' }>
      <div
        title={ countries }
        className={ 'w-6 h-[18px] rounded overflow-hidden border dark:border-neutral-700 box-content shadow leading-none' }
      >
        <Icon
          icon={ firstCountry ? `flag:${ firstCountry.toLowerCase() }-4x3` : 'tabler:help-circle-filled' }
          width={ 24 }
          height={ 18 }
          className={ 'block text-neutral-500' }
        />
      </div>
      { countriesList.length > 1 && (
        <div
          className={ 'absolute -right-2 -bottom-2 w-4 h-4 p-0.5 bg-white dark:bg-neutral-900 border dark:border-neutral-700 rounded flex justify-center items-center' }
        >
          <span className={ `text-2xs font-medium ${ rubik.className }` }>
            { countriesList.length }
          </span>
        </div>
      ) }
    </div>
  )
}

const TableCell = ({
  children,
  className,
  style,
  colSpan,
  isHead,
  compact,
}: {
  children?: ReactNode,
  className?: string
  style?: CSSProperties
  colSpan?: number
  isHead?: boolean
  compact?: boolean
}) => (
  isHead
    ? (
      <th
        colSpan={ colSpan }
        style={ style }
        className={ `px-4 py-4 text-sm ${ noto_sc.className } ${ className }` }
      >
        { children }
      </th>
    )
    : (
      <td
        colSpan={ colSpan }
        style={ style }
        className={ `px-4 text-sm ${ compact ? 'py-2' : 'py-4' } ${ rubik.className } ${ className }` }
      >
        { children }
      </td>
    )
)

const SatelliteTableRow = ({
  satellite,
  tle,
  location,
  compact,
}: {
  satellite: Satellite,
  tle: LatestTleSet | null
  location?: Exclude<ObserverLocationStore, 'pending'> | null
  compact?: boolean
}) => {
  const [expanded, setExpanded] = useState(false)
  const [sidePopVisible, setSidePopVisible] = useState(false)

  const shimmer = (w: number, h: number) => `
    <svg width="${ w }" height="${ h }" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${ w }" height="${ h }" fill="#333" />
      <rect id="r" width="${ w }" height="${ h }" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${ w }" to="${ w }" dur="1s" repeatCount="indefinite"  />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  const SideLoadingPlaceholder = ({
    text,
    loading = true,
    className,
  }: {
    text: string,
    loading?: boolean
    className?: string
  }) => (
    <div className={ `w-full flex items-center gap-1 p-3 rounded-lg border dark:border-neutral-600 ${ className }` }>
      { loading && <IconSpinner/> }
      <p>{ text }</p>
    </div>
  )

  const transmitterModes = [
    {
      'value': 90,
      'label': '4FSK',
    },
    {
      'value': 49,
      'label': 'AFSK',
    },
    {
      'value': 78,
      'label': 'AFSK TUBiX10',
    },
    {
      'value': 17,
      'label': 'AHRPT',
    },
    {
      'value': 19,
      'label': 'AM',
    },
    {
      'value': 44,
      'label': 'APT',
    },
    {
      'value': 93,
      'label': 'ASK',
    },
    {
      'value': 50,
      'label': 'BPSK',
    },
    {
      'value': 83,
      'label': 'BPSK PMT-A3',
    },
    {
      'value': 59,
      'label': 'CERTO',
    },
    {
      'value': 6,
      'label': 'CW',
    },
    {
      'value': 95,
      'label': 'DBPSK',
    },
    {
      'value': 96,
      'label': 'DOKA',
    },
    {
      'value': 97,
      'label': 'DPSK',
    },
    {
      'value': 71,
      'label': 'DQPSK',
    },
    {
      'value': 98,
      'label': 'DSB',
    },
    {
      'value': 57,
      'label': 'DSTAR',
    },
    {
      'value': 58,
      'label': 'DUV',
    },
    {
      'value': 92,
      'label': 'DVB-S2',
    },
    {
      'value': 82,
      'label': 'FFSK',
    },
    {
      'value': 1,
      'label': 'FM',
    },
    {
      'value': 7,
      'label': 'FMN',
    },
    {
      'value': 72,
      'label': 'FSK',
    },
    {
      'value': 84,
      'label': 'FSK AX.100 Mode 5',
    },
    {
      'value': 85,
      'label': 'FSK AX.100 Mode 6',
    },
    {
      'value': 88,
      'label': 'FSK AX.25 G3RUH',
    },
    {
      'value': 75,
      'label': 'GFSK',
    },
    {
      'value': 68,
      'label': 'GFSK Rktr',
    },
    {
      'value': 94,
      'label': 'GFSK/BPSK',
    },
    {
      'value': 63,
      'label': 'GMSK',
    },
    {
      'value': 91,
      'label': 'GMSK USP',
    },
    {
      'value': 45,
      'label': 'HRPT',
    },
    {
      'value': 89,
      'label': 'LoRa',
    },
    {
      'value': 53,
      'label': 'LRPT',
    },
    {
      'value': 20,
      'label': 'LSB',
    },
    {
      'value': 77,
      'label': 'MFSK',
    },
    {
      'value': 81,
      'label': 'MSK',
    },
    {
      'value': 86,
      'label': 'MSK AX.100 Mode 5',
    },
    {
      'value': 87,
      'label': 'MSK AX.100 Mode 6',
    },
    {
      'value': 61,
      'label': 'OFDM',
    },
    {
      'value': 76,
      'label': 'OQPSK',
    },
    {
      'value': 74,
      'label': 'PSK',
    },
    {
      'value': 40,
      'label': 'PSK31',
    },
    {
      'value': 41,
      'label': 'PSK63',
    },
    {
      'value': 69,
      'label': 'QPSK',
    },
    {
      'value': 42,
      'label': 'QPSK31',
    },
    {
      'value': 43,
      'label': 'QPSK63',
    },
    {
      'value': 5,
      'label': 'SSTV',
    },
    {
      'value': 9,
      'label': 'USB',
    },
    {
      'value': 64,
      'label': 'WSJT',
    },
  ]

  const [sightHours, setSightHours] = useState(24)
  const [sightElevation, setSightElevation] = useState(10)
  const [transmitterMode, setTransmitterMode] = useState(0)
  const [transmitterService, setTransmitterService] = useState('Amateur')

  const {
    data: sightingData,
    isLoading: isSightingLoading,
  } = useSWR<SatelliteSighting[]>(sidePopVisible && {
    resource: 'https://ham-api.c5r.app/sat/sightings',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tle0: tle?.tle0,
        tle1: tle?.tle1,
        tle2: tle?.tle2,
        hours: sightHours,
        elevation_threshold: sightElevation,
        observer: {
          lat: location?.latitude || 0,
          lon: location?.longitude || 0,
          alt: location?.altitude || 0,
        },
      }),
    },
  })

  const {
    data: transmittersData,
    isLoading: isTransmittersLoading,
  } = useSWR<BaseResponse<Transmitter[]>>(sidePopVisible && {
    resource: `/api/satellite/satnogs/${ encodeURIComponent(`transmitters/?format=json${ transmitterService === 'all' ? '' : '&service=' + transmitterService }&alive=true&satellite__norad_cat_id=${ satellite.norad_cat_id }${ transmitterMode !== 0 ? '&mode=' + transmitterMode : '' }`) }`,
  }, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  // noinspection RequiredAttributes
  return (
    <>
      <tr
        className={ `cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition border-y dark:border-y-neutral-700 ${ expanded && 'border-b-transparent' }` }
      >
        <TableCell compact={ compact } className={ 'w-10' }>
          <div className={ 'flex items-center gap-1' }>
            <Button
              theme={ 'borderless' }
              icon={ <IconNoObserve icon={ expanded ? 'tabler:chevron-down' : 'tabler:chevron-right' }
                                    className={ 'text-neutral-500' }/> }
              onClick={ () => setExpanded(!expanded) }
            />
            {/* TODO: Satellite bookmark */ }
            {/*<Button*/ }
            {/*  theme={ 'borderless' }*/ }
            {/*  icon={ <IconNoObserve icon={ 'tabler:star' } className={ 'text-neutral-500' }/> }*/ }
            {/*/>*/ }
          </div>
        </TableCell>
        <TableCell compact={ compact }>
          <div className={ `flex items-center ${ compact ? 'gap-2' : 'gap-3' }` }>
            <div className={ 'flex-0' }>
              <NationalFlag countries={ satellite.countries }/>
            </div>
            <span
              title={ satellite.names || satellite.name }
              className={ 'flex-1 text-ellipse overflow-hidden' }
            >
              { satellite.name }
            </span>
          </div>
        </TableCell>
        <TableCell compact={ compact }>{ satellite.norad_cat_id }</TableCell>
        <TableCell compact={ compact }>
          { satellite.launched ? dayjs(satellite.launched).format('YYYY-MM-DD') : '-' }
        </TableCell>
        <TableCell compact={ compact } className={ 'w-10 text-opacity-90' }>
          <Button
            theme={ 'borderless' }
            type={ 'tertiary' }
            icon={ <IconNoObserve icon={ 'tabler:info-circle' } className={ 'text-lg' }/> }
            onClick={ () => setSidePopVisible(true) }
          >
            数据
          </Button>
        </TableCell>
      </tr>
      { expanded && (
        <tr
          style={ {
            boxShadow: '0px 16px 24px -20px rgba(0, 0, 0, 0.15)',
          } }
        >
          <TableCell
            colSpan={ 5 }
          >
            <div className={ 'w-full px-8 flex flex-wrap gap-8' }>
              { satellite.image && (
                <div className={ 'w-64 h-fit rounded-lg overflow-hidden' }>
                  <Image
                    width={ 256 }
                    height={ 192 }
                    src={ `https://db-satnogs.freetls.fastly.net/media/${ satellite.image }` }
                    alt={ satellite.name || satellite.names || `${ satellite.norad_cat_id }` }
                    placeholder={ `data:image/svg+xml;base64,${ toBase64(shimmer(700, 475)) }` }
                    className={ 'object-cover' }
                  />
                </div>
              ) }
              <dl className={ `grid grid-cols-2 gap-2 text-sm w-fit h-fit ${ noto_sc.className }` }>
                { satellite.names && (
                  <>
                    <dt>卫星别名</dt>
                    <dd>{ satellite.names }</dd>
                  </>
                ) }
                <dt>NORAD ID</dt>
                <dd>{ satellite.norad_cat_id || '未知' }</dd>
                <dt>SatNOGS ID</dt>
                <dd>{ satellite.sat_id || '未知' }</dd>
              </dl>
              <dl className={ `grid grid-cols-2 gap-2 text-sm w-fit h-fit ${ noto_sc.className }` }>
                { satellite.launched && (
                  <>
                    <dt>发射日期</dt>
                    <dd>{ dayjs(satellite.launched).format('YYYY-MM-DD') }</dd>
                  </>
                ) }
                { satellite.deployed && (
                  <>
                    <dt>部署日期</dt>
                    <dd>{ dayjs(satellite.deployed).format('YYYY-MM-DD') }</dd>
                  </>
                ) }
                { satellite.decayed && (
                  <>
                    <dt>衰变日期</dt>
                    <dd>{ dayjs(satellite.decayed).format('YYYY-MM-DD') }</dd>
                  </>
                ) }
                { satellite.associated_satellites.length > 0 && (
                  <>
                    <dt>相关卫星</dt>
                    <dd>{ satellite.associated_satellites.join(', ') }</dd>
                  </>
                ) }
              </dl>
            </div>
          </TableCell>
        </tr>
      ) }
      <SideSheet
        title={ `${ satellite.name } 过境和收发器` }
        visible={ sidePopVisible }
        onCancel={ () => setSidePopVisible(false) }
        size={ 'medium' }
        className={ '!w-full md:!w-auto' }
      >
        <div className={ 'flex justify-between items-center mb-2' }>
          <h1
            className={ `text-base font-bold ${ noto_sc.className }` }
          >
            <IconNoObserve icon={ 'tabler:planet' } className={ 'text-xl mr-1 mt-0.5' } inline/>
            <span>未来过境</span>
          </h1>
          <div className={ 'flex items-center gap-2' }>
            <Select
              defaultValue={ 24 }
              value={ sightHours }
              onChange={ value => setSightHours(value as number) }
              disabled={ isSightingLoading }
              prefix={ <TablerClock className={ 'mx-2' }/> }
            >
              <Select.Option value={ 12 }>12 小时</Select.Option>
              <Select.Option value={ 24 }>24 小时</Select.Option>
              <Select.Option value={ 48 }>48 小时</Select.Option>
            </Select>
            <Tooltip content={ '仰角阈值' }>
              <Select
                defaultValue={ 10 }
                value={ sightElevation }
                onChange={ value => setSightElevation(value as number) }
                disabled={ isSightingLoading }
                prefix={ <TablerAngle className={ 'mx-2' }/> }
              >
                <Select.Option value={ 0 }>0°</Select.Option>
                <Select.Option value={ 10 }>10°</Select.Option>
                <Select.Option value={ 20 }>20°</Select.Option>
                <Select.Option value={ 30 }>30°</Select.Option>
                <Select.Option value={ 40 }>40°</Select.Option>
                <Select.Option value={ 50 }>50°</Select.Option>
              </Select>
            </Tooltip>
          </div>
        </div>
        <div className={ 'mb-6' }>
          { isSightingLoading
            ? (
              <SideLoadingPlaceholder text={ '加载卫星过境...' }/>
            )
            : (
              (sightingData && sightingData.length > 0)
                ? (
                  <div className={ 'grid grid-cols-1 md:grid-cols-2 gap-2' }>
                    { sightingData.map((sighting, index) => (
                      <div
                        key={ index }
                        className={ `w-full px-3 py-2 flex flex-col gap-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded ${ rubik.className }` }
                      >
                        <div className={ 'w-full flex items-center justify-center' }>
                          <div className={ 'flex items-center font-medium gap-1' }>
                            <span>{ dayjs(sighting.rise.time).format('YYYY-MM-DD') }</span>
                          </div>
                        </div>
                        <div className={ 'w-full flex items-center justify-between' }>
                          <div className={ 'flex items-center gap-1' }>
                            <IconNoObserve icon={ 'tabler:arrow-down-from-arc' }
                                           className={ 'text-primary text-base' }/>
                            <span>{ dayjs(sighting.rise.time).format('HH:mm:ss') }</span>
                          </div>
                          <div
                            title={ `${ dayjs(sighting.rise.time).format('YYYY-MM-DD HH:mm:ss') } 入境，持续 ${
                              Math.floor((dayjs(sighting.set.time).unix() - dayjs(sighting.rise.time).unix()) / 60)
                            } 分钟` }
                            className={ 'flex items-center gap-1' }
                          >
                            <IconNoObserve icon={ 'tabler:clock' } className={ 'text-primary text-base' }/>
                            <span>{ Math.floor((dayjs(sighting.set.time).unix() - dayjs(sighting.rise.time).unix()) / 60) }min</span>
                          </div>
                          <div className={ 'flex items-center gap-1' }>
                            <IconNoObserve icon={ 'tabler:arrow-down-to-arc' } className={ 'text-primary text-base' }/>
                            <span>{ dayjs(sighting.set.time).format('HH:mm:ss') }</span>
                          </div>
                        </div>
                        <div className={ 'w-full flex items-center justify-between' }>
                          <div
                            title={ '入境方位' }
                            className={ 'flex items-center gap-1' }
                          >
                            <IconNoObserve icon={ 'tabler:compass' } className={ 'text-primary text-base' }/>
                            <span><span className={ noto_sc.className }>入</span>: { sighting.rise.azimuth }°</span>
                          </div>
                          <div
                            title={ `最高仰角: ${ dayjs(sighting.culminate.time).format('YYYY-MM-DD HH:mm:ss') }` }
                            className={ 'flex items-center gap-1' }
                          >
                            <IconNoObserve icon={ 'tabler:angle' } className={ 'text-primary text-base' }/>
                            <span>{ sighting.culminate.elevation }°</span>
                          </div>
                          <div
                            title={ '离境方位' }
                            className={ 'flex items-center gap-1' }
                          >
                            <IconNoObserve icon={ 'tabler:compass' } className={ 'text-primary text-base' }/>
                            <span><span className={ noto_sc.className }>离</span>: { sighting.set.azimuth }°</span>
                          </div>
                        </div>
                      </div>
                    )) }
                  </div>
                )
                : (
                  <SideLoadingPlaceholder
                    text={ `${ satellite.name || '未知卫星' } 在 ${ sightHours } 小时内暂无 ${ sightElevation }° 以上过境` }
                    loading={ false }
                  />
                )
            )
          }
        </div>

        <div className={ 'flex justify-between items-center mb-2' }>
          <h1
            className={ `text-base font-bold ${ noto_sc.className }` }
          >
            <IconNoObserve icon={ 'tabler:arrows-transfer-down' } className={ 'text-xl mr-1' } inline/>
            <span>卫星收发器</span>
          </h1>
          <div className={ 'flex items-center gap-2' }>
            <Tooltip content={ '调制模式' }>
              <Select
                optionList={ [
                  {
                    label: '全部',
                    value: 0,
                  }, ...transmitterModes,
                ] }
                defaultValue={ 0 }
                value={ transmitterMode }
                onChange={ value => setTransmitterMode(value as number) }
                disabled={ isTransmittersLoading }
                prefix={ <TablerWaveSine className={ 'mx-2' }/> }
                position={ 'bottomRight' }
              />
            </Tooltip>
            <Tooltip content={ '业务类型' }>
              <Select
                optionList={ [
                  {
                    label: '业余业务',
                    value: 'Amateur',
                  },
                  {
                    label: '所有业务',
                    value: 'all',
                  },
                ] }
                defaultValue={ 'Amateur' }
                value={ transmitterService }
                onChange={ value => setTransmitterService(value as string) }
                disabled={ isTransmittersLoading }
                prefix={ <TablerRoute className={ 'mx-2' }/> }
                position={ 'bottomRight' }
              />
            </Tooltip>
          </div>
        </div>
        <div className={ 'mb-6' }>
          { isTransmittersLoading
            ? (
              <SideLoadingPlaceholder text={ '加载收发器列表...' }/>
            )
            : (
              (transmittersData?.data && transmittersData.data.length > 0)
                ? (
                  <div className={ 'grid grid-cols-1 md:grid-cols-2 gap-2 mb-2' }>
                    { transmittersData.data.map(transponder => (
                      <TransponderCard transmitter={ transponder } key={ transponder.uuid }/>
                    )) }
                  </div>
                )
                : (
                  <SideLoadingPlaceholder
                    text={ `${ satellite.name || '未知卫星' } ${
                      transmitterService === 'Amateur' ? '在业余业务中' : ''
                    }没有${
                      transmitterMode === 0 ? '可用' : ' ' + transmitterModes.find(i => i.value === transmitterMode)?.label + ' 调制模式的'
                    }收发器` }
                    loading={ false }
                  />
                )
            )
          }
        </div>
      </SideSheet>
    </>
  )
}

export const SatelliteTable = ({
  satellites,
  tleList,
  location,
  compact,
  loading,
  filteredValue,
  pagination,
  setPagination,
  sorter,
}: {
  satellites: Satellite[]
  filteredValue?: string[]
  tleList: LatestTleSet[]
  location?: Exclude<ObserverLocationStore, 'pending'> | null
  compact?: boolean
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
  },
  setPagination?: (pagination: { current: number, pageSize: number }) => void
  sorter?: ((a: Satellite, b: Satellite) => number)
}) => {
  // const [timestamp, setTimestamp] = useState(dayjs().unix())
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimestamp(dayjs().unix())
  //   }, 5000)
  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [])
  const filteredSatellites = satellites.filter(sat => {
    if (filteredValue && filteredValue.length > 0) {
      return (
        filteredValue.some(f => sat.name?.toLowerCase().includes(f.toLowerCase())
          || sat.names?.toLowerCase().includes(f.toLowerCase())
          || `${ sat.norad_cat_id || '' }`.includes(f),
        )
      )
    }
    return true
  }).sort(sorter)

  return (
    <>
      <div className={ 'w-full relative overflow-hidden overflow-x-auto' }>
        { loading && (
          <div
            className={ 'absolute inset-0 flex flex-col justify-center items-center bg-white/70 dark:bg-neutral-900/70' }>
            <IconSpinner className={ 'text-4xl' }/>
          </div>
        ) }
        <table className={ `w-full table-auto border-collapse` }>
          <thead className={ 'text-left' }>
          <tr>
            <TableCell isHead></TableCell>
            <TableCell isHead>卫星</TableCell>
            <TableCell isHead>NORAD ID</TableCell>
            <TableCell isHead>发射日期</TableCell>
            <TableCell isHead></TableCell>
          </tr>
          </thead>
          <tbody>
          { satellites.length === 0 && (
            <tr>
              <TableCell className={ 'text-center' } colSpan={ 5 }>暂无数据</TableCell>
            </tr>
          ) }
          <SWRConfig value={ {
            fetcher: ({ resource, init }: {
              resource: string | URL | Request,
              init: RequestInit | undefined
            }) => fetch(resource, init).then(res => res.json()),
          } }>
            { filteredSatellites.slice(
              (pagination?.current || 1) * (pagination?.pageSize || 10) - (pagination?.pageSize || 10),
              (pagination?.current || 1) * (pagination?.pageSize || 10),
            ).map((satellite, index) => (
              <SatelliteTableRow
                key={ satellite.norad_cat_id || satellite.norad_follow_id || satellite.sat_id || index }
                satellite={ satellite }
                tle={ tleList.find(i => i.norad_cat_id === satellite.norad_cat_id) || null }
                location={ location }
                compact={ compact }
              />
            )) }
          </SWRConfig>
          </tbody>
          <caption
            className={ `text-xs py-4 text-neutral-500 dark:text-neutral-400 caption-bottom ${ noto_sc.className }` }
          >
            <div className={ 'w-full flex justify-end' }>
              <Pagination
                total={ filteredSatellites.length || satellites.length }
                pageSize={ pagination?.pageSize || 10 }
                currentPage={ pagination?.current || 1 }
                hideOnSinglePage
                onPageChange={ page => {
                  setPagination?.({
                    pageSize: pagination?.pageSize || 10,
                    ...pagination,
                    current: page,
                  })
                  setTimeout(() => {
                    window?.scrollTo({
                      behavior: 'smooth',
                      top: 0,
                    })
                  }, 200)
                } }
              />
            </div>
            星历数据来源 <a href={ 'https://db.satnogs.org/' } target={ '_blank' }>SatNOGS DB</a> | <a
            href={ 'https://ham-api.c5r.app/docs' } target={ '_blank' }>卫星过境信息计算接口</a>
          </caption>
          {/* TODO: #1 Pagination */ }
        </table>
      </div>
    </>
  )
}