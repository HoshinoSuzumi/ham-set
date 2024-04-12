import { ReactNode } from 'react'

export default function ObLocationLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={ 'w-full h-full bg-white dark:bg-neutral-900' }>
      { children }
    </div>
  )
}
