import React, {
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import './Popover.scss'
import { repositionPopover } from './repositionPopover'

export type Position = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'

type PopoverPropsType = {
  children: ReactElement
  content: ReactNode
  position?: Position[]
  align?: Align
  isOpen: boolean
}

export const Popover = ({
  children,
  content,
  position,
  align,
  isOpen,
}: PopoverPropsType) => {
  const triggerRef = useRef<HTMLElement | SVGElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const popoverBodyRef = useRef<HTMLDivElement>(null)

  const paddingInPixels = 2 // pixels
  const arrowSizeInRems = 0.5 // rems

  const defaultPositions: Position[] = ['top', 'left', 'right', 'bottom']

  const configuredPositions: Position[] = []

  let configAlign: Align = 'center'

  if (align) {
    configAlign = align
  }

  if (!position) {
    configuredPositions.push(...defaultPositions)
  } else {
    position.forEach((pos) => {
      configuredPositions.push(pos)
    })
  }

  const resizeObserver = new ResizeObserver(() => {
    repositionPopover(
      triggerRef.current,
      popoverRef.current,
      popoverBodyRef.current,
      paddingInPixels,
      arrowSizeInRems,
      configuredPositions,
      configAlign,
    )
  })

  const mutationObserverConfig = {
    attributes: true,
    childList: true,
    subtree: true,
  }
  const mutationObserverCallback = (mutationsList: MutationRecord[]) => {
    mutationsList.forEach((mutation) => {
      if (
        !(
          (mutation.target instanceof HTMLElement ||
            mutation.target instanceof SVGElement) &&
          (mutation.target.classList.contains('Popover') ||
            mutation.target.classList.contains('Popover__body'))
        )
      ) {
        repositionPopover(
          triggerRef.current,
          popoverRef.current,
          popoverBodyRef.current,
          paddingInPixels,
          arrowSizeInRems,
          configuredPositions,
          configAlign,
        )
      }
    })
  }
  const mutationObserver = new MutationObserver(mutationObserverCallback)

  useEffect(() => {
    const triggerNode = triggerRef.current
    const popoverNode = popoverRef.current
    const popoverBodyNode = popoverBodyRef.current

    const eventListenerCallback = () => {
      repositionPopover(
        triggerNode,
        popoverNode,
        popoverBodyNode,
        paddingInPixels,
        arrowSizeInRems,
        configuredPositions,
        configAlign,
      )
    }

    window.addEventListener('scroll', eventListenerCallback, true)
    window.addEventListener('resize', eventListenerCallback, true)
    mutationObserver.observe(document, mutationObserverConfig)
    if (triggerNode) resizeObserver.observe(triggerNode)
    if (popoverNode) resizeObserver.observe(popoverNode)

    return () => {
      window.removeEventListener('scroll', eventListenerCallback, true)
      window.removeEventListener('resize', eventListenerCallback, true)
      mutationObserver.disconnect()
      if (triggerNode) resizeObserver.unobserve(triggerNode)
      if (popoverNode) resizeObserver.unobserve(popoverNode)
    }
  })

  return (
    <>
      {cloneElement(children, { ref: triggerRef })}
      {isOpen
        ? createPortal(
            <div className="Popover" ref={popoverRef}>
              <div
                className="Popover__body"
                style={{ maxWidth: `calc(100vw - ${paddingInPixels * 2}px)` }}
                ref={popoverBodyRef}
              >
                {content}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
