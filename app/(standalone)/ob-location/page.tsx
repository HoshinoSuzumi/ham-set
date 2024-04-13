'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { noto_sc, rubik } from '@/app/fonts'
import { Button } from '@douyinfe/semi-ui'
import { observerLocation } from '@/app/actions'

export default function Page() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [location, setLocation] = useState<GeolocationPosition | null>(null)
  useEffect(() => {
    if (!ref) return
    (async () => {
      await observerLocation(ref, 'pending')
    })()
    const watcher = navigator.geolocation.watchPosition(setLocation, null, {
      enableHighAccuracy: true,
    })
    return () => {
      navigator.geolocation.clearWatch(watcher)
    }
  }, [ref])

  const handleClick = () => {
    if (!ref || !location) return
    setLoading(true)
    observerLocation(ref, {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
      altitude: location.coords.altitude,
      accuracy: location.coords.accuracy,
      altitudeAccuracy: location.coords.altitudeAccuracy,
    })
    .then(() => {
      setDone(true)
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return !ref ? (
    <div className={ 'w-full h-full flex justify-center items-center' }>
      <h1>No ref provided</h1>
    </div>
  ) : (
    <div className={ `w-full h-full flex flex-col items-center p-8 ${ noto_sc.className }` }>
      <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
          <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path>
          <path
            d="M12.02 21.485a1.996 1.996 0 0 1-1.433-.585l-4.244-4.243a8 8 0 1 1 13.403-3.651M16 22l5-5m0 4.5V17h-4.5"></path>
        </g>
      </svg>
      <h1 className={ 'pt-3 text-2xl font-medium' }>上传地面站位置</h1>
      <p className={ 'pt-1 text-xs font-medium opacity-50' }>您正在与电脑网页端同步位置信息</p>
      <div className={ 'mt-6 px-3 p-2 rounded shadow-md grid grid-cols-3 gap-6' }>
        <div>
          <p className={ 'text-sm font-medium opacity-50' }>经度</p>
          <p className={ `text-base ${ rubik.className }` }>
            { location?.coords.longitude.toFixed(6) || 'locating...' }
          </p>
        </div>
        <div>
          <p className={ 'text-sm font-medium opacity-50' }>纬度</p>
          <p className={ `text-base ${ rubik.className }` }>
            { location?.coords.latitude.toFixed(6) || 'locating...' }
          </p>
        </div>
        <div>
          <p className={ 'text-sm font-medium opacity-50' }>海拔</p>
          <p className={ `text-base ${ rubik.className }` }>
            { location?.coords.altitude?.toFixed(2) || '-' }
          </p>
        </div>
        <div>
          <p className={ 'text-sm font-medium opacity-50' }>位置精度</p>
          <p className={ `text-base ${ rubik.className }` }>
            { location?.coords.accuracy.toFixed(2) || '-' }
          </p>
        </div>
        <div>
          <p className={ 'text-sm font-medium opacity-50' }>海拔精度</p>
          <p className={ `text-base ${ rubik.className }` }>
            { location?.coords.altitudeAccuracy?.toFixed(2) || '-' }
          </p>
        </div>
      </div>
      <div className={ 'w-full px-4' }>
        <Button
          block
          loading={ loading }
          disabled={ done || !location }
          className={ 'mt-4' }
          size={ 'large' }
          theme={ 'solid' }
          onClick={ handleClick }
        >
          { !done ? '上传位置' : '已上传' }
        </Button>
      </div>
      <p className={ 'pt-1 text-2xs font-medium opacity-50' }>
        您的位置会在服务器临时存储 5 分钟
      </p>
    </div>
  )
}
