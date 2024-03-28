import {ImageResponse} from 'next/og';
import {Icon} from "@iconify-icon/react";

export const runtime = 'edge';
export const contentType = 'image/png';

export async function GET() {
  const fontData = await fetch(
    new URL('../../../../../assets/font/NotoSansSC-VF.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: 'black',
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '50px 200px',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon icon={'tabler:antenna'} style={{fontSize: 100}}/>
        👋 Hello 你好
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans SC',
          data: fontData,
          style: 'normal',
        }
      ]
    },
  );
}