'use client'

import './styles.scss'
import './hideAmapCopyright.css'
import {AmapAPILoader} from '@/components/AmapAPILoader'
import {Panel} from '@/app/maidenhead-grid/Panel'
import {DatetimeList} from '@/app/maidenhead-grid/DatetimeList'
import {useCallback, useEffect, useState} from 'react'
import {maidenheadToBoundingBox, WGS84ToMaidenhead} from '@hamset/maidenhead-locator'
import dynamic from 'next/dynamic'
import IconNoObserve from '@/components/IconNoObserve'
import MapsEvent = AMap.MapsEvent
import LngLat = AMap.LngLat

const [
  Map,
  Marker,
  Rectangle,
] = [
  dynamic(
    () => import('@uiw/react-amap').then(mod => mod.Map),
    {ssr: false},
  ),
  dynamic(
    () => import('@uiw/react-amap').then(mod => mod.Marker),
    {ssr: false},
  ),
  dynamic(
    () => import('@uiw/react-amap').then(mod => mod.Rectangle),
    {ssr: false},
  ),
]

export const Main = () => {
  // components state
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setIsDarkMode(mql.matches)
    mql.addEventListener('change', handler)
    setIsDarkMode(mql.matches)
    return () => mql.removeEventListener('change', handler)
  }, [])
  // map state
  const [mapLoaded, setMapLoaded] = useState(false)
  const [zoom, setZoom] = useState(8)
  const [center, setCenter] = useState<[number, number] | undefined>()

  // local location state
  const [location, setLocation] = useState<GeolocationPosition | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const localGrid = location?.coords ? WGS84ToMaidenhead([location?.coords.latitude, location?.coords.longitude]) : null
  const localBounds = localGrid ? maidenheadToBoundingBox(localGrid).map(latlng => [latlng[1], latlng[0]]) : undefined

  // target location state
  const [targetLocation, setTargetLocation] = useState<LngLat | null>(null)
  const targetGrid = (targetLocation && targetLocation.lat && targetLocation.lng) ? WGS84ToMaidenhead([targetLocation.lat, targetLocation.lng]) : null
  const targetBounds = targetGrid ? maidenheadToBoundingBox(targetGrid).map(latlng => [latlng[1], latlng[0]]) : undefined

  // straight distance
  const localLnglat = (mapLoaded && location?.coords) ? new AMap.LngLat(location.coords.longitude, location.coords.latitude) : null
  const targetLnglat = (mapLoaded && targetLocation && targetLocation.lat && targetLocation.lng) ? new AMap.LngLat(targetLocation.lng, targetLocation.lat) : null
  const straightDistance = (mapLoaded && localLnglat && targetLnglat) ? localLnglat.distance!(targetLnglat) : null

  useEffect(() => {
    if (!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setLocation(position)
      },
      (error) => {
        setLocationError(error.message || 'Unknown Error')
      },
    )
    return () => {
      if (!watcher) return
      navigator.geolocation.clearWatch(watcher)
    }
  }, [])

  // blink state
  const [isLocationBlink, setIsLocationBlink] = useState(false)
  const [isTargetBlink, setIsTargetBlink] = useState(false)

  useEffect(() => {
    // blink effect
    setIsLocationBlink(true)
    const timer = setTimeout(() => setIsLocationBlink(false), 1000)

    if (location?.coords && !center) {
      setCenter([location.coords.longitude, location.coords.latitude])
      setZoom(14)
    }

    return () => clearTimeout(timer)
  }, [location, locationError])

  useEffect(() => {
    // blink effect
    setIsTargetBlink(true)
    const timer = setTimeout(() => setIsTargetBlink(false), 1000)

    return () => clearTimeout(timer)
  }, [targetLocation])

  const onMapClick = useCallback((e: MapsEvent) => {
    setTargetLocation(e.lnglat)
  }, [])
  const onRectangleClick = useCallback((e: MapsEvent) => {
    setTargetLocation(e.lnglat)
  }, [])


  return (
    <>
      <AmapAPILoader>
        <div className={'w-full h-full relative'}>
          <div className={'w-full h-full'}>
            <Map
              zoom={zoom}
              center={center}
              mapStyle={`amap://styles/${isDarkMode ? 'darkblue' : 'normal'}`}
              onComplete={() => setMapLoaded(true)}
              onClick={onMapClick}
            >
              <>
                {localBounds && (
                  <>
                    <Marker
                      visiable={mapLoaded && !!localBounds}
                      position={(mapLoaded && location?.coords) ? new AMap.LngLat(location.coords.longitude, location.coords.latitude) : undefined}
                    />
                    <Rectangle
                      visiable={mapLoaded && !!localBounds}
                      bounds={mapLoaded ? new AMap.Bounds(localBounds[0], localBounds[1]) : undefined}
                      strokeOpacity={0.8}
                      strokeWeight={2}
                      fillOpacity={0.35}
                      onClick={onRectangleClick}
                    />
                  </>
                )}
                {targetBounds && (
                  <>
                    <Marker
                      visiable={mapLoaded && !!targetBounds}
                      position={(mapLoaded && targetLocation) ? targetLocation : undefined}
                    />
                    <Rectangle
                      visiable={mapLoaded && !!targetBounds}
                      bounds={mapLoaded ? new AMap.Bounds(targetBounds[0], targetBounds[1]) : undefined}
                      strokeColor={'rgba(15,171,0,0.3)'}
                      strokeOpacity={0.8}
                      strokeWeight={2}
                      fillColor={'rgba(15,171,0,0.02)'}
                      fillOpacity={0.35}
                      onClick={onRectangleClick}
                    />
                  </>
                )}
              </>
            </Map>
          </div>

          <div
            className={`absolute md:top-0 right-0 bottom-0 left-0 md:left-auto p-2 md:p-6 flex flex-col items-end pointer-events-none ease-out transition duration-300 md:translate-y-0 ${panelExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-160px)]'}`}>
            <div className={'inline md:hidden w-full h-0 relative'}>
              <button
                className={'absolute -top-[24px] right-2 flex justify-center items-center bg-white dark:bg-neutral-800 dark:border-neutral-700 rounded-t-lg border-2 border-b-0 px-4 h-[24px] pointer-events-auto'}
                onClick={() => setPanelExpanded(!panelExpanded)}
              >
                <IconNoObserve icon={panelExpanded ? 'tabler:chevron-down' : 'tabler:chevron-up'}
                               className={'text-xl'}/>
              </button>
            </div>
            <div className={'flex flex-col-reverse md:flex-col gap-2 md:gap-4 w-full md:h-fit pointer-events-auto'}>

              <Panel label={'参考时间'} icon={'tabler:clock'}>
                <DatetimeList/>
              </Panel>

              <Panel label={'台站位置'} icon={'tabler:gps'}>
                <ul className={'divide-y dark:divide-neutral-700'}>
                  <li className={'flex justify-between items-center py-1.5 pt-0'}>
                    <h2 className={'text-xs text-neutral-400'}>
                      经度 <span className={'font-mono'}>Lng</span>
                    </h2>
                    <p className={`text-xs text-neutral-500 font-mono ${isLocationBlink ? 'blink' : ''}`}>
                      {location?.coords.longitude || locationError || 'loading...'}
                    </p>
                  </li>
                  <li className={'flex justify-between items-center py-1.5'}>
                    <h2 className={'text-xs text-neutral-400'}>
                      纬度 <span className={'font-mono'}>Lat</span>
                    </h2>
                    <p className={`text-xs text-neutral-500 font-mono ${isLocationBlink ? 'blink' : ''}`}>
                      {location?.coords.latitude || locationError || 'loading...'}
                    </p>
                  </li>
                  <li className={'flex justify-between items-center py-1.5 pb-1'}>
                    <h2 className={'text-xs text-neutral-400'}>
                      网格 <span className={'font-mono'}>Grid</span>
                    </h2>
                    <p className={`text-xs text-sky-500 font-medium font-mono ${isLocationBlink ? 'blink' : ''}`}>
                      {localGrid || locationError || 'loading...'}
                    </p>
                  </li>
                </ul>
              </Panel>

              {targetGrid && (
                <>
                  <Panel label={'目标位置'} icon={'tabler:gps'}>
                    <ul className={'divide-y dark:divide-neutral-700'}>
                      <li className={'flex justify-between items-center py-1.5 pt-0'}>
                        <h2 className={'text-xs text-neutral-400'}>
                          经度 <span className={'font-mono'}>Lng</span>
                        </h2>
                        <p className={`text-xs text-neutral-500 font-mono ${isTargetBlink ? 'blink' : ''}`}>
                          {targetLocation?.lng || 'N/A'}
                        </p>
                      </li>
                      <li className={'flex justify-between items-center py-1.5'}>
                        <h2 className={'text-xs text-neutral-400'}>
                          纬度 <span className={'font-mono'}>Lat</span>
                        </h2>
                        <p className={`text-xs text-neutral-500 font-mono ${isTargetBlink ? 'blink' : ''}`}>
                          {targetLocation?.lat || 'N/A'}
                        </p>
                      </li>
                      <li className={'flex justify-between items-center py-1.5 pb-1'}>
                        <h2 className={'text-xs text-neutral-400'}>
                          网格 <span className={'font-mono'}>Grid</span>
                        </h2>
                        <p className={`text-xs text-green-500 font-medium font-mono ${isTargetBlink ? 'blink' : ''}`}>
                          {targetGrid || 'N/A'}
                        </p>
                      </li>
                    </ul>
                  </Panel>

                  <Panel label={'测距仪'} icon={'tabler:gps'}>
                    <ul className={'divide-y'}>
                      <li className={'flex justify-between items-center py-1.5 pt-0 pb-1'}>
                        <h2 className={'text-xs text-neutral-400'}>
                          直线距离
                        </h2>
                        <p className={`text-xs text-neutral-500 font-mono ${isTargetBlink ? 'blink' : ''}`}>
                          {straightDistance ? `${(straightDistance / 1000).toFixed(2)} km` : 'N/A'}
                        </p>
                      </li>
                    </ul>
                  </Panel>
                </>
              )}

            </div>
          </div>
        </div>
      </AmapAPILoader>
    </>
  )
}