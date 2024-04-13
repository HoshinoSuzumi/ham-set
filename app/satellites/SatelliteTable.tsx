'use client'

import './styles.scss'
import { BaseResponse, LatestTleSet, Satellite, Transmitter } from '@/app/api/types'
import dayjs from '@/app/utils/dayjs'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { IconSpinner } from '@/components/Icon/IconSpinner'
import { Button, SideSheet } from '@douyinfe/semi-ui'
import useSWR, { SWRConfig } from 'swr'
import { SatelliteSighting } from '@/types/types'
import Image from 'next/image'
import { TransponderCard } from '@/app/satellites/TransponderCard'

const NationalFlag = ({ countries }: { countries: string }) => {
  const countriesList = countries.split(',')
  const firstCountry = countriesList[0]

  return (
    <div className={ 'relative' }>
      <div
        title={ countries }
        className={ 'w-6 h-[18px] rounded overflow-hidden border box-content shadow leading-none' }
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
          className={ 'absolute -right-2 -bottom-2 w-4 h-4 p-0.5 bg-white border rounded flex justify-center items-center' }
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
  timestamp,
  compact,
}: {
  satellite: Satellite,
  tle: LatestTleSet | null,
  timestamp: number,
  compact?: boolean
}) => {
  const [expanded, setExpanded] = useState(false)
  const [sidePopVisible, setSidePopVisible] = useState(false)

  const shimmer = (w: number, h: number) => `
    <svg width="${ w }" height="${ h }" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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

  const SideLoadingPlaceholder = ({ text }: { text: string }) => (
    <div className={ 'w-full flex items-center gap-1 p-3 rounded-lg border' }>
      <IconSpinner/>
      <p>{ text }</p>
    </div>
  )

  const {
    data: sightingData,
    isLoading: isSightingLoading,
  } = useSWR<SatelliteSighting[]>(expanded && {
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
        hours: 24,
        elevation_threshold: 20,
        observer: {
          lat: 0,
          lon: 0,
          alt: 0,
        },
      }),
    },
  })

  const {
    data: transmittersData,
    isLoading: isTransmittersLoading,
  } = useSWR<BaseResponse<Transmitter[]>>(sidePopVisible && {
    resource: `/api/satellite/satnogs/${ encodeURIComponent(`transmitters/?format=json&service=Amateur&sat_id=${ satellite.sat_id }`) }`,
  }, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  // noinspection RequiredAttributes
  return (
    <>
      <tr
        className={ `cursor-pointer hover:bg-neutral-50 transition border-y ${ expanded && 'border-b-transparent' }` }
      >
        <TableCell compact={ compact } className={ 'w-10' }>
          <div className={ 'flex items-center gap-1' }>
            <Button
              theme={ 'borderless' }
              icon={ <Icon icon={ expanded ? 'tabler:chevron-down' : 'tabler:chevron-right' }
                           className={ 'text-neutral-500' }/> }
              onClick={ () => setExpanded(!expanded) }
            />
            {/* TODO: Satellite bookmark */ }
            {/*<Button*/ }
            {/*  theme={ 'borderless' }*/ }
            {/*  icon={ <Icon icon={ 'tabler:star' } className={ 'text-neutral-500' }/> }*/ }
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
            icon={ <Icon icon={ 'tabler:arrows-transfer-down' } className={ 'text-lg' }/> }
            onClick={ () => setSidePopVisible(true) }
          >
            收发器
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
        title={ '卫星过境和收发器信息' }
        visible={ sidePopVisible }
        onCancel={ () => setSidePopVisible(false) }
        size={ 'medium' }
        className={ '!w-full md:!w-auto' }
      >
        { isTransmittersLoading ? <SideLoadingPlaceholder text={ '加载中继列表...' }></SideLoadingPlaceholder>
          : <div className={ 'grid grid-cols-1 md:grid-cols-2 gap-2' }>
            { transmittersData?.data && transmittersData.data.map(transponder => (
              <TransponderCard transmitter={ transponder } key={ transponder.norad_cat_id || transponder.sat_id }/>
            )) }
          </div>
        }
      </SideSheet>
    </>
  )
}

export const SatelliteTable = ({
  satellites,
  tleList,
  compact,
  loading,
  filteredValue,
  pagination,
  sorter,
}: {
  satellites: Satellite[]
  filteredValue?: string[]
  tleList: LatestTleSet[]
  compact?: boolean
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
  },
  sorter?: ((a: Satellite, b: Satellite) => number)
}) => {
  const [timestamp, setTimestamp] = useState(dayjs().unix())
  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(dayjs().unix())
    }, 5000)
    return () => {
      clearInterval(timer)
    }
  }, [])
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
                timestamp={ timestamp }
                compact={ compact }
              />
            )) }
          </SWRConfig>
          </tbody>
          <caption
            className={ `text-xs py-4 text-neutral-500 dark:text-neutral-400 caption-bottom ${ noto_sc.className }` }
          >
            星历数据来源 <a href={ 'https://db.satnogs.org/' } target={ '_blank' }>SatNOGS DB</a> | <a
            href={ 'https://ham-api.c5r.app/docs' } target={ '_blank' }>卫星过境信息计算接口</a>
          </caption>
        </table>
      </div>
    </>
  )
}