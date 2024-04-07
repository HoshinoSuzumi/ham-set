'use client'

import {Icon} from '@iconify-icon/react'
import {noto_sc, rubik} from '@/app/fonts'
import {Input} from '@douyinfe/semi-ui'
import {IconSearch} from '@douyinfe/semi-icons'

export default function Page() {
  return (
    <div className={'w-full h-full flex flex-col items-center p-8 bg-white dark:bg-neutral-900'}>
      <div>
        <h1 className={`flex flex-col items-center text-lg font-medium ${noto_sc.className}`}>
          <Icon icon={'tabler:satellite'} className={'text-4xl mb-2'}/>
          <span>业余无线电卫星数据库</span>
          <span className={`text-xs opacity-50 ${rubik.className}`}>Amateur Radio Satellites Database</span>
        </h1>
        <Input
          placeholder={'搜索卫星名称、国家、频率等'}
          className={'!w-64 mt-4'}
          size={'large'}
          prefix={<IconSearch/>}
          clearIcon
        />
      </div>
    </div>
  )
}