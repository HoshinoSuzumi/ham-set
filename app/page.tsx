'use client'

import {Button} from '@douyinfe/semi-ui';
import LetterCard from '@/app/callsign-dictation/LetterCard';

export default function Home() {
  const TAG = Object.freeze({
    standard: {label: 'STD', desc: 'ICAO 标准'},
    dx: {label: 'DX', desc: 'DX 通联常用'},
    non_standard: {label: 'N-STD', desc: '非标准'},
  })

  const letter_dict = {
    'A': [
      {word: 'alpha', ipa: '/ˈælfə/', tag: TAG.standard},
      {word: 'america', ipa: '/əˈmerɪkə/', tag: TAG.dx},
    ],
    'B': [
      {word: 'bravo', ipa: '/ˈbrɑːvoʊ/', tag: TAG.standard},
      {word: 'boston', ipa: '/ˈbɑstən/', tag: TAG.dx},
    ],
    'C': [
      {word: 'charlie', ipa: '/ˈtʃɑːrli/', tag: TAG.standard},
      {word: 'canada', ipa: '/ˈkænədə/', tag: TAG.dx},
      {word: 'comic', ipa: '/ˈkɒmɪk/', tag: TAG.non_standard},
    ],
    'D': [
      {word: 'delta', ipa: '/ˈdeltə/', tag: TAG.standard},
      {word: 'david', ipa: '/ˈdeɪvɪd/', tag: TAG.non_standard},
    ],
    'E': [
      {word: 'echo', ipa: '/ˈekoʊ/', tag: TAG.standard},
      {word: 'england', ipa: '/ˈɪŋɡlənd/', tag: TAG.dx},
      {word: 'egypt', ipa: '/ˈidʒəpt/', tag: TAG.non_standard},
    ],
    'F': [
      {word: 'foxtrot', ipa: '/ˈfɑːkstrɑːt/', tag: TAG.standard},
      {word: 'france', ipa: '/fræns/', tag: TAG.dx},
      {word: 'florida', ipa: '/ˈflɔrədə/', tag: TAG.non_standard},
    ],
    'G': [
      {word: 'golf', ipa: '/ɡɑːlf/', tag: TAG.standard},
      {word: 'germany', ipa: '/ˈdʒɜːrməni/', tag: TAG.dx},
    ],
    'H': [
      {word: 'hotel', ipa: '/hoʊˈtel/', tag: TAG.standard},
      {word: 'henry', ipa: '/ˈhenri/', tag: TAG.non_standard},
    ],
    'I': [
      {word: 'india', ipa: '/ˈɪndiə/', tag: TAG.standard},
      {word: 'italy', ipa: '/ˈɪtəlɪ/', tag: TAG.dx},
    ],
    'J': [
      {word: 'juliet', ipa: '/ˈdʒuliˌɛt/', tag: TAG.standard},
      {word: 'japan', ipa: '/dʒəˈpæn/', tag: TAG.dx},
    ],
    'K': [
      {word: 'kilo', ipa: '/ˈkiːloʊ/', tag: TAG.standard},
      {word: 'kilowatt', ipa: '/ˈkɪləwɑːt/', tag: TAG.dx},
    ],
    'L': [
      {word: 'lima', ipa: '/ˈliːmə/', tag: TAG.standard},
      {word: 'london', ipa: '/ˈlʌndən/', tag: TAG.dx},
    ],
    'M': [
      {word: 'mike', ipa: '/maɪk/', tag: TAG.standard},
      {word: 'mexico', ipa: '/ˈmɛksəˌkoʊ/', tag: TAG.dx},
    ],
    'N': [
      {word: 'november', ipa: '/noʊˈvembər/', tag: TAG.standard},
      {word: 'norway', ipa: '/ˈnɔrˌweɪ/', tag: TAG.dx},
    ],
    'O': [
      {word: 'oscar', ipa: '/ˈɒskə/', tag: TAG.standard},
      {word: 'ocean', ipa: '/ˈoʊʃn/', tag: TAG.non_standard},
    ],
    'P': [
      {word: 'papa', ipa: '/ˈpɑːpə/', tag: TAG.standard},
      {word: 'pacific', ipa: '/pəˈsɪfɪk/', tag: TAG.dx},
    ],
    'Q': [
      {word: 'quebec', ipa: '/kwəˈbɛk/', tag: TAG.standard},
      {word: 'queen', ipa: '/kwiːn/', tag: TAG.non_standard},
    ],
    'R': [
      {word: 'romeo', ipa: '/ˈroʊmioʊ/', tag: TAG.standard},
      {word: 'radio', ipa: '/ˈreɪdioʊ/', tag: TAG.dx},
    ],
    'S': [
      {word: 'sierra', ipa: '/siˈerə/', tag: TAG.standard},
      {word: 'santiago', ipa: '/ˌsæntiˈɑgoʊ/', tag: TAG.dx},
    ],
    'T': [
      {word: 'tango', ipa: '/ˈtæŋɡoʊ/', tag: TAG.standard},
      {word: 'tokyo', ipa: '/ˈtokjo/', tag: TAG.dx},
      {word: 'texas', ipa: '/ˈtɛksəs/', tag: TAG.non_standard},
    ],
    'U': [
      {word: 'uniform', ipa: '/ˈjuːnɪfɔːrm/', tag: TAG.standard},
      {word: 'united', ipa: '/juˈnaɪtɪd/', tag: TAG.dx},
    ],
    'V': [
      {word: 'victor', ipa: '/ˈvɪktər/', tag: TAG.standard},
      {word: 'victoria', ipa: '/vɪkˈtɔːrɪə/', tag: TAG.dx},
    ],
    'W': [
      {word: 'whiskey', ipa: '/ˈwɪski/', tag: TAG.standard},
      {word: 'washington', ipa: '/ˈwɑʃɪŋtən/', tag: TAG.dx},
    ],
    'X': [
      {word: 'x-ray', ipa: '/ˈeks reɪ/', tag: TAG.standard},
    ],
    'Y': [
      {word: 'yankee', ipa: '/ˈjæŋki/', tag: TAG.standard},
      {word: 'yokohama', ipa: '/ˌjoʊkəˈhɑmə/', tag: TAG.dx},
    ],
    'Z': [
      {word: 'zulu', ipa: '/ˈzuːluː/', tag: TAG.standard},
    ],
  }

  return (
    <>
      <title>字母解释法速查表</title>
      <meta name="description" content="字母解释法速查表"/>

      <div className={'p-4 space-y-2 md:space-y-4'}>
        <div
          className={'w-full p-2 gap-2 text-xs rounded-lg bg-base-100 border shadow-sm border-neutral-content/50 border-b-4'}>
          <svg xmlns="http://www.w3.org/2000/svg" className="inline -mt-1.5 text-accent" width="1.5em" height="1.5em"
               viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"/>
          </svg>
          <p className={'inline ml-1 text-neutral-500'}>
            本页面收录了字母解释法的速查表，包括 ICAO 标准、DX 通联常用、非标准等。
          </p>
        </div>
        <div
          className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4'}>
          <LetterCard/>
        </div>
      </div>
    </>
  );
}
