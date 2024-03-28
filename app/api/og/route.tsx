import {ImageResponse} from 'next/og';
import {NextRequest} from "next/server";

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest
) {
  const searchParams = req.nextUrl.searchParams

  return new ImageResponse(
    (
      <div
        tw={'w-full h-full px-48 py-12 flex flex-col bg-white'}
        style={{
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        <div tw={'flex justify-between items-center text-lg p-0 bg-black text-white rounded-lg shadow-2xl px-4'}>
          <div tw={'flex items-center'}>
            <div tw={'flex items-center'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M22 13c0 1.11-.89 2-2 2H4a2 2 0 1 1 0-4h9l2.5 2l2.5-2h2a2 2 0 0 1 2 2M12 3C3 3 3 9 3 9h18s0-6-9-6M3 18c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3v-1H3z"/>
              </svg>
            </div>
            <p tw={'flex flex-col ml-2'}>
              <span tw={'font-bold'}>HAM SET</span>
              <span tw={`font-bold text-[10px] text-base-content/70 -mt-2`}>火腿套餐</span>
            </p>
          </div>
        </div>
        <div tw={'flex-1 flex justify-between text-lg p-0 bg-white text-black rounded-lg shadow-2xl p-4 mt-4 border'}>
          {searchParams.get('content') || ''}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      emoji: 'fluent',
    },
  );
}