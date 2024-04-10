import { Main } from '@/app/satellites/Main'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '业余无线电卫星数据库',
  description: '业余无线电卫星数据库',
}

export default function Page() {
  return <Main/>
}