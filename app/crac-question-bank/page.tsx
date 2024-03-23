'use client'

import useSWR from 'swr';
import {BaseResponse, ExamBankResponse, ExamLevel, ExamQuestion} from '@/app/api/schema';
import {useEffect, useState} from 'react';
import {noto_sc, saira} from '@/app/fonts';
import {Icon} from '@iconify-icon/react';

function QuestionCard({question}: { question: ExamQuestion }) {
  return (
    <div
      className={'flex flex-col justify-between rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 dark:border-neutral-content/30 border-b-4 p-4'}>
      <div className={`${noto_sc}`}>
        <div>
          <h1 className={'text-lg font-bold'}>{question.question}</h1>
        </div>
        <div className={'flex items-center gap-2 text-base-content/70'}>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:square-rounded-letter-q'} className={'text-xl'}/>
            <span className={`font-bold text-base ${saira.className}`}>{question.id}</span>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:book-2'} className={'text-xl'}/>
            <span className={`font-bold text-base ${noto_sc.className}`}>{question.includeIn.join(',')}</span>
          </div>
        </div>
      </div>
      <div
        className={`rounded-lg bg-neutral-100 border border-neutral-content/80 dark:border-neutral-content/30 p-4 mt-2 h-full ${noto_sc.className}`}>
        {question.options[0]}
      </div>
    </div>
  )
}

function QuestionCardPlaceholder() {
  return (
    <div
      className="rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 dark:border-neutral-content/30 border-b-4 p-4 flex flex-col gap-4 w-full">
      <div className="skeleton h-8 w-full"></div>
      <div className="skeleton h-4 w-32 ml-2"></div>
      <div className="skeleton flex-1 w-full min-h-16"></div>
    </div>
  )
}

export default function Page() {
  const [level, setLevel] = useState<ExamLevel>('A')
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null)
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isValidating: questionsValidating,
    error: questionsError,
  } = useSWR<BaseResponse<ExamBankResponse>>(`/api/crac/questionBank/${level}`, {
    refreshInterval: 0,
  })
  useEffect(() => {
    if (questionsData?.data) {
      setQuestions(questionsData.data.questions)
    }
  }, [questionsData?.data]);

  return (
    <>
      <title>试题库</title>
      <meta name="description" content="试题库"/>

      <div className={'p-4 space-y-2 md:space-y-4'}>
        <div
          className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4'}>
          {['A', 'B', 'C', 'FULL'].map((lvl) => (
            <button className={`btn ${level === lvl && 'btn-active'}`} key={lvl}
                    onClick={() => setLevel(lvl as ExamLevel)}>{lvl}</button>
          ))}
        </div>

        <div
          className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5 gap-2 md:gap-4'}>
          {questionsLoading && (
            <>
              <QuestionCardPlaceholder/>
              <QuestionCardPlaceholder/>
              <QuestionCardPlaceholder/>
            </>
          )}
          {questions?.map((question, index) => (
            <QuestionCard key={index} question={question}/>
          ))}
        </div>
      </div>
    </>
  )
}