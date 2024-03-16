import './globals.css';
import {ReactNode} from 'react';
import MainDrawer, {NavListItem} from '@/components/MainDrawer';
import {SpeechSynthesisProvider} from '@/contexts/SpeechSynthesisContext';
import {noto_sc, rubik} from '@/app/fonts';

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
    {
      label: '呼号听写',
      pathname: '/callsign-dictation',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 20h4L18.5 9.5a1.5 1.5 0 0 0-4-4L4 16v4m9.5-13.5l4 4"/>
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
    <body className={`${rubik.className}`}>
    <SpeechSynthesisProvider>
      <MainDrawer nav={nav}>
        {children}
      </MainDrawer>
    </SpeechSynthesisProvider>
    </body>
    </html>
  );
}
