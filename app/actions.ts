'use server'

import {sql} from '@vercel/postgres'
import {GeetestCaptchaSuccess, geetestValidate} from '@/app/geetest'

export interface Annotation {
  id: number
  lk: string
  annotation: string
  author?: string | null
  create_at: number
  update_at: number
  upvote: number
}

export async function newAnnotation(
  lk: string,
  annotation: string,
  author: string | null,
  validate: GeetestCaptchaSuccess,
) {
  return new Promise((resolve, reject) => {
    geetestValidate(validate).then(pass => {
      if (pass) {
        resolve(sql<Annotation>`INSERT INTO annotations (lk, annotation, author) VALUES (${lk}, ${annotation}, ${author})`)
      } else {
        reject('captcha failed')
      }
    })
  })
}

export async function getAnnotationsByLk(lk: string): Promise<Annotation[]> {
  const {rows} = await sql<Annotation>`SELECT * FROM annotations WHERE lk = ${lk} order by upvote desc, id desc`
  return rows || []
}

export async function getAnnotationsList(): Promise<Annotation[]> {
  const {rows} = await sql<Annotation>`SELECT * FROM annotations order by upvote desc, id desc`
  return rows
}

export async function upvoteAnnotation(
  id: number,
  validate: GeetestCaptchaSuccess,
) {
  return new Promise((resolve, reject) => {
    geetestValidate(validate).then(pass => {
      if (pass) {
        resolve(sql<Annotation>`UPDATE annotations SET upvote = upvote + 1 WHERE id = ${id}`)
      } else {
        reject('captcha failed')
      }
    })
  })
}

export async function pastebin(
  content: string,
  options?: {
    name?: string
    format?: string
    folder?: string
  },
): Promise<string> {
  const apiKey = process.env.PASTEBIN_API_KEY
  const userKey = process.env.PASTEBIN_USER_KEY
  let payload = {
    api_dev_key: apiKey || 'API_KEY_NOT_SET',
    api_user_key: userKey || 'USER_KEY_NOT_SET',
    api_paste_private: '1',
    api_option: 'paste',
    api_paste_code: encodeURIComponent(content),
  } as Record<string, string>
  if (options?.name) {
    payload = {
      ...payload,
      api_paste_name: encodeURIComponent(options.name || 'untitled'),
    }
  }
  if (options?.format) {
    payload = {
      ...payload,
      api_paste_format: options.format,
    }
  }
  if (options?.folder) {
    payload = {
      ...payload,
      api_folder_key: options.folder,
    }
  }
  return new Promise<string>((resolve, reject) => {
    fetch('https://pastebin.com/api/api_post.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload),
    })
    .then(response => response.text())
    .then(resolve)
    .catch(reject)
  })
}
