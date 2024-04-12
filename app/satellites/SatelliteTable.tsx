'use client'

import { LatestTleSet, Satellite } from '@/app/api/types'
import dayjs from '@/app/utils/dayjs'
import { CSSProperties, ReactNode, useEffect, useState } from 'react'
import { Icon } from '@iconify-icon/react'
import { noto_sc, rubik } from '@/app/fonts'
import { IconSpinner } from '@/components/Icon/IconSpinner'
import { Button } from '@douyinfe/semi-ui'
import useSWR, { SWRConfig } from 'swr'

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

  const {
    data: sightingData,
    isLoading: isSightingLoading,
  } = useSWR(expanded && {
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

  return (
    <>
      <tr
        className={ `cursor-pointer hover:bg-neutral-100 transition border-y ${ expanded && 'border-b-transparent' }` }
        onClick={ () => setExpanded(!expanded) }
      >
        <TableCell compact={ compact } className={ 'w-10' }>
          <div className={ 'flex items-center gap-1' }>
            <Icon observe={ false }
                  icon={ expanded ? 'tabler:chevron-down' : 'tabler:chevron-right' }
                  className={ 'text-neutral-500' }
            />
            <Button theme={ 'borderless' }
                    icon={ <Icon icon={ 'tabler:star' } className={ 'text-neutral-500' }/> }
            />
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
      </tr>
      { expanded && (
        <tr
          style={ {
            boxShadow: '0px 16px 24px -20px rgba(0, 0, 0, 0.15)',
          } }
        >
          <TableCell
            colSpan={ 3 }
          >
            <div>
              <pre>{ JSON.stringify(sightingData, null, 2) }</pre>
            </div>
          </TableCell>
        </tr>
      ) }
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
          </tr>
          </thead>
          <tbody>
          { satellites.length === 0 && (
            <tr>
              <TableCell className={ 'text-center' } colSpan={ 4 }>暂无数据</TableCell>
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
            className={ `text-xs pt-4 text-neutral-500 dark:text-neutral-400 caption-bottom ${ noto_sc.className }` }
          >
            数据来源于 <a href={ 'https://db.satnogs.org/' } target={ '_blank' }>SatNOGS DB</a>
          </caption>
        </table>
      </div>
    </>
  )
}