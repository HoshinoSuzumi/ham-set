import {useEffect, useRef} from "react";

export interface GeetestUserConfig {
  captchaId: string;
  protocol?: 'http://' | 'https://';
  getType?: string;
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
  onSuccess: () => void
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
}: {
  captchaConfig: GeetestUserConfig;
}) {
  const targetElement = useRef(null)
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//static.geetest.com/v4/gt4.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      window.initGeetest4(captchaConfig, captcha => {
        captcha.appendTo('#geetest-captcha')
      })
    }
  }, [captchaConfig])
  return (
    <div>
      <div ref={targetElement} id="geetest-captcha"/>
    </div>
  )
}