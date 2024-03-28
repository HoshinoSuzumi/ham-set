import {ImageResponse} from 'next/og';
import {ReactNode} from "react";

export const runtime = 'nodejs';
export const contentType = 'image/png';

export default async function Image() {
  function Label({
    children
  }: {
    children: ReactNode
  }) {
    return <label style={{
      fontSize: 16,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 1,
      margin: '25px 0 10px',
      color: 'gray',
    }}>
      {children}
    </label>
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          letterSpacing: '-.02em',
          fontWeight: 700,
          background: 'white',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
        }}
      >
        <div tw={'absolute top-4 left-10 flex items-center'}>
          <div tw={'flex items-center text-neutral-700'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M22 13c0 1.11-.89 2-2 2H4a2 2 0 1 1 0-4h9l2.5 2l2.5-2h2a2 2 0 0 1 2 2M12 3C3 3 3 9 3 9h18s0-6-9-6M3 18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-1H3z"/>
            </svg>
          </div>
          <p tw={'flex flex-col ml-2'}>
            <span tw={'font-bold text-xl'}>HAM SET</span>
            <span tw={`font-bold text-xs text-base-content/70 -mt-2`}>火腿套餐</span>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '15px 35px',
            fontSize: 30,
            width: 'auto',
            maxWidth: 550,
            backgroundColor: 'black',
            color: 'white',
            lineHeight: 1.4,
            borderRadius: 10,
          }}
        >
          题库解析 / 字母解释法 / QTH
        </div>

        <Label>
          All in HAM Set
        </Label>

      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: 'fluent',
    },
  );
}