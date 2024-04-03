import {ExamQuestion} from "@/app/api/schema";
import {Annotation, getAnnotationsByLk, newAnnotation, upvoteAnnotation} from "@/app/actions";
import {useEffect, useRef, useState} from "react";
import {GeetestCaptchaSuccess} from "@/app/geetest";
import {Banner, Button, Input, Modal, Notification, Popover, TextArea} from "@douyinfe/semi-ui";
import {noto_sc, rubik, saira} from "@/app/fonts";
import IconNoObserve from "@/components/IconNoObserve";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css'
import dayjs from "@/app/utils/dayjs";
import GeetestCaptcha from "@/components/GeetestCaptcha";
import {IconSpinner} from "@/components/Icon/IconSpinner";
import {CSSTransition, TransitionGroup} from "react-transition-group";

export default function QuestionCard({
  question,
  annotation,
  highlight,
  onAnnotationChange,
}: {
  question: ExamQuestion,
  annotation?: Annotation,
  highlight?: boolean
  onAnnotationChange?: (lk: string, annotation: Annotation) => void,
}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [listModalVisible, setListModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [allAnnotations, setAllAnnotations] = useState<Annotation[]>([])
  const [optionsExpanded, setOptionsExpanded] = useState(false)

  const questionCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (highlight) {
      setTimeout(() => {
        questionCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }, 200)
    }
  }, [highlight]);

  async function fetchAnnotations() {
    const gotAnnotations = await getAnnotationsByLk(question.id)
    setAllAnnotations(gotAnnotations)
  }

  function handleEdit(
    lk: string,
    author: string | null,
    content: string,
    validate: GeetestCaptchaSuccess
  ) {
    if (!content) {
      Notification.error({
        title: '内容为空',
        content: '请输入内容',
      })
      return
    } else if (content?.length > 512) {
      Notification.error({
        title: '内容过长',
        content: '内容不超过 512 个字符',
      })
      return
    }
    setSubmitting(true)
    newAnnotation(question.id, content, author, validate).then(() => {
      setSubmitting(false)
      setModalVisible(false)
      if (annotation) {
        onAnnotationChange?.(lk, {
          ...annotation,
          annotation: content,
        })
      } else {
        onAnnotationChange?.(lk, {
          id: 0,
          lk: lk,
          annotation: content,
          author: author,
          create_at: Date.now(),
          update_at: Date.now(),
          upvote: 0,
        })
      }
    }).catch(() => {
      setSubmitting(false)
      Notification.error({
        title: '提交失败',
        content: '请稍后再试',
      })
    })
  }

  const inputAuthor = useRef<HTMLInputElement | null>(null)
  const inputAnnotation = useRef<HTMLTextAreaElement | null>(null)

  function handleValidateSuccess(validate: GeetestCaptchaSuccess) {
    handleEdit(
      question.id,
      inputAuthor.current?.value || null,
      inputAnnotation.current?.value || '',
      validate
    )
  }

  function handleUpvoteValidateSuccess(
    question: ExamQuestion,
    annotation: Annotation,
    validate: GeetestCaptchaSuccess
  ) {
    (async () => await upvoteAnnotation(annotation.id, validate))()
    onAnnotationChange?.(question.id, {
      ...annotation,
      upvote: annotation.upvote + 1,
    })
  }

  function handleUpvoteInModalValidateSuccess(
    annotation: Annotation,
    validate: GeetestCaptchaSuccess
  ) {
    (async () => await upvoteAnnotation(annotation.id, validate))()
    setAllAnnotations(allAnnotations.map(item => item.id === annotation.id ? {
      ...annotation,
      upvote: annotation.upvote + 1,
    } : item))
  }

  // noinspection RequiredAttributes
  return (
    <>
      <div
        ref={questionCardRef}
        className={`flex flex-col justify-between rounded-lg bg-base-100 border shadow-sm p-4 border-b-4 ${highlight ? 'border-indigo-400 dark:border-indigo-500' : 'border-neutral-content/80 dark:border-neutral-content/30'} group transition`}
      >
        <div className={`${noto_sc.className}`}>
          <div>
            <h1 className={'text-lg font-medium'}>{question.question}</h1>
          </div>
          <div className={'flex justify-between items-center text-base-content/70'}>
            <div className={'flex items-center gap-2'}>
              <div className={'flex items-center gap-1'}>
                <IconNoObserve icon={'tabler:square-rounded-letter-q'} className={'text-xl'} observe={false}/>
                <span className={`font-bold text-base ${saira.className}`}>{question.id}</span>
              </div>
              {question.picture && (
                <Popover content={(
                  <div className={'flex justify-center items-center w-96 aspect-video relative'}>
                    <Image
                      src={`/crac/images/${question.picture}`}
                      alt={question.question}
                      fill
                      className={'rounded-lg object-contain'}
                    />
                  </div>
                )} trigger={'hover'} showArrow>
                  <div className={'hidden md:flex items-center gap-1 cursor-pointer'}>
                    <IconNoObserve icon={'tabler:photo'} className={'text-xl'}/>
                    <span
                      className={`font-bold text-base text-accent/80 underline underline-offset-4 ${saira.className}`}>Picture</span>
                  </div>
                </Popover>
              )}
              <div className={'flex items-center gap-1'}>
                <IconNoObserve icon={'tabler:book-2'} className={'text-xl'}/>
                <span className={`font-bold text-base ${saira.className}`}>{question.includeIn.join(',')}</span>
              </div>
            </div>
            <div className={'flex items-center gap-2'}>
              {!annotation && (
                <div onClick={() => setModalVisible(true)}
                     className={'flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition cursor-pointer'}>
                  <IconNoObserve icon={'tabler:edit'} className={'text-xl'}/>
                  <span className={`font-bold text-base ${noto_sc.className}`}>编写解析</span>
                </div>
              )}
              <Button
                size={'small'}
                theme={'borderless'}
                type={'tertiary'}
                className={'!px-1'}
                icon={<IconNoObserve icon={optionsExpanded ? 'tabler:chevrons-up' : 'tabler:chevrons-down'}
                                     className={'text-xl'}/>}
                onClick={() => setOptionsExpanded(!optionsExpanded)}
              >
                {optionsExpanded ? '收起' : '展开'}
              </Button>
            </div>
          </div>
        </div>
        {question.picture && (
          <div className={'flex md:hidden justify-center items-center w-full aspect-square relative'}>
            <Image
              src={`/crac/images/${question.picture}`}
              alt={question.question}
              fill
              className={'rounded-lg object-contain'}
            />
          </div>
        )}
        <div
          className={`flex flex-col rounded-lg bg-neutral-100 dark:bg-neutral border border-neutral-content/80 dark:border-neutral-content/30 p-4 mt-2 h-full ${noto_sc.className}`}>
          <div className={'flex-1 grid grid-cols-1 gap-2'}>
            <TransitionGroup component={null}>
              {question.options.map((option, index) => (
                (optionsExpanded || index === 0) && (
                  <CSSTransition
                    key={index}
                    classNames={{
                      enterActive: 'transition-all duration-300 opacity-100 translate-x-0',
                      exitActive: 'transition-all duration-300 opacity-0 -translate-x-4',
                      enter: 'opacity-0 -translate-x-4',
                      exit: 'transition-all duration-300 opacity-0',
                    }}
                    style={{
                      transitionDelay: `${(index + 1) * 50}ms`,
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    timeout={{
                      enter: index * 50 + 300,
                      exit: 300,
                    }}
                  >
                    <div
                      className={`flex justify-between items-start py-2 rounded-lg border-2 border-transparent relative overflow-hidden
                                  ${optionsExpanded ? 'px-2 pl-0 gap-2' : 'p-0'}
                                  ${(optionsExpanded && index !== 0) && 'bg-neutral-200 dark:bg-neutral-800'}
                                  ${(optionsExpanded && index === 0) && 'bg-accent/10 dark:bg-accent/10 border-accent/35 dark:border-accent/30'}
                      `}
                    >
                      <span
                        className={`font-bold text-base text-neutral-500 dark:text-neutral-500 overflow-hidden transition-all duration-300
                                    ${optionsExpanded ? 'w-4 ml-3.5' : 'w-0'} ${rubik.className}
                        `}
                      >
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className={`flex-1 font-medium z-[1] ${noto_sc.className}`}>{option.trim()}</span>
                      {(optionsExpanded && index === 0) && (
                        <svg className={'absolute -top-2.5 -right-2.5 text-accent/30 fill-accent/20'}
                             xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"
                        >
                          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                             strokeWidth="2">
                            <path
                              d="M5 7.2A2.2 2.2 0 0 1 7.2 5h1a2.2 2.2 0 0 0 1.55-.64l.7-.7a2.2 2.2 0 0 1 3.12 0l.7.7c.412.41.97.64 1.55.64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58.23 1.138.64 1.55l.7.7a2.2 2.2 0 0 1 0 3.12l-.7.7a2.2 2.2 0 0 0-.64 1.55v1a2.2 2.2 0 0 1-2.2 2.2h-1a2.2 2.2 0 0 0-1.55.64l-.7.7a2.2 2.2 0 0 1-3.12 0l-.7-.7a2.2 2.2 0 0 0-1.55-.64h-1a2.2 2.2 0 0 1-2.2-2.2v-1a2.2 2.2 0 0 0-.64-1.55l-.7-.7a2.2 2.2 0 0 1 0-3.12l.7-.7A2.2 2.2 0 0 0 5 8.2z"/>
                            <path d="m9 12l2 2l4-4"/>
                          </g>
                        </svg>
                      )}
                    </div>
                  </CSSTransition>
                )
              ))}
            </TransitionGroup>
          </div>
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
                      <IconNoObserve icon={'tabler:edit'}/>
                      <span className={`${noto_sc.className}`}>编辑</span>
                    </div>
                  </div>
                </div>
                <article
                  className={'annotation-typography flex-1 md:max-h-28 overflow-auto overflow-x-hidden'}
                >
                  <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {annotation.annotation}
                  </Markdown>
                </article>
              </div>
              <div className={'w-full text-sm flex justify-end items-center gap-2'}>
                <div className={'flex items-center gap-0.5 font-bold text-base-content/50 cursor-pointer'}>
                  <IconNoObserve icon={'tabler:clock-edit'} className={'text-base'}/>
                  <span className={`text-xs ${noto_sc.className}`}>
                    {dayjs.tz(annotation.create_at).fromNow()}
                  </span>
                </div>
                <div onClick={() => {
                  (async () => await fetchAnnotations())()
                  setListModalVisible(true)
                }}
                     className={'flex items-center gap-0.5 font-bold text-base-content/50 cursor-pointer'}>
                  <IconNoObserve icon={'tabler:list-details'} className={'text-base'}/>
                  <span className={`text-xs ${noto_sc.className}`}>所有解析</span>
                </div>
                <GeetestCaptcha
                  captchaConfig={{
                    captchaId: '85fd23c240abbea32f8d469d923b6639',
                    product: 'bind',
                    riskType: 'ai'
                  }}
                  selectorWhenBind={`#upvote-button-${question.id}`}
                  onSuccess={validate => handleUpvoteValidateSuccess(question, annotation, validate)}
                />
                <div
                  id={`upvote-button-${question.id}`}
                  className={'flex items-center gap-0.5 font-bold text-base-content/50 cursor-pointer'}
                >
                  <IconNoObserve icon={'tabler:arrow-big-up-line'} className={'text-base'}/>
                  <span className={`${rubik.className}`}>{annotation.upvote}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title={`为 ${question.id} ${annotation ? '编辑' : '创建'}解析`}
        visible={modalVisible}
        width={window.innerWidth < 768 ? '100%' : 640}
        centered
        fullScreen={
          window.innerWidth < 768
        }
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div className={`pb-6 flex flex-col gap-2 ${noto_sc.className}`}>
          <Input ref={inputAuthor} prefix="呼号/昵称" placeholder={'留空则为匿名'}
                 disabled={submitting}
                 showClear
                 defaultValue={annotation?.author || ''}
          ></Input>
          <TextArea ref={inputAnnotation} placeholder={'请确保内容的正确和中立'}
                    className={'!w-full'}
                    maxCount={512}
                    disabled={submitting}
                    rows={12}
                    showClear
                    defaultValue={annotation?.annotation || ''}
          />
          <div className={'flex items-center gap-2 overflow-auto overflow-y-hidden'}>
            <Button
              onClick={() => {
                window.open('https://docs.github.com/zh/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax')
              }}
              className={'w-fit'}
              type={'tertiary'}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <path d="M7 15V9l2 2l2-2v6m3-2l2 2l2-2m-2 2V9"/>
                </g>
              </svg>}
            >
              GFMarkdown 支持
            </Button>
            <Button
              onClick={() => {
                window.open('https://texdoc.org/index.html')
              }}
              className={'w-fit'}
              type={'tertiary'}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 19a2 2 0 0 0 2 2c2 0 2-4 3-9s1-9 3-9a2 2 0 0 1 2 2m-8 7h6m4 0l6 6m-6 0l6-6"/>
              </svg>}
            >
              LaTeX 支持
            </Button>
          </div>
          <Banner
            type={'info'}
            fullMode={false}
            bordered
            closeIcon={null}
            icon={<IconNoObserve icon={'tabler:creative-commons-by'} className={'text-xl'}/>}
            description="您发布的题解内容以 CC BY-NC-SA 4.0 协议发布"
          />
          <GeetestCaptcha
            captchaConfig={{
              captchaId: '85fd23c240abbea32f8d469d923b6639',
              product: 'bind',
            }}
            selectorWhenBind={'#submit-button'}
            onSuccess={validate => handleValidateSuccess(validate)}
          />
          <div className={'flex gap-2'}>
            <Button block id={'submit-button'}
                    loading={submitting}>
              提交
            </Button>
            <Button type={'tertiary'}
                    block
                    disabled={submitting}
                    onClick={() => {
                      setModalVisible(false)
                    }}
            >
              取消
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title={`${question.id} 的所有解析`}
        visible={listModalVisible}
        width={window.innerWidth < 768 ? '100%' : 640}
        centered
        fullScreen={
          window.innerWidth < 768
        }
        footer={null}
        onCancel={() => setListModalVisible(false)}
      >
        <ul className={'flex flex-col pb-6 gap-2 max-h-96 overflow-y-auto'}>
          {allAnnotations.length === 0 && (
            <li className={'flex justify-center items-center gap-2 bg-neutral-100 dark:bg-neutral-700 rounded p-2'}>
              <IconSpinner className={'text-lg'}/>
              <span className={`text-sm ${rubik.className}`}>Loading...</span>
            </li>
          )}
          {allAnnotations.sort(
            (a, b) => b.upvote - a.upvote,
          ).map((anno, index) => (
            <li key={index} className={'flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-700 rounded p-2'}>
              <div className={'flex justify-between items-center gap-2 text-sm text-base-content/80'}>
                <div className={'flex items-center gap-2'}>
                  <div className={'flex items-center gap-1'}>
                    <IconNoObserve icon={'tabler:user-circle'} className={'text-base'}/>
                    <span className={`text-xs font-bold ${noto_sc.className}`}>
                      {anno.author || '匿名'}
                    </span>
                  </div>
                  <div className={'flex items-center gap-1'}>
                    <IconNoObserve icon={'tabler:clock-edit'} className={'text-base'}/>
                    <span className={`text-xs ${noto_sc.className}`}>
                      {dayjs.tz(anno.create_at).fromNow()}
                    </span>
                  </div>
                </div>
                <GeetestCaptcha
                  captchaConfig={{
                    captchaId: '85fd23c240abbea32f8d469d923b6639',
                    product: 'bind',
                    riskType: 'ai'
                  }}
                  selectorWhenBind={`#upvote-button-modal-${anno.id}`}
                  onSuccess={validate => handleUpvoteInModalValidateSuccess(anno, validate)}
                />
                <div
                  id={`upvote-button-modal-${anno.id}`}
                  className={'flex items-center gap-1 cursor-pointer'}
                >
                  <IconNoObserve icon={'tabler:arrow-big-up-line'} className={'text-base'}/>
                  <span className={`${
                    anno.upvote === Math.max(...allAnnotations.map(item => item.upvote)) && 'font-bold'
                  } ${rubik.className}`}>
                    {anno.upvote}
                  </span>
                </div>
              </div>
              <article className={`annotation-typography ${noto_sc.className}`}>
                <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {anno.annotation}
                </Markdown>
              </article>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}