'use client';
import {SWRConfig} from 'swr'
import {ReactNode} from 'react';

export const SWRProvider = ({
  children,
}: {
  children: ReactNode,
}) => {
  return <SWRConfig value={{
    fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
  }}>{children}</SWRConfig>
};