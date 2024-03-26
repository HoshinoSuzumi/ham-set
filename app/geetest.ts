'use server'

import {createHmac} from "node:crypto";

export interface GeetestCaptchaSuccess {
  lot_number: string
  captcha_output: string
  pass_token: string
  gen_time: string
}

export type GeetestValidateRequest = {
  sign_token: string
} & GeetestCaptchaSuccess & {
  [key: string]: any
}

export interface GeetestValidateResponse {
  status: 'success' | 'fail' // request status
  result?: 'success' | 'fail' // validate result
  reason?: string
  msg?: string
  captcha_args?: {
    used_type: string
    user_ip: string
    lot_number: string
    scene: string
    referer: string
    ip_type: number
    user_info: string
    client_type: string
    ua: string
    fail_count: number
  }
}

export async function geetestValidate(validate: GeetestCaptchaSuccess) {
  const CAPTCHA_ID = process.env.GEETEST_CAPTCHA_ID || ''
  const CAPTCHA_KEY = process.env.GEETEST_CAPTCHA_KEY || ''
  const CAPTCHA_SERVER = process.env.GEETEST_CAPTCHA_SERVER || 'https://gcaptcha4.geetest.com'
  const CAPTCHA_URL = `${CAPTCHA_SERVER}/validate?captcha_id=${CAPTCHA_ID}`

  const hmac = createHmac('sha256', CAPTCHA_KEY)
  const sign_token = hmac.update(validate.lot_number, 'utf-8').digest('hex')

  const payload: GeetestValidateRequest = {
    ...validate, sign_token
  }

  const formData = new URLSearchParams()
  for (const key in payload) {
    formData.append(key, payload[key])
  }

  return new Promise<boolean>((resolve) => {
    fetch(CAPTCHA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })
    .then(response => response.json())
    .then((response: GeetestValidateResponse) => {
      resolve(response?.result === 'success')
    })
    .catch(() => resolve(false))
  })

  // try {
  //   const response: GeetestValidateResponse = await (await fetch(CAPTCHA_URL, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: formData
  //   })).json()
  //   return {
  //     success: response?.result === 'success'
  //   }
  // } catch (e) {
  //   return {
  //     success: true
  //   }
  // }
}
