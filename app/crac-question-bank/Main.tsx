'use client'

import {BaseResponse, ExamBankResponse, ExamLevel, ExamQuestion} from '@/app/api/schema';
import {useEffect, useState} from 'react';
import useSWR from 'swr';
import {Annotation, getLkAnnotations, setLkAnnotation} from '@/app/actions';
import {noto_sc, rubik, saira} from '@/app/fonts';
import {Icon} from '@iconify-icon/react';
import {Banner, Button, Input, Modal, Notification, TextArea} from '@douyinfe/semi-ui';

function QuestionCard({
  question,
  annotation,
  onAnnotationChange,
}: {
  question: ExamQuestion,
  annotation?: Annotation,
  onAnnotationChange?: (lk: string, annotation: Annotation) => void,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [modalForm, setModalForm] = useState({
    author: annotation?.author,
    annotation: annotation?.annotation,
  })

  function handleEdit(
    lk: string,
    author: string | null,
    content: string,
  ) {
    if (content?.length > 80) {
      Notification.error({
        title: '内容过长',
        content: '内容不超过 80 个字符',
      })
      return
    } else if (!content) {
      Notification.error({
        title: '内容为空',
        content: '请输入内容',
      })
      return
    }
    setSubmitting(true)
    setLkAnnotation(question.id, content, author).then(() => {
      setSubmitting(false)
      setModalVisible(false)
      onAnnotationChange?.(lk, {
        lk,
        author,
        annotation: content,
      })
    }).catch(() => {
      setSubmitting(false)
      Notification.error({
        title: '提交失败',
        content: '请稍后再试',
      })
    })
  }

  return (
    <>
      <div
        className={'flex flex-col justify-between rounded-lg bg-base-100 border shadow-sm border-neutral-content/80 dark:border-neutral-content/30 border-b-4 p-4 group'}>
        <div className={`${noto_sc}`}>
          <div>
            <h1 className={'text-lg font-bold'}>{question.question}</h1>
          </div>
          <div className={'flex justify-between items-center text-base-content/70'}>
            <div className={'flex items-center gap-2'}>
              <div className={'flex items-center gap-1'}>
                <Icon icon={'tabler:square-rounded-letter-q'} className={'text-xl'}/>
                <span className={`font-bold text-base ${saira.className}`}>{question.id}</span>
              </div>
              <div className={'flex items-center gap-1'}>
                <Icon icon={'tabler:book-2'} className={'text-xl'}/>
                <span className={`font-bold text-base ${noto_sc.className}`}>{question.includeIn.join(',')}</span>
              </div>
            </div>
            {!annotation && (
              <div onClick={() => setModalVisible(true)}
                   className={'flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition cursor-pointer'}>
                <Icon icon={'tabler:edit'} className={'text-xl'}/>
                <span className={`font-bold text-base ${noto_sc.className}`}>编写解析</span>
              </div>
            )}
          </div>
        </div>
        <div
          className={`rounded-lg bg-neutral-100 dark:bg-neutral border border-neutral-content/80 dark:border-neutral-content/30 p-4 mt-2 h-full ${noto_sc.className}`}>
          {question.options[0]}
          {annotation && (
            <div className={'border-t dark:border-t-neutral-600/80 mt-4 pt-2'}>
              <div className={'text-sm inline-flex flex-col gap-1'}>
                <div className={`font-bold text-accent inline-flex justify-between items-center gap-2`}>
                  <div className={'inline-flex items-center gap-0.5'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M3.691 6.292C5.094 4.771 7.217 4 10 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.902 2.902 0 0 0 6.925 10H10a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2H3a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789M20 20h-6a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789C16.094 4.771 18.217 4 21 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.902 2.902 0 0 0 17.925 10H21a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2"/>
                    </svg>
                    友台解析
                    <span className={'text-xs mt-0.5 text-base-content/30'}>
                    by {annotation.author || '匿名'}
                  </span>
                    <div onClick={() => setModalVisible(true)}
                         className={'flex items-center gap-0.5 font-bold text-base-content/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition cursor-pointer'}>
                      <Icon icon={'tabler:edit'}/>
                      <span className={`${noto_sc.className}`}>编辑</span>
                    </div>
                  </div>
                </div>
                <span className={'flex-1 indent-4'}>
                {annotation.annotation}
              </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title={`为 ${question.id} ${annotation ? '编辑' : '创建'}解析`}
        visible={modalVisible}
        centered
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div className={`pb-6 flex flex-col gap-2 ${noto_sc.className}`}>
          <Input prefix="呼号/昵称" placeholder={'留空则为匿名'}
                 defaultValue={annotation?.author as string}
                 disabled={submitting}
                 showClear
                 onInput={
                   (e) => setModalForm({
                     ...modalForm,
                     author: e.currentTarget.value,
                   })
                 }
          ></Input>
          <TextArea placeholder={'请确保内容的正确和中立'}
                    className={'!w-full'}
                    maxCount={80}
                    disabled={submitting}
                    showClear
                    defaultValue={annotation?.annotation}
                    onInput={
                      (e) => setModalForm({
                        ...modalForm,
                        annotation: e.currentTarget.value,
                      })
                    }
          />
          <Banner
            type={'info'}
            fullMode={false}
            bordered
            closeIcon={null}
            description="请确保提交内容的正确和中立，请勿恶意修改。题目解析由大家共建"
          />
          <div className={'flex gap-2'}>
            <Button type={'primary'}
                    block
                    loading={submitting}
                    onClick={() => handleEdit(question.id, modalForm.author || null, modalForm.annotation as string)}>
              提交
            </Button>
            <Button type={'tertiary'}
                    block
                    disabled={submitting}
                    onClick={() => setModalVisible(false)}>
              取消
            </Button>
          </div>
        </div>
      </Modal>
    </>

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

export default function Main() {
  const [level, setLevel] = useState<ExamLevel>('A')
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
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
  useEffect(() => {
    (async () => {
      const gotAnnotations = await getLkAnnotations()
      setAnnotations(gotAnnotations)
    })()
  }, []);

  return (
    <>
      <div className={'p-4 space-y-2 md:space-y-4'}>
        <div
          className={'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4'}>
          {['A', 'B', 'C', 'FULL'].map((lvl) => (
            <button className={`btn ${rubik.className} ${level === lvl && 'btn-primary'}`} key={lvl}
                    onClick={() => setLevel(lvl as ExamLevel)}>{lvl}</button>
          ))}
        </div>
        <p className={`font-bold ${noto_sc.className}`}>不要吐槽上面的按钮了，目前在开发阶段，这玩意是测试用的</p>

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
            <QuestionCard key={index} question={question} onAnnotationChange={(lk, annotation) => {
              setAnnotations(annotations.find(anno => anno.lk === lk) ? annotations.map(anno => anno.lk === lk ? annotation : anno) : [...annotations, annotation])
            }} annotation={annotations?.filter(item => item.lk === question.id)[0]}/>
          ))}
        </div>
      </div>
    </>
  )
}