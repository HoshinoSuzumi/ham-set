'use client'

import './styles.scss'
import {Key, useRef, useState} from 'react'
import {ColumnProps} from '@douyinfe/semi-ui/lib/es/table'
import useSWR from 'swr'
import {FrequenciesData, FrequenciesRawData, Transponder} from '@/app/satellites/page'
import {Icon} from '@iconify-icon/react'
import {noto_sc, rubik} from '@/app/fonts'
import {Input, Table} from '@douyinfe/semi-ui'
import {IconSearch} from '@douyinfe/semi-icons'
import {TransponderCard} from '@/app/satellites/TransponderCard'

export const Main = () => {
  const compositionRef = useRef({isComposition: false})
  const [filteredValue, setFilteredValue] = useState<FrequenciesData[]>([])

  const columns: ColumnProps<FrequenciesData>[] = [
    {
      title: '转发器',
      dataIndex: 'transponders',
      width: 100,
      align: 'center',
      render: (record) => (
        <div className={'mx-auto flex w-10 h-1.5 rounded-lg bg-black overflow-hidden divide-x dark:divide-neutral-700'}>
          {record?.map((transponder: Transponder, index: Key | null | undefined) => (
            <div
              key={index}
              style={{
                width: 1 / record.length * 100 + '%',
              }}
              className={`h-full ${transponder.status === 'active' ? 'bg-green-500' : transponder.status === 'inactive' ? 'bg-red-500' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      ),
      filters: [
        {
          text: 'FM',
          value: 'FM',
        },
        {
          text: 'CW',
          value: 'CW',
        },
        {
          text: 'Linear',
          value: 'Linear',
        },
        {
          text: 'SSB',
          value: 'SSB',
        },
        {
          text: 'FSK',
          value: 'FSK',
        },
        {
          text: 'AFSK',
          value: 'AFSK',
        },
        {
          text: 'QPSK',
          value: 'QPSK',
        },
      ],
      onFilter: (value, record) => {
        return record?.transponders.some(item => item.mode?.includes(value)) || false
      },
    },
    {
      title: '卫星名称',
      dataIndex: 'name',
      sorter: (a, b) => a?.name.localeCompare(b?.name || '') || 0,
      onFilter: (value, record) => {
        const lowerValue = value.toLowerCase()
        return record?.name.toLowerCase().includes(lowerValue) || `${record?.norad_id || ''}`.includes(lowerValue) || false
      },
      filteredValue,
    },
    {
      title: 'NORAD ID',
      dataIndex: 'norad_id',
      sorter: (a, b) => ((a?.norad_id || 0) - (b?.norad_id || 0)) || 0,
    },
    {
      title: 'SatNOGS ID',
      dataIndex: 'satnogs_id',
    },
  ]

  const {
    data: frequenciesData,
    isLoading: isFrequenciesLoading,
  } = useSWR<FrequenciesRawData[]>('https://mirror.ghproxy.com/https://raw.githubusercontent.com/palewire/ham-satellite-database/main/data/amsat-all-frequencies.json')

  const groupedFrequencies = frequenciesData?.reduce<FrequenciesData[]>((acc, cur) => {
    const existing = acc.find(item => item.name === cur.name)
    if (!existing) {
      acc.push({
        name: cur.name,
        norad_id: cur.norad_id,
        satnogs_id: cur.satnogs_id,
        transponders: [
          {
            uplink: cur.uplink,
            downlink: cur.downlink,
            beacon: cur.beacon,
            mode: cur.mode,
            status: cur.status,
          },
        ],
      })
    } else {
      existing.transponders.push({
        uplink: cur.uplink,
        downlink: cur.downlink,
        beacon: cur.beacon,
        mode: cur.mode,
        status: cur.status,
      })
    }
    return acc
  }, [])

  function handleCompositionStart() {
    compositionRef.current.isComposition = true
  }

  function handleCompositionEnd(event: any) {
    compositionRef.current.isComposition = false
    const value = event.target?.value
    const newFilteredValue = value ? [value] : []
    setFilteredValue(newFilteredValue)
  }

  function handleChange(value: any) {
    if (compositionRef.current.isComposition) {
      return
    }
    const newFilteredValue = value ? [value] : []
    setFilteredValue(newFilteredValue)
  }

  return (
    <div className={'w-full h-full flex flex-col gap-8 items-center pt-8 md:p-8 bg-white dark:bg-neutral-900'}>
      <div>
        <h1 className={`flex flex-col items-center text-lg font-medium ${noto_sc.className}`}>
          <Icon icon={'tabler:satellite'} className={'text-4xl mb-2'}/>
          <span>业余无线电卫星数据库</span>
          <span className={`text-xs opacity-50 ${rubik.className}`}>Amateur Radio Satellites Database</span>
        </h1>
        <Input
          placeholder={'搜索卫星名称、NORAD ID'}
          className={'!w-64 mt-4'}
          size={'large'}
          disabled={isFrequenciesLoading}
          prefix={<IconSearch/>}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onChange={handleChange}
        />
      </div>
      <div className={'flex-1 w-full md:w-[80%]'}>
        <Table
          bordered
          rowKey={'name'}
          style={rubik.style}
          columns={columns}
          dataSource={groupedFrequencies}
          expandCellFixed
          hideExpandedColumn={false}
          expandIcon={<Icon icon={'tabler:caret-right-filled'}/>}
          expandedRowRender={(record) => (
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
              {record?.transponders.map((transponder, index) => (
                <TransponderCard transponder={transponder} key={index}/>
              ))}
            </div>
          )}
          pagination={{
            pageSize: 30,
            position: 'both',
            formatPageText: (page) => `第 ${page?.currentStart}-${page?.currentEnd} 项，共 ${page?.total} 组`,
          }}
          loading={isFrequenciesLoading}
        />
      </div>
    </div>
  )
}