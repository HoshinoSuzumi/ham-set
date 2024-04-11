import { Transmitter } from '@/app/api/types'
import { Icon } from '@iconify-icon/react'
import { rubik } from '@/app/fonts'

export const TransponderCard = ({
  transmitter,
}: {
  transmitter: Transmitter
}) => {
  return (
    <div
      className={`w-full px-3 py-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded ${rubik.className}`}>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-center gap-0.5 text-nowrap'}>
          <Icon
            title={ transmitter.status }
            icon={ transmitter.status === 'active' ? 'tabler:circle-check-filled' : transmitter.status === 'inactive' ? 'tabler:circle-x-filled' : 'tabler:help-circle-filled' }
            className={ `text-xl -ml-1 ${ transmitter.status === 'active' ? 'text-green-500' : transmitter.status === 'inactive' ? 'text-red-500' : 'text-gray-500' }` }
          />
          <span
            title={ transmitter.mode || 'UNKNOWN MODE' }
            className={'font-medium text-ellipsis overflow-hidden'}
          >
            { transmitter.mode || 'UNKNOWN MODE' }
          </span>
        </div>
        <div className={`flex justify-between items-center flex-wrap`}>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:antenna'} className={'text-base text-primary'}/>
            <span title={ '上行频率' }>{ transmitter.uplink_low || '--' }</span>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:satellite'} className={'text-base text-primary'}/>
            <span title={ '下行频率' }>{ transmitter.downlink_low || '--' }</span>
          </div>
        </div>
      </div>
    </div>
  )
}