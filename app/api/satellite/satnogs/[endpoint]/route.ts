import { NextRequest, NextResponse } from 'next/server'
import { BaseResponse } from '@/app/api/types'

export async function GET(
  req: NextRequest,
  ctx: {
    params: {
      endpoint: string;
    }
  },
) {
  const endpoint = decodeURIComponent(ctx.params.endpoint).replace(/^\//, '')
  try {
    const res = await fetch(`https://db.satnogs.org/api/${ endpoint }`, {
      cache: 'no-cache',
    })
    const data = await res.json()
    return NextResponse.json<BaseResponse<{}>>({
      code: 0,
      message: 'success',
      data,
    })
  } catch (err) {
    // return HTTP error
    return NextResponse.json<BaseResponse<{}>>({
      code: 1,
      message: (err as Error).message,
      data: null,
    }, {
      status: 500,
    })
  }
}
