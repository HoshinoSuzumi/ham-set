import {noto_sc} from '@/app/fonts'
import {ReactNode} from 'react'
import {Icon} from '@iconify-icon/react'

export const Panel = ({
  label,
  icon,
  children,
}: {
  label: string
  icon?: string
  children?: ReactNode
}) => {
  return (
    <>
      <div
        className={'w-[300px] px-2 py-1 bg-white rounded shadow-panel-card flex flex-col gap-2'}
      >
        <h2 className={`text-xs font-medium text-neutral-400 ${noto_sc.className}`}>
          {icon && (
            <>
              <Icon icon={icon} className={'text-sm'} inline/>
              &nbsp;
            </>
          )}
          <span>{label}</span>
        </h2>
        {children}
      </div>
    </>
  )
}