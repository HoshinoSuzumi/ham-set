'use client'

import './styles.scss'
import {Icon} from '@iconify-icon/react'
import {noto_sc, rubik} from '@/app/fonts'
import {Input, Table} from '@douyinfe/semi-ui'
import {IconSearch} from '@douyinfe/semi-icons'
import useSWR from 'swr'
import {ColumnProps} from '@douyinfe/semi-ui/lib/es/table'

export default function Page() {
  const columns: ColumnProps<{
    status: string
    name: string
    mode: string
  }>[] = [
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '卫星名称',
      dataIndex: 'name',
    },
    {
      title: 'NORAD ID',
      dataIndex: 'norad_id',
    },
    {
      title: '上行',
      dataIndex: 'uplink',
    },
    {
      title: '下行',
      dataIndex: 'downlink',
    },
    {
      title: '信标',
      dataIndex: 'beacon',
    },
    {
      title: '模式',
      dataIndex: 'mode',
      filters: [
        {
          text: 'FM',
          value: 'FM',
        },
        {
          text: 'VHF/UHF',
          value: 'VHF/UHF',
        },
      ],
      onFilter: (value, record) => {
        console.log(value, record?.mode)
        return record?.mode?.includes(value) || false
      },
    },
  ]

  const {
    data,
    isLoading,
  } = useSWR('https://mirror.ghproxy.com/https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/amsat-all-frequencies.json')

  return (
    <div className={'w-full h-full flex flex-col gap-8 items-center pt-8 md:p-8 bg-white dark:bg-neutral-900'}>
      <div>
        <h1 className={`flex flex-col items-center text-lg font-medium ${noto_sc.className}`}>
          <Icon icon={'tabler:satellite'} className={'text-4xl mb-2'}/>
          <span>业余无线电卫星数据库(开发中)</span>
          <span className={`text-xs opacity-50 ${rubik.className}`}>Amateur Radio Satellites Database</span>
        </h1>
        <Input
          placeholder={'搜索卫星名称、国家、频率等'}
          className={'!w-64 mt-4'}
          size={'large'}
          prefix={<IconSearch/>}
        />
      </div>
      <div className={'flex-1 w-full md:w-[80%] md:border md:rounded-lg md:overflow-hidden'}>
        <Table
          columns={columns}
          dataSource={data}
          loading={isLoading}
        />
      </div>
    </div>
  )
}