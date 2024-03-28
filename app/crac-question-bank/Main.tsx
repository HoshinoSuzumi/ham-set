'use client'

import {BaseResponse, ExamBankResponse, ExamLevel} from '@/app/api/schema';
import {ReactNode, useEffect, useState} from 'react';
import useSWR from 'swr';
import {Annotation, getAnnotationsList} from '@/app/actions';
import {noto_sc, rubik} from '@/app/fonts';
import "./Main.scss";
import {Pagination, Select, Switch,} from '@douyinfe/semi-ui';
import QuestionCard from "@/app/crac-question-bank/QuestionCard";

function QuestionCardPlaceholder({
  count
}: {
  count: number
}) {
  return (
    Array.from({length: count}).map((_, index) => (
        <div
          key={index}
          className="rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 dark:border-neutral-content/30 border-b-4 p-4 flex flex-col gap-4 w-full"
        >
          <div className="skeleton rounded h-8 w-full"></div>
          <div className={'flex items-center gap-2'}>
            <div className="skeleton rounded h-6 w-20"></div>
            <div className="skeleton rounded h-6 w-20"></div>
          </div>
          <div className="skeleton rounded flex-1 w-full min-h-16"></div>
        </div>
      )
    )
  )
}

export default function Main() {
  const [level, setLevel] = useState<ExamLevel>('A')
  const [hasAnnoOnly, setHasAnnoOnly] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 40,
  })
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const {
    data: questionsData,
    isLoading: questionsLoading,
  } = useSWR<BaseResponse<ExamBankResponse>>(`/api/crac/question-bank/${level}`, {
    refreshInterval: 0,
  })

  const questions = questionsData?.data?.questions || null
  const questionsHasAnno = questions?.filter(item => {
    return annotations.map(anno => anno.lk).includes(item.id)
  })
  const pagedQuestions = (hasAnnoOnly ? questionsHasAnno : questions)?.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize)

  useEffect(() => {
    (async () => {
      const gotAnnotations = await getAnnotationsList()
      setAnnotations(gotAnnotations)
    })()
  }, []);

  function QPaginationContainer({
    children,
  }: {
    children: ReactNode
  }) {
    return (
      <div
        className={'w-full flex flex-col md:flex-row justify-center md:justify-between items-center rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 dark:border-neutral-content/30 border-b-4 gap-4 p-4 px-0 md:px-4'}>
        {children}
        <Pagination
          className={'flex-wrap'}
          total={(hasAnnoOnly ? questionsHasAnno : questions)?.length || 0}
          currentPage={pagination.current}
          pageSize={pagination.pageSize}
          hideOnSinglePage
          onPageChange={(page) => setPagination({
            ...pagination,
            current: page,
          })}
        >
        </Pagination>
      </div>
    )
  }

  return (
    <>
      <div className={'p-4 space-y-2 md:space-y-4'}>
        <QPaginationContainer>
          <div className={'flex items-center gap-2'}>
            <Select
              value={level}
              onSelect={(value) => {
                setLevel(value as ExamLevel)
                setPagination({
                  ...pagination,
                  current: 1,
                })
              }}
              style={{width: 120}}
            >
              <Select.Option value="A">A 类题库</Select.Option>
              <Select.Option value="B">B 类题库</Select.Option>
              <Select.Option value="C">C 类题库</Select.Option>
              <Select.Option value="FULL">总题库</Select.Option>
            </Select>
            <p className={`font-medium text-xs ${noto_sc.className}`}>共 {questions?.length || '...'} 题</p>
            <div className={'flex items-center gap-1'}>
              <Switch
                checked={hasAnnoOnly}
                onChange={checked => {
                  setPagination({
                    ...pagination,
                    current: 1,
                  })
                  setHasAnnoOnly(checked)
                }}
                aria-label="仅看有解析题目"
              />
              <p
                className={`font-medium text-xs ${noto_sc.className}`}>仅看有解析({questionsHasAnno?.length || '..'}题)</p>
            </div>
          </div>
        </QPaginationContainer>
        <div
          className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5 gap-2 md:gap-4'}>
          {questionsLoading && <QuestionCardPlaceholder count={pagination.pageSize}/>}
          {!questionsLoading && pagedQuestions?.map((question, index) => (
            <QuestionCard key={index} question={question} onAnnotationChange={(lk, annotation) => {
              setAnnotations(annotations.find(anno => anno.lk === lk) ? annotations.map(anno => anno.lk === lk ? annotation : anno) : [...annotations, annotation])
            }} annotation={annotations?.filter(item => item.lk === question.id)[0]}/>
          ))}
        </div>
        <QPaginationContainer>
          <div className={'flex items-center gap-2'}>
            <p className={`font-medium text-sm ${noto_sc.className}`}>
              总 {annotations.length || '...'} 则题目解析 | 题库版本 <span
              className={rubik.className}>v20211022</span>
            </p>
          </div>
        </QPaginationContainer>
      </div>
    </>
  )
}