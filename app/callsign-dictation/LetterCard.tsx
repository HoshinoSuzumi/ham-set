'use client'

import IconTablerVolume from '@/components/Icon/IconTablerVolume';
import {useRef, useState} from 'react';
import {CSSTransition, SwitchTransition, Transition} from 'react-transition-group';

export interface Phonetic {
  word: string
  ipa: string
  tag?: {
    label: string
    desc: string
  }
}

export default function LetterCard({
  letter,
  phonetics,
}: {
  letter: string,
  phonetics: Phonetic[]
}) {
  const [index, setIndex] = useState(0)
  const nodeRef = useRef(null)
  const isNumber = letter.match(/\d/)

  function handleSwap() {
    setIndex((index + 1) % phonetics.length)
  }

  return (
    <>
      <div
        className={'flex flex-row relative overflow-hidden justify-between rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 border-b-4'}>
        <SwitchTransition>
          <CSSTransition nodeRef={nodeRef} classNames={'swap-phonetic'} timeout={150} key={index}>
            <div className={`w-full flex flex-col p-2 pt-1 ${phonetics.length > 1 && 'pr-3'}`} ref={nodeRef}>
              <h1 className={'w-fit cursor-pointer hover:drop-shadow group flex flex-row items-end'}>
                <span className={'text-2xl text-accent font-bold'}>
                  {letter.toUpperCase()}
                </span>
                <span className={`text-lg text-accent-content font-normal ${isNumber && 'pl-1'}`}>
                  {phonetics[index].word.slice(isNumber ? 0 : 1)}
                </span>
                {/*<IconTablerVolume className={'inline-block self-center text-lg text-accent ml-0.5 transition'} />*/}
              </h1>
              <div className={'inline-flex justify-between items-center'}>
                <span className="text-xs text-neutral-400 font-ipa font-bold">
                  {phonetics[index].ipa}
                </span>
                {(phonetics[index].tag && phonetics.length > 1) && (
                  <span className={'text-xs text-neutral-400 font-mono font-bold'}>
                    {phonetics[index].tag?.label}
                  </span>
                )}
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
        {phonetics.length > 1 && (
          <div className={'relative'}>
            <div className={'absolute inset-0 -left-2 flex flex-col justify-center space-y-1 pointer-events-none'}>
              {phonetics.map((phonetic, i) => (
                <div key={i} onClick={() => setIndex(i)}
                     className={`w-1 h-1 rounded-full transition pointer-events-auto cursor-pointer
                   ${index === i ? 'bg-accent' : 'bg-neutral-content'}`}></div>
              ))}
            </div>
            <button className={'h-full bg-neutral-content/50 p-1 cursor-pointer'} onClick={handleSwap}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                      d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
