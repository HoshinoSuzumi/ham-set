'use server'

import {sql} from '@vercel/postgres';

export interface Annotation {
  lk: string
  annotation: string
  author?: string | null
}

export async function setLkAnnotation(lk: string, annotation: string, author: string | null) {
  return sql<Annotation>`INSERT INTO annotations (lk, annotation, author) VALUES (${lk}, ${annotation}, ${author}) ON CONFLICT (lk) DO UPDATE SET annotation = ${annotation}, author = ${author || null}`
}

export async function getLkAnnotation(lk: string): Promise<Annotation | null> {
  const {rows} = await sql<Annotation>`SELECT * FROM annotations WHERE lk = ${lk}`
  return rows[0] || null
}

export async function getLkAnnotations(): Promise<Annotation[]> {
  const {rows} = await sql<Annotation>`SELECT * FROM annotations`
  return rows
}