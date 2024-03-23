export interface BaseResponse<T> {
  code: number
  message: string
  data: T | null
}

export type ExamLevel = 'A' | 'B' | 'C' | 'FULL'

export interface ExamQuestion {
  id: string
  question: string
  answerHash: string
  answerIndex: number
  picture: string | null
  options: string[]
  includeIn: Exclude<ExamLevel, 'FULL'>[]
}

export interface ExamBankResponse {
  level: ExamLevel
  questions: ExamQuestion[]
}
