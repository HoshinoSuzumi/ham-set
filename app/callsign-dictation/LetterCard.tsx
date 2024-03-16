'use client'

import {Tag} from '@douyinfe/semi-ui';

export default function LetterCard() {
  return (
    <>
      <div className={'flex flex-row relative overflow-hidden justify-between rounded-lg bg-base-100 border shadow-sm border-neutral-content/50 border-b-4'}>
        <div className={'w-full flex flex-col p-2 pt-1'}>
          <h1 className={'w-fit cursor-pointer hover:drop-shadow group flex flex-row items-end'}>
            <span className={'text-2xl text-accent font-bold'}>
              A
            </span>
            <span className={'text-lg text-accent-content font-normal'}>
              lpha
            </span>
            {/*<IconTablerVolume className={'inline-block self-center text-lg text-accent ml-0.5 transition'} />*/}
          </h1>
          <div className={'inline-flex justify-between items-center'}>
            <span className="text-xs text-neutral-400 font-ipa font-bold">/&apos;alfa/</span>
            <Tag size={'small'}>STD</Tag>
            {/*<span className="text-xs text-neutral-400 font-mono font-bold">*/}
            {/*  STD*/}
            {/*</span>*/}
          </div>
        </div>
      </div>
    </>
  )
}
