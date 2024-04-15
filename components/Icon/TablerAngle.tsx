import { SVGProps } from 'react'

export function TablerAngle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 19H3l9-15m8.615 11.171h.015m-1.115-3.4h.015m-1.815-3.1h.015m-2.315-2.7h.015"></path>
    </svg>
  )
}