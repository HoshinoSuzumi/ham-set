import {Metadata} from 'next'
import {Main} from '@/app/maidenhead-grid/Main'

export const metadata: Metadata = {
  title: '梅登黑德网格定位',
  description: '梅登黑德网格定位',
}

export default function Page() {
  return (
    <Main/>
  )
}