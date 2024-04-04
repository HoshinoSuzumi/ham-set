'use client'

import dayjs from '@/app/utils/dayjs'
import {useEffect, useState} from 'react'

export const DatetimeList = () => {
  const [nowTime, setNowTime] = useState(dayjs())
  const timeZoneOffset = dayjs(nowTime).utcOffset() / 60

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <ul className={'divide-y'}>
      <li className={'flex justify-between items-center py-1.5 pt-0'}>
        <h2 className={'text-xs text-neutral-400'}>
          UTC 日期 (DMY)
        </h2>
        <p className={`text-xs text-neutral-500 font-mono`}>{dayjs(nowTime).utc().format('DD/MM/YYYY')}</p>
      </li>
      <li className={'flex justify-between items-center py-1.5'}>
        <h2 className={'text-xs text-neutral-400'}>
          UTC 时间
        </h2>
        <p className={'text-xs text-neutral-500 font-mono'}>{dayjs(nowTime).utc().format('HH:mm:ss')}</p>
      </li>
      <li className={'flex justify-between items-center py-1.5 pb-1'}>
        <h2 className={'text-xs text-neutral-400'}>
          本地时间 ({timeZoneOffset > 0 ? `+${timeZoneOffset}` : timeZoneOffset})
        </h2>
        <p className={'text-xs text-neutral-500 font-mono'}>{dayjs(nowTime).format('HH:mm:ss')}</p>
      </li>
    </ul>
  )
}