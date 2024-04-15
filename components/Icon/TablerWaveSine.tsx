import { SVGProps } from 'react'

export function TablerWaveSine(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }>
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12h-2c-.894 0-1.662-.857-1.761-2c-.296-3.45-.749-6-2.749-6s-2.5 3.582-2.5 8s-.5 8-2.5 8s-2.452-2.547-2.749-6c-.1-1.147-.867-2-1.763-2h-2"></path>
    </svg>
  )
}