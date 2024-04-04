'use client'

import {ReactNode} from 'react'
import dynamic from 'next/dynamic'

const APILoader = dynamic(
  () => import('@uiw/react-amap').then(mod => mod.APILoader),
  {ssr: false},
)

export const AmapAPILoader = ({
  children,
}: {
  children: ReactNode
}) => {
  return (
    <>
      <APILoader
        akey={'3260f8fd404e9c82a80567ff92f9c2aa'}
        version={'2.0'}
      >
        {children}
      </APILoader>
    </>
  )
}