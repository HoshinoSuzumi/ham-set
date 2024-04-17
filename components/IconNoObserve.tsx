import { Icon } from '@iconify-icon/react'

export default function IconNoObserve({
  icon,
  ...props
}: {
  icon: string;
  [key: string]: any;
}) {
  return (
    <Icon
      icon={ icon }
      noobserver
      { ...props }
    />
  )
}