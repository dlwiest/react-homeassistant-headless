import { ReactNode } from 'react'
import { useCover } from '../hooks/useCover'
import type { CoverState } from '../hooks/useCover'

interface CoverProps {
  entityId: string
  children: (cover: CoverState) => ReactNode
}

export const Cover = ({ entityId, children }: CoverProps) => {
  const cover = useCover(entityId)
  return <>{children(cover)}</>
}