'use client'

import {noto_sc} from '@/app/fonts'
import {useContext, useEffect, useState} from 'react'
import {SpeechSynthesisContext} from '@/contexts/SpeechSynthesisContext'

export const NotSupportSynthAPI = () => {
  const {synthReady} = useContext(SpeechSynthesisContext)!
  const [unsupported, setUnsupported] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!synthReady) {
        setUnsupported(true)
      }
    }, 2000)
  }, [synthReady])

  return (!synthReady && unsupported) && (
    <div
      className={`w-full flex items-center gap-1 p-2 text-xs rounded-lg bg-base-100 border shadow-sm
                      border-red-500/80 dark:border-red-500/30 border-b-4 ${noto_sc.className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="text-red-500" width="1.5em" height="1.5em"
           viewBox="0 0 24 24">
        <path fill="currentColor"
              d="M12 1.67c.955 0 1.845.467 2.39 1.247l.105.16l8.114 13.548a2.914 2.914 0 0 1-2.307 4.363l-.195.008H3.882a2.914 2.914 0 0 1-2.582-4.2l.099-.185l8.11-13.538A2.914 2.914 0 0 1 12 1.67M12.01 15l-.127.007a1 1 0 0 0 0 1.986L12 17l.127-.007a1 1 0 0 0 0-1.986zM12 8a1 1 0 0 0-.993.883L11 9v4l.007.117a1 1 0 0 0 1.986 0L13 13V9l-.007-.117A1 1 0 0 0 12 8"></path>
      </svg>
      <p className={'flex items-center gap-2'}>
        您的浏览器不支持 Synthesis API，无法使用发音功能
      </p>
    </div>
  )
}