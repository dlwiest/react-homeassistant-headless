import { useCallback } from 'react'
import { useEntity } from './useEntity'
import type { BaseEntityHook } from '../types'
import { createDomainValidator } from '../utils/entityId'

const validateCoverEntityId = createDomainValidator('cover', 'useCover')

export interface CoverState extends BaseEntityHook {
  isOpen: boolean
  isClosed: boolean
  isOpening: boolean
  isClosing: boolean
  position?: number
  open: () => Promise<void>
  close: () => Promise<void>
  stop: () => Promise<void>
  setPosition: (position: number) => Promise<void>
}

export function useCover(entityId: string): CoverState {
  const normalizedEntityId = validateCoverEntityId(entityId)
  const entity = useEntity(normalizedEntityId)
  const { state, attributes, callService } = entity

  const isOpen = state === 'open'
  const isClosed = state === 'closed'
  const isOpening = state === 'opening'
  const isClosing = state === 'closing'

  const open = useCallback(async () => {
    await callService('cover', 'open_cover')
  }, [callService])

  const close = useCallback(async () => {
    await callService('cover', 'close_cover')
  }, [callService])

  const stop = useCallback(async () => {
    await callService('cover', 'stop_cover')
  }, [callService])

  const setPosition = useCallback(
    async (position: number) => {
      await callService('cover', 'set_cover_position', { position })
    },
    [callService]
  )

  return {
    ...entity,
    isOpen,
    isClosed,
    isOpening,
    isClosing,
    position: typeof attributes.current_position === 'number' ? attributes.current_position : undefined,
    open,
    close,
    stop,
    setPosition,
  }
}
