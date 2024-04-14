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
      <div className={ 'flex flex-col gap-2' }>
        <div className={ 'flex items-center gap-0.5 text-nowrap' }>
          <Icon
            title={ transmitter.status }
            icon={ transmitter.status === 'active' ? 'tabler:circle-check-filled' : transmitter.status === 'inactive' ? 'tabler:circle-x-filled' : 'tabler:help-circle-filled' }
            className={ `text-xl -ml-1 ${ transmitter.status === 'active' ? 'text-green-500' : transmitter.status === 'inactive' ? 'text-red-500' : 'text-gray-500' }` }
          />
          <span
            title={ transmitter.description || 'Transponder' }
            className={ 'font-medium text-ellipsis overflow-hidden' }
          >
            { transmitter.description || 'Transponder' }
          </span>
        </div>
        <div className={ 'flex items-center gap-0.5 text-nowrap opacity-80' }>
          <Icon
            title={ '调制模式' }
            icon={ 'tabler:radio' }
            className={ `text-lg -ml-0.5 -mt-0.5` }
          />
          <span
            title={ transmitter.mode || 'Unknown mode' }
            className={ 'font-medium text-ellipsis overflow-hidden' }
          >
            { transmitter.mode || 'Unknown mode' }
          </span>
        </div>
        <div className={ `flex justify-between items-center flex-wrap` }>
          <div className={ 'flex items-center gap-1' }>
            <Icon icon={ 'tabler:antenna' } className={ 'text-base text-primary' }/>
            <span
              title={ '上行频率' }>{ transmitter.uplink_low ? `${ transmitter.uplink_low / 1000000 } MHz` : '--' }</span>
          </div>
          <div className={ 'flex items-center gap-1' }>
            <Icon icon={ 'tabler:satellite' } className={ 'text-base text-primary' }/>
            <span
              title={ '下行频率' }>{ transmitter.downlink_low ? `${ transmitter.downlink_low / 1000000 } MHz` : '--' }</span>
          </div>
        </div>
      </div>
    </div>
  )
}