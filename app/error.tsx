'use client'

import { noto_sc, rubik } from '@/app/fonts'
import { Button, Typography } from '@douyinfe/semi-ui'
import { useEffect, useState } from 'react'
import { pastebin } from '@/app/actions'
import dayjs from '@/app/utils/dayjs'
import Text from '@douyinfe/semi-ui/lib/es/typography/text'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showErrorStack, setShowErrorStack] = useState(true)
  const [pastebinUploading, setPastebinUploading] = useState(false)
  const [pastebinUrl, setPastebinUrl] = useState<string | null>(null)

  const [clientInfo, setClientInfo] = useState<{} | null>(null)
  useEffect(() => {
    setClientInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform || 'unknown',
      language: navigator.language,
      vendor: navigator.vendor || 'unknown',
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency,
    })
  }, [])

  const handlePastebinClick = () => {
    setPastebinUploading(true)
    const report_payload = {
      client: clientInfo,
      route: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
        digest: error.digest,
      },
    }
    pastebin(JSON.stringify(report_payload, null, 2), {
      name: `HamSet 错误报告[${ dayjs().local().toString() }]`,
      format: 'json',
      folder: 'TgXi1c0z',
    }).then(url => {
      setPastebinUrl(url)
      setShowErrorStack(false)
    }).catch(() => {
      alert('上传失败，请重试')
    }).finally(() => {
      setPastebinUploading(false)
    })
  }

  return (
    <div className={'w-full h-full flex flex-col gap-2 items-center p-10 bg-white dark:bg-neutral-900'}>
      <h1 className={`text-lg font-medium ${noto_sc.className}`}>
        <svg className={'inline -mt-1 mr-1'} xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em"
             viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"></path>
            <path d="M14.5 16.05a3.5 3.5 0 0 0-5 0M8 9l2 2m0-2l-2 2m6-2l2 2m0-2l-2 2"></path>
          </g>
        </svg>
        <span>渲染时遇到错误</span>
        <span className={'block text-xs ml-1 opacity-50'}>烦请您上传日志并反馈给开发者</span>
      </h1>
      <div className={'flex items-center'}>
        <Button
          onClick={reset}
          size={'small'}
          type={'primary'}
          theme={'borderless'}
          disabled={pastebinUploading}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M19.933 13.041a8 8 0 1 1-9.925-8.788c3.899-1 7.935 1.007 9.425 4.747"></path>
              <path d="M20 4v5h-5"></path>
            </g>
          </svg>}
        >
          重载
        </Button>
        <Button
          onClick={handlePastebinClick}
          size={'small'}
          type={'secondary'}
          theme={'borderless'}
          loading={pastebinUploading}
          disabled={!clientInfo || !!pastebinUrl}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m12 6l-8 4l8 4l8-4zm-8 8l8 4l8-4"></path>
          </svg>}
        >
          上传日志
        </Button>
        <Button
          onClick={() => setShowErrorStack(!showErrorStack)}
          size={'small'}
          type={'danger'}
          theme={showErrorStack ? 'light' : 'borderless'}
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="m12 6l-8 4l8 4l8-4zm-8 8l8 4l8-4"></path>
          </svg>}
        >
          {showErrorStack ? '隐藏' : '错误'}堆栈
        </Button>
      </div>
      {pastebinUrl && (
        <div className={'flex flex-col gap-1 items-center'}>
          <Typography.Text
            className={`bg-neutral-content/40 dark:bg-neutral-content/20 p-2 rounded`}
            style={rubik.style}
            copyable
          >
            {pastebinUrl}
          </Typography.Text>
          <h2 className={'text-xs ml-1 opacity-50'}>
            请将此链接通过&nbsp;
            <Text
              size={'small'}
              link={{href: 'https://github.com/HoshinoSuzumi/ham-set/issues/new', target: '_blank'}}
            >
              GitHub Issue
            </Text>、
            <Text
              size={'small'}
              link={{href: 'https://forum.hamcq.cn/d/1390', target: '_blank'}}
            >
              HamCQ
            </Text>&nbsp;
            或其他方式反馈给开发者
          </h2>
        </div>
      )}
      {showErrorStack && (
        <div className={'w-full p-4 rounded-lg max-w-[648px] bg-neutral-content/40 dark:bg-neutral-content/20'}>
          <pre className={'text-xs text-neutral dark:text-neutral-content overflow-x-auto'}>
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  )
}