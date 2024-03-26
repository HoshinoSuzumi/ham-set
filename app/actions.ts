'use server'

// @ts-ignore
import {sql} from '@vercel/postgres';
import {GeetestCaptchaSuccess, geetestValidate} from "@/app/geetest";

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
  validate: GeetestCaptchaSuccess
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

export async function getTimezone(): Promise<string> {
  const {rows} = await sql`SHOW TIME ZONE;`
  return rows[0].TimeZone
}

export async function getAnnotationsList(): Promise<Annotation[]> {
  const {rows} = await sql<Annotation>`SELECT * FROM annotations order by upvote desc, id desc`
  return rows
}

export async function upvoteAnnotation(
  id: number,
  validate: GeetestCaptchaSuccess
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