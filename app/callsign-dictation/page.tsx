import React, {CSSProperties} from 'react';
import {noto_sc, saira} from '@/app/fonts';
import {Metadata} from "next";

export const metadata: Metadata = {
  title: '呼号听写',
  description: '模拟呼号抄听和听写',
}

function Answer({
  callsign,
  mask = true,
}: {
  callsign: string,
  mask: boolean
}) {
  return (
    <div className={'flex flex-row justify-center items-center gap-4'}>
      <div className={'bg-neutral-200 dark:bg-neutral-700 px-4 py-3 rounded-md relative overflow-hidden'}>
        {mask && (
          <div className={'absolute inset-0 bg-pattern-mask flex justify-center items-center group'}>
            <h1
              className={`opacity-0 group-hover:opacity-30 text-3xl font-bold tracking-widest transition-opacity select-none ${noto_sc.className}`}>
              不许偷看
            </h1>
          </div>
        )}
        <h1 className={`text-4xl text-center min-w-[4em] ${saira.className}`}>{callsign}</h1>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <title>呼号听写</title>
      <meta name="description" content="呼号听写"/>

      <div className={'w-full h-full flex flex-col justify-center items-center'}>
        {/* 题目、正确率 */}
        <div
          className={'flex flex-col w-full md:w-[500px] bg-base-100 border dark:border-neutral-700 shadow rounded relative'}>
          {/*<div className={'absolute h-full inset-y-0 right-0 flex flex-col justify-center items-center'}>*/}
          {/*  options*/}
          {/*</div>*/}
          <div>
            <div className={`stats border-b dark:border-neutral-700 w-full rounded ${noto_sc.className}`}>
              <div className="stat place-items-center">
                <div className="stat-value text-xl">
                  <span className="countdown">
                    <span style={{'--value': 10} as CSSProperties}></span>
                  </span>
                </div>
                <div className="stat-desc text-xs font-medium">答题数</div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-value text-xl">
                  <span className="countdown">
                    <span style={{'--value': 90} as CSSProperties}></span>
                  </span>
                  <span className="text-xs font-black opacity-80">%</span>
                </div>
                <div className="stat-desc text-xs font-medium">正确率</div>
              </div>
            </div>
          </div>
          <div className={'w-full p-6 flex flex-col justify-center items-center gap-4'}>
            <Answer callsign={'BG8XXX'} mask={false}/>
          </div>
        </div>
        {/* 答案提交 */}
        <div></div>
      </div>
    </>
  )
}