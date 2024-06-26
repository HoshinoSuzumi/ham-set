import './globals.css'
import '../assets/preflight.css'
import { ReactNode } from 'react'
import MainDrawer, { NavListItem } from '@/components/MainDrawer'
import { SpeechSynthesisProvider } from '@/contexts/SpeechSynthesisContext'
import { rubik } from '@/app/fonts'
import { SWRProvider } from '@/app/swr-provider'
import { Metadata, Viewport } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'HAM Set',
  description: 'Powerful tools for amateur radio operators.',
  keywords: 'HAM, amateur radio, callsign, phonetic, letter, Morse code, satellite, Maidenhead grid, exam, question bank, FCC, CEPT, ITU, IARU, Morse code',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const nav: NavListItem[] = [
    {
      label: '字母解释法',
      pathname: '/',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M19 4v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z"/>
          <path d="M19 16H7a2 2 0 0 0-2 2M9 8h6"/>
        </g>
      </svg>,
    },
    // {
    //   label: '呼号听写',
    //   pathname: '/callsign-dictation',
    //   icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    //     <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
    //           d="M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4m9.5-13.5l4 4"/>
    //   </svg>,
    // },
    {
      label: '考试题库',
      pathname: '/crac-question-bank',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M13.5 15a4.914 4.914 0 0 1-1.5-1a5 5 0 0 0-7 0V5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v6M5 21v-7m14 8v.01M19 19a2.003 2.003 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"/>
      </svg>,
    },
    {
      label: '卫星信息',
      pathname: '/satellites',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path
            d="m3.707 6.293l2.586-2.586a1 1 0 0 1 1.414 0l5.586 5.586a1 1 0 0 1 0 1.414l-2.586 2.586a1 1 0 0 1-1.414 0L3.707 7.707a1 1 0 0 1 0-1.414"/>
          <path d="m6 10l-3 3l3 3l3-3m1-7l3-3l3 3l-3 3m-1 3l1.5 1.5m1 3.5a2.5 2.5 0 0 0 2.5-2.5M15 21a6 6 0 0 0 6-6"/>
        </g>
      </svg>,
    },
    {
      label: '梅登黑德定位',
      pathname: '/maidenhead-grid',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>
          <path d="M4 12a8 8 0 1 0 16 0a8 8 0 1 0-16 0m8-10v2m0 16v2m8-10h2M2 12h2"/>
        </g>
      </svg>,
    },
  ]

  return (
    <html lang="en">
    <SWRProvider>
      <body className={ `${ rubik.className }` }>
      <SpeechSynthesisProvider>
        <MainDrawer nav={ nav }>
          { children }
        </MainDrawer>
      </SpeechSynthesisProvider>
      <Script
        src={ 'https://analytics.c5r.app/script.js' }
        data-website-id={ 'd584f2e5-9f89-46e0-82b0-a70157be1665' }
        data-domains={ 'ham.c5r.app,ham-dev.c5r.app' }
        defer
      />
      </body>
    </SWRProvider>
    </html>
  )
}
