import { SVGProps } from 'react'

export function TablerClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"></path>
        <path d="M12 7v5l3 3"></path>
      </g>
    </svg>
  )
}