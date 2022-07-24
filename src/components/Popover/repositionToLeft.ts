import { Align } from './Popover'
import { placePopover, resetBody } from './helpers'

export const repositionToLeft = (
  popoverNode: HTMLDivElement,
  popoverBodyNode: HTMLDivElement,
  paddingInPixels: number,
  arrowSizeInPixels: number,
  trigRect: DOMRect,
  tipRect: DOMRect,
  align: Align,
) => {
  const popoverBody = popoverBodyNode
  const popover = popoverNode
  // position the popover

  let initialTop = 0
  if (align === 'start') {
    initialTop = Math.round(trigRect.y)
  } else if (align === 'end') {
    initialTop = Math.round(trigRect.y + trigRect.height - tipRect.height)
  }

  const newTip = {
    top:
      align === 'center'
        ? Math.round(trigRect.y + trigRect.height / 2 - tipRect.height / 2)
        : initialTop,
    left: Math.round(trigRect.x - tipRect.width - arrowSizeInPixels),
  }

  // offset the popover body
  if (popoverBody) {
    const tooFarTop = newTip.top < paddingInPixels

    const tooFarBottom = tipRect.bottom > window.innerHeight - paddingInPixels

    const bottomDifference = `${
      tipRect.top + tipRect.height - window.innerHeight
    }px`
    if (tooFarTop) {
      popoverBody.style.bottom = ''
      popoverBody.style.top = `${Math.abs(newTip.top) + paddingInPixels}px`
    } else if (tooFarBottom) {
      popoverBody.style.top = ''
      popoverBody.style.bottom = bottomDifference
    } else {
      resetBody(popoverBody)
    }

    placePopover(popover, newTip)
  }
}
