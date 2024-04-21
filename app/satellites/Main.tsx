'use client'

import './styles.scss'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { Icon } from '@iconify-icon/react'
import QRCode from 'react-qr-code'
import { noto_sc, rubik } from '@/app/fonts'
import { Banner, Button, Input, Modal, Toast, Tooltip } from '@douyinfe/semi-ui'
import { IconSearch } from '@douyinfe/semi-icons'
import { BaseResponse, LatestTleSet, Satellite } from '@/app/api/types'
import { SatelliteTable } from '@/app/satellites/SatelliteTable'
import { UUID, uuidv4 } from '@uniiem/uuid'
import { observerLocation } from '@/app/actions'
import { ObserverLocationStore } from '@/types/types'

export const Main = () => {
  const [origin, setOrigin] = useState('https://ham-dev.c5r.app')
  useEffect(() => {
    if (window.location.origin !== origin) {
      setOrigin(window.location.origin)
    }
  }, [origin])

  const compositionRef = useRef({ isComposition: false })
  const [filteredValue, setFilteredValue] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })

  const [mobileLocationRefId, setMobileLocationRefId] = useState<UUID | null>(null)
  const [mobileScanned, setMobileScanned] = useState(false)
  useEffect(() => {
    let timer = setInterval(() => {
      if (!mobileLocationRefId) return
      observerLocation(mobileLocationRefId).then(loc => {
        if (loc === 'pending') {
          setMobileScanned(true)
        } else if (typeof loc === 'object' && loc !== null) {
          setLocationFromMobile(loc)
          setMobileLocationRefId(null)
          Toast.success('获取手机位置成功')
        }
      })
    }, 2000)
    return () => {
      clearTimeout(timer)
    }
  }, [mobileLocationRefId])

  const [locationFromBrowser, setLocationFromBrowser] = useState<Exclude<ObserverLocationStore, 'pending'> | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const recommendMobileLocation = locationFromBrowser ? locationFromBrowser.accuracy > 1000 : false
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationFromBrowser({
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        setLocationError(error.message)
      },
      {
        enableHighAccuracy: true,
      },
    )
  }, [])
  const [locationFromMobile, setLocationFromMobile] = useState<Exclude<ObserverLocationStore, 'pending'> | null>(null)
  const location = locationFromMobile || locationFromBrowser

  // noinspection JSUnusedLocalSymbols
  const {
    data: satellitesData,
    isLoading: isSatellitesLoading,
    error: satellitesError,
  } = useSWR<BaseResponse<Satellite[]>>('/api/satellite/satnogs/satellites', {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  })

  // noinspection JSUnusedLocalSymbols
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

  // noinspection RequiredAttributes
  return (
    <>
      <div className={ 'w-full h-full flex flex-col gap-8 items-center pt-8 md:p-8 bg-white dark:bg-neutral-900' }>
        <div>
          <h1 className={ `flex flex-col items-center text-lg font-medium ${ noto_sc.className }` }>
            <Icon icon={ 'tabler:satellite' } className={ 'text-4xl mb-2' } noobserver/>
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
          <div
            className={ `flex justify-center items-center gap-2 pt-1 text-2xs font-medium opacity-50 ${ noto_sc.className }` }>
            <p>
              台站位置：
              <span className={ 'font-mono text-xs' }>
              { location ? `${ location.latitude.toFixed(6) }, ${ location.longitude.toFixed(6) }` : 'unknown' || 'loading...' }
            </span>
            </p>
            <div className={ 'flex items-center' }>
              { !locationFromMobile && (locationError || recommendMobileLocation) && (
                <Tooltip
                  content={ locationError ? locationError : (recommendMobileLocation ? '位置精度过低，建议使用手机扫码获取位置' : '') }
                  position={ 'bottom' }
                >
                  <Button
                    icon={ <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v4m-1.637-9.409L2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0zM12 16h.01"></path>
                    </svg> }
                    theme={ 'borderless' }
                    type={ locationError ? 'danger' : 'warning' }
                    size={ 'small' }
                  />
                </Tooltip>
              ) }
              { !locationFromMobile && (
                <Tooltip content={ '手机扫码获取位置' } position={ 'bottom' }>
                  <Button
                    icon={ <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm3 12v.01M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM7 7v.01M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm13-8v.01M14 14h3m3 0v.01M14 14v3m0 3h3m0-3h3m0 0v3"/>
                    </svg> }
                    className={ '!hidden md:!block' }
                    theme={ 'borderless' }
                    type={ 'tertiary' }
                    size={ 'small' }
                    onClick={ () => setMobileLocationRefId(uuidv4()) }
                  />
                </Tooltip>
              ) }
            </div>
          </div>
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
            location={ location }
            loading={ isSatellitesLoading }
            compact={ false }
            pagination={ pagination }
            setPagination={ setPagination }
            filteredValue={ filteredValue }
            sorter={ (a, b) => {
              return a.name.localeCompare(b.name)
            } }
          />
        </div>
      </div>
      <Modal
        title="获取手机位置"
        visible={ !!mobileLocationRefId }
        hasCancel={ false }
        okText={ '取消' }
        footerFill
        onOk={ () => setMobileLocationRefId(null) }
        closeOnEsc={ true }
      >
        <div className={ 'w-full relative' }>
          <QRCode
            className={ 'mx-auto' }
            value={ `${ origin }/ob-location?ref=${ mobileLocationRefId }` }
          />
          { mobileScanned && (
            <div className={ 'absolute inset-0 flex flex-col justify-center items-center gap-2 bg-white/95' }>
              <Icon icon={ 'tabler:circle-check' } className={ 'text-4xl' }/>
              <p className={ 'text-center text-base font-bold' }>
                扫码成功，请在手机上确认
              </p>
            </div>
          ) }
        </div>
      </Modal>
    </>
  )
}