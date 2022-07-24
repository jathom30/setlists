import { Align } from './Popover'
import { placePopover, resetBody } from './helpers'

export const repositionToTop = (
  popoverNode: HTMLDivElement,
  popoverBodyNode: HTMLDivElement,
  paddingInPixels: number,
  arrowSizeInPixels: number,
  trigRect: DOMRect,
  tipRect: DOMRect,
  align: Align,
) => {
  const popover = popoverNode
  const popoverBody = popoverBodyNode
  // position the popover
  let initialLeft = 0
  if (align === 'start') {
    initialLeft = Math.round(trigRect.x)
  } else if (align === 'end') {
    initialLeft = Math.round(trigRect.x + trigRect.width - tipRect.width)
  }

  const newTip = {
    top: Math.round(trigRect.y - tipRect.height) - arrowSizeInPixels,
    left:
      align === 'center'
        ? Math.round(trigRect.x + trigRect.width / 2 - tipRect.width / 2)
        : initialLeft,
  }

  // offset the popover body
  if (popoverBody) {
    const tooFarLeft = newTip.left < paddingInPixels
    const tooFarRight =
      trigRect.left + trigRect.width / 2 + tipRect.width / 2 >
      window.innerWidth - paddingInPixels

    if (tooFarLeft) {
      popoverBody.style.right = ''
      popoverBody.style.left = `${Math.abs(newTip.left) + paddingInPixels}px`
    } else if (tooFarRight) {
      popoverBody.style.left = ''
      const amountOfRightsideOverflow = Math.ceil(
        Math.abs(trigRect.left) +
          trigRect.width / 2 +
          tipRect.width / 2 -
          window.innerWidth,
      )
      popoverBody.style.left = `${
        -amountOfRightsideOverflow - paddingInPixels
      }px`
    } else {
      resetBody(popoverBody)
    }
    placePopover(popover, newTip)
  }
}
