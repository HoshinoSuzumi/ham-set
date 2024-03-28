import {ImageResponse} from 'next/og';
import {Icon} from "@iconify-icon/react";
import {NextRequest} from "next/server";

export const runtime = 'edge';
export const contentType = 'image/png';

export async function GET(
  req: NextRequest
) {
  const searchParams = req.nextUrl.searchParams

  const fontData = await fetch(
    new URL('../../../assets/NotoSansSC-Regular.ttf', import.meta.url),
    {
      cache: 'no-cache',
    }
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
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        <Icon icon={'tabler:antenna'} style={{fontSize: 100}}/>
        {searchParams.get('title') || 'Hello'}
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