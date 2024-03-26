import {useEffect} from "react";

export interface GeetestUserConfig {
  captchaId: string
  protocol?: 'http://' | 'https://'
  product?: 'popup' | 'float' | 'bind'
  nativeButton?: {
    width?: string
    height?: string
  }
  rem?: number
  language?: 'zho' | 'eng' | 'jpn'
  timeout?: number
  hideBar?: ['close' | 'refresh']
  mask?: {
    outside?: boolean
    bgColor?: string
  }
  nextWidth?: string
  riskType?: 'slide' | 'word' | 'match' | 'ai'
  hideSuccess?: boolean
  offlineCb?: () => void
  onError?: () => void
  userInfo?: string
}

export type GeetestHandler = (captcha: Geetest4) => void

export interface Geetest4 {
  appendTo: (selector: string) => void
  destroy: () => void
  getValidate: () => string
  isOffline: () => boolean
  onBoxShow: () => void
  onClose: () => void
  onError: () => void
  onFail: () => void
  onNextReady: () => void
  onReady: () => void
  onSuccess: (callback: () => void) => void
  reset: () => void
  showBox: () => void
  showCaptcha: () => void
  uploadExtraData: (data: any) => void
}

declare global {
  interface Window {
    initGeetest4: (
      userConfig: GeetestUserConfig,
      callback: GeetestHandler,
    ) => void;
  }
}

export default function GeetestCaptcha({
  captchaConfig,
  selectorWhenBind,
  onCaptchaMounted,
  onSuccess,
}: {
  captchaConfig: GeetestUserConfig
  selectorWhenBind?: string
  onCaptchaMounted?: GeetestHandler
  onSuccess?: (validate: any) => void
}) {
  useEffect(() => {
    const initGeetest = () => {
      window.initGeetest4(captchaConfig, captcha => {
        if (captchaConfig?.product !== 'bind') {
          captcha.appendTo('#geetest-captcha')
        } else {
          const trigger = document.querySelector<HTMLButtonElement>(selectorWhenBind || 'undefined')
          if (trigger) {
            trigger.onclick = () => {
              captcha.showCaptcha()
            }
          }
        }
        captcha.onSuccess(function () {
          onSuccess && onSuccess(captcha.getValidate())
        })
        onCaptchaMounted && onCaptchaMounted(captcha)
      })
    }
    if (!!window.initGeetest4) initGeetest()
    else {
      const script = document.createElement('script')
      script.src = '//static.geetest.com/v4/gt4.js'
      script.async = true
      document.body.appendChild(script)
      script.onload = initGeetest
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="geetest-captcha"/>
  )
}