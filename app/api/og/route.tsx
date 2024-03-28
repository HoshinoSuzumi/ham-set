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
        tw={'w-full h-full flex flex-col justify-between items-start p-8 bg-white'}
      >
        <div tw={'bg-gray-100 p-2 rounded-lg border border-indigo-600'}>
          {searchParams.get('title') || 'Hello'}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}