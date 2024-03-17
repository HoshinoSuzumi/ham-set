'use client'

import {ReactNode, useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Icon} from '@iconify-icon/react';
import {noto_sc, rubik, saira} from '@/app/fonts';
import {Button, Popover, Select, Slider, Space, Tooltip} from '@douyinfe/semi-ui';
import {SpeechSynthesisContext} from '@/contexts/SpeechSynthesisContext';
import {log} from 'node:util';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';


export interface NavListItem {
  label: string;
  pathname?: string;
  icon?: ReactNode;
  submenu?: NavListItem[];
}

export default function MainDrawer({children, nav}: {
  children: ReactNode;
  nav: NavListItem[];
}) {
  const pathname = usePathname();
  const {
    getVoices,
    setVoice,
    currentVoice,
    setSpeed,
    currentSpeed,
    setPitch,
    currentPitch,
  } = useContext(SpeechSynthesisContext)!
  const [voicesOptions, setVoicesOptions] = useState<{
    label: string;
    children: {
      value: SpeechSynthesisVoice | null;
      label: string;
    }[];
  }[]>([])

  useEffect(() => {
    const voices = getVoices()
    const locales = new Set(voices.map((voice: SpeechSynthesisVoice) => voice.lang))
    const options = Array.from(locales).map((locale: string) => {
      const voiceList = voices.filter((voice: SpeechSynthesisVoice) => voice.lang === locale)
      return {
        label: locale,
        children: voiceList.map((voice: SpeechSynthesisVoice) => ({
          value: voice,
          label: voice.name,
        })),
      }
    })
    setVoicesOptions(options)
  }, [getVoices])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    function matchMode(e: MediaQueryListEvent) {
      const body = document.body;
      if (e.matches) {
        if (!body.hasAttribute('theme-mode')) {
          body.setAttribute('theme-mode', 'dark');
        }
      } else {
        if (body.hasAttribute('theme-mode')) {
          body.removeAttribute('theme-mode');
        }
      }
    }

    mql.addEventListener('change', matchMode);
  }, [])

  const handleVoiceChange = (value: any) => {
    console.log(getVoices().find((voice: SpeechSynthesisVoice) => voice.name === value) || null)
    setVoice(getVoices().find((voice: SpeechSynthesisVoice) => voice.name === value) || null)
  }

  return (
    <div className={`drawer`}>
      <input id={'main-drawer'} type={'checkbox'} className={'drawer-toggle'}/>
      <div className={'drawer-content'}>
        <header
          className={'sticky top-0 inset-x-0 h-16 bg-base-100 border-b flex flex-row justify-between items-center px-2 z-50'}>
          <div className={'flex space-x-2'}>
            <div className={'flex-none lg:hidden'}>
              <label htmlFor={'main-drawer'} className={'btn btn-ghost drawer-button'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     className="inline-block w-6 h-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className={`cursor-pointer select-none ${saira.className}`}>
              <h1 className="text-lg font-bold flex items-center gap-1">
                <Icon icon={'mdi:hamburger'}/>
                HAM SET
              </h1>
              <h2 className={`text-xs uppercase`}>
                Toolkit for Amateur Radio
              </h2>
            </div>
          </div>
          <div className={'flex-none hidden lg:block'}>
            <ul className={`menu menu-horizontal space-x-2 ${noto_sc.className}`}>
              {nav.map((item, index) => (
                <li key={index}>
                  <Link href={item.pathname || '#'} className={`${item.pathname === pathname ? 'active' : ''}`}>
                    {item.icon && item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <a className="btn btn-sm btn-ghost text-2xl" href="https://github.com/HoshinoSuzumi/PhoneticAlphabetsTraining"
             target="_blank">
            <Icon icon={'mdi:github'}/>
          </a>
        </header>

        <main style={{minHeight: 'calc(100vh - 4rem)'}}>
          {children}
        </main>

        <footer className={'footer p-10 bg-base-300 text-base-content justify-between'}>
          <aside className={'h-full flex flex-col justify-between'}>
            <div className={'space-y-2'}>
              <p className={'flex items-center gap-1 text-lg'}>
                <Icon icon={'mdi:hamburger'} className={'text-2xl'}/>
                <span className={'font-bold'}>HAM SET</span>
              </p>
              <p className={`text-neutral-500 font-mono`}>
                A part of <a href={'https://c5r.app'}
                             className={'link link-hover font-bold'}
                             target={'_blank'}>CTFever</a><br/>
                Fantastic toolkit for CTFers and everyone
              </p>
            </div>
            <Space wrap>
              <a href={'https://github.com/HoshinoSuzumi/ham-set'} target={'_blank'}>
                <Text
                  className={noto_sc.className}
                  type={'tertiary'}
                  icon={<Icon icon={'mdi:github'}/>}
                  strong
                >
                  GitHub
                </Text>
              </a>
              <Tooltip content={(
                <div className={rubik.className}>
                  <p>
                    aka. <span className={'font-bold'}>HoshinoSuzumi</span>
                  </p>
                  <p>
                    no callsign yet :(
                  </p>
                </div>
              )}>
                <a href={'https://uniiem.com/'} target={'_blank'}>
                  <Text
                    className={noto_sc.className}
                    type={'tertiary'}
                    icon={<Icon icon={'mdi:account-circle'}/>}
                    strong
                  >
                    Author: 5ANK41
                  </Text>
                </a>
              </Tooltip>
              <Popover position={'top'}>
                <a href={'https://afdian.net/a/hoshino_suzumi'} target={'_blank'}>
                  <Text
                    className={noto_sc.className}
                    type={'tertiary'}
                    icon={<Icon icon={'tabler:heart'}/>}
                    strong
                  >
                    Sponsor
                  </Text>
                </a>
              </Popover>
            </Space>
          </aside>
          <div className={'w-72'}>
            <h6 className={'footer-title'}>Speech Settings</h6>
            <div className={'w-full space-y-3'}>
              <fieldset className={'form-control w-full'}>
                <Select
                  className={`w-72 ${noto_sc.className}`}
                  position={'top'}
                  insetLabel={'音色'}
                  value={currentVoice?.name || 'not-selected'}
                  onChange={handleVoiceChange}
                  filter
                >
                  <Select.OptGroup label="默认" className={noto_sc.className}>
                    <Select.Option value="not-selected" className={noto_sc.className}>系统默认</Select.Option>
                  </Select.OptGroup>
                  {voicesOptions.map((group, index) => (
                    <Select.OptGroup label={group.label} key={`${index}-${group.label}`} className={rubik.className}>
                      {group.children.map((option, index2) => (
                        <Select.Option value={option.label} key={`${index2}-${group.label}`}
                                       className={noto_sc.className}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
                <h6 className={`text-xs text-neutral-400 mt-0.5 ${noto_sc.className}`}>
                  语音来自你的浏览器和系统 TTS 服务
                </h6>
              </fieldset>
              <fieldset className={'form-control w-full'}>
                <div className={'join items-center space-x-2'}>
                  <h2 className={'font-mono inline-flex flex-col items-center'}>
                    <span className={'leading-none'}>SPEED</span>
                    <span className={'text-xs leading-none'}>{currentSpeed}</span>
                  </h2>
                  <input type={'range'} min={0.5} max={2.0} step={0.1} value={currentSpeed} className={'range range-xs'}
                         onChange={(e) => setSpeed(parseFloat(e.target.value))}/>
                </div>
              </fieldset>
              <fieldset className={'form-control w-full'}>
                <div className={'join items-center space-x-2'}>
                  <h2 className={'font-mono inline-flex flex-col items-center'}>
                    <span className={'leading-none'}>PITCH</span>
                    <span className={'text-xs leading-none'}>1.0</span>
                  </h2>
                  <input type={'range'} min={0.5} max={2.0} step={0.1} value={currentPitch} className={'range range-xs'}
                         onChange={(e) => setPitch(parseFloat(e.target.value))}/>
                </div>
              </fieldset>
            </div>
          </div>
        </footer>
      </div>
      <div className={'drawer-side'}>
        <label htmlFor={'main-drawer'} aria-label={'close sidebar'} className={'drawer-overlay'}/>
        <ul
          className={`menu pt-20 px-2 w-64 space-y-1 min-h-screen bg-base-100/80 backdrop-blur-lg backdrop-saturate-50 text-base-content ${noto_sc.className}`}>
          {nav.map((item, index) =>
            <li key={index}>
              <Link href={item.pathname || '#'} className={`${pathname === item.pathname ? 'active' : ''}`}>
                {item.icon || <span className={'w-4 h-4'}></span>}
                <span>{item.label}</span>
              </Link>
            </li>,
          )}
        </ul>
      </div>
    </div>
  )
}