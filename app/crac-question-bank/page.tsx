import Main from '@/app/crac-question-bank/Main';
import {Metadata} from "next";

export const metadata: Metadata = {
  title: '操作证书试题库',
  description: '中国业余无线电操作证书考试试题库',
}

export default function Page() {
  return <Main/>
}