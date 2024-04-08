import {Transponder} from '@/app/satellites/page'
import {Icon} from '@iconify-icon/react'
import {rubik} from '@/app/fonts'

export const TransponderCard = ({
  transponder,
}: {
  transponder: Transponder
}) => {
  return (
    <div
      className={`w-full px-3 py-2 bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded ${rubik.className}`}>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-center gap-0.5 text-nowrap'}>
          <Icon
            title={transponder.status}
            icon={transponder.status === 'active' ? 'tabler:circle-check-filled' : transponder.status === 'inactive' ? 'tabler:circle-x-filled' : 'tabler:help-circle-filled'}
            className={`text-xl -ml-1 ${transponder.status === 'active' ? 'text-green-500' : transponder.status === 'inactive' ? 'text-red-500' : 'text-gray-500'}`}
          />
          <span
            title={transponder.mode}
            className={'font-medium text-ellipsis overflow-hidden'}
          >
            {transponder.mode || 'UNKNOWN MODE'}
          </span>
        </div>
        {transponder.callsign || transponder.beacon && (
          <div className={`flex justify-between items-center flex-wrap`}>
            {transponder.callsign && (
              <div className={'flex items-center gap-1'}>
                <Icon icon={'tabler:id'} className={'text-base text-primary'}/>
                <span title={'呼号'}>{transponder.callsign}</span>
              </div>
            )}
            {transponder.beacon && (
              <div className={'flex items-center gap-1'}>
                <Icon icon={'tabler:radar-2'} className={'text-base text-primary'}/>
                <span title={'信标'}>{transponder.beacon}</span>
              </div>
            )}
          </div>
        )}
        <div className={`flex justify-between items-center flex-wrap`}>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:antenna'} className={'text-base text-primary'}/>
            <span title={'上行频率'}>{transponder.uplink || '--'}</span>
          </div>
          <div className={'flex items-center gap-1'}>
            <Icon icon={'tabler:satellite'} className={'text-base text-primary'}/>
            <span title={'下行频率'}>{transponder.downlink || '--'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}