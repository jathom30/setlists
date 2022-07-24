import { Align } from './Popover'
import { placePopover, resetBody } from './helpers'

export const repositionToBottom = (
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
  let initialLeft = 0
  if (align === 'start') {
    initialLeft = Math.round(trigRect.x)
  } else if (align === 'end') {
    initialLeft = Math.round(trigRect.x + trigRect.width - tipRect.width)
  }

  const newTip = {
    top: Math.round(trigRect.y + trigRect.height + arrowSizeInPixels),
    left:
      align === 'center'
        ? Math.round(trigRect.x + trigRect.width / 2 - tipRect.width / 2)
        : initialLeft,
  }

  // offset the popover body
  if (popoverBody) {
    const tooFarLeft = newTip.left < paddingInPixels
    const tooFarRight =
      newTip.left + tipRect.width > window.innerWidth - paddingInPixels

    if (tooFarLeft) {
      popoverBody.style.right = ''
      popoverBody.style.left = `${Math.abs(newTip.left) + paddingInPixels}px`
    } else if (tooFarRight) {
      popoverBody.style.left = ''
      let amountOfRightsideOverflow = 0
      if (align === 'center') {
        amountOfRightsideOverflow = Math.ceil(
          Math.abs(trigRect.x) +
            trigRect.width / 2 +
            tipRect.width / 2 -
            window.innerWidth,
        )
      } else if (align === 'start') {
        amountOfRightsideOverflow = Math.ceil(
          Math.abs(newTip.left + tipRect.width) - window.innerWidth,
        )
      } else if (align === 'end') {
        amountOfRightsideOverflow = Math.ceil(
          newTip.left + tipRect.width - window.innerWidth,
        )
      }

      popoverBody.style.left = `${
        -amountOfRightsideOverflow - paddingInPixels
      }px`
    } else {
      resetBody(popoverBody)
    }
    placePopover(popover, newTip)
  }
}
