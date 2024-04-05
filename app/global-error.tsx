'use client'

import Error from '@/app/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
    <body className={'w-full h-screen'}>
    <Error error={error} reset={reset}/>
    </body>
    </html>
  )
}