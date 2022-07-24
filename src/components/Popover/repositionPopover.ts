// import { logOverflow } from './logOverflow'
import { repositionToTop } from './repositionToTop'
import { repositionToBottom } from './repositionToBottom'
import { repositionToLeft } from './repositionToLeft'
import { repositionToRight } from './repositionToRight'
import { Position, Align } from './Popover'

export const repositionPopover = (
  triggerNode: HTMLElement | SVGElement | null,
  popoverNode: HTMLDivElement | null,
  popoverBodyNode: HTMLDivElement | null,
  paddingInPixels: number,
  arrowSizeInRems: number,
  positionPriority: Position[],
  align: Align,
) => {
  // console.log('resizing')
  if (triggerNode && popoverNode && popoverBodyNode) {
    const trigRect = triggerNode.getBoundingClientRect()
    const tipRect = popoverNode.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const arrowSizeInPixels =
      arrowSizeInRems *
      parseFloat(getComputedStyle(document.documentElement).fontSize)

    const heightOfTipPlusArrow = tipRect.height + arrowSizeInPixels
    const widthOfTipPlusArrow = tipRect.width + arrowSizeInPixels

    const spaceAboveTrigger = Math.floor(trigRect.top - paddingInPixels)
    const spaceBelowTrigger = Math.floor(
      viewport.height - trigRect.bottom - paddingInPixels - arrowSizeInPixels,
    )
    const spaceLeftOfTrigger = Math.floor(trigRect.left - paddingInPixels)
    const spaceRightOfTrigger = Math.floor(
      viewport.width - trigRect.right - paddingInPixels - arrowSizeInPixels,
    )

    const willFitTop = heightOfTipPlusArrow < spaceAboveTrigger
    const willFitBottom = heightOfTipPlusArrow < spaceBelowTrigger
    const willFitLeft = widthOfTipPlusArrow < spaceLeftOfTrigger
    const willFitRight = widthOfTipPlusArrow < spaceRightOfTrigger

    for (let i = 0; i < positionPriority.length; i += 1) {
      if (positionPriority[i] === 'top' && willFitTop) {
        repositionToTop(
          popoverNode,
          popoverBodyNode,
          paddingInPixels,
          arrowSizeInPixels,
          trigRect,
          tipRect,
          align,
        )
        break
      } else if (positionPriority[i] === 'bottom' && willFitBottom) {
        repositionToBottom(
          popoverNode,
          popoverBodyNode,
          paddingInPixels,
          arrowSizeInPixels,
          trigRect,
          tipRect,
          align,
        )
        break
      } else if (positionPriority[i] === 'left' && willFitLeft) {
        repositionToLeft(
          popoverNode,
          popoverBodyNode,
          paddingInPixels,
          arrowSizeInPixels,
          trigRect,
          tipRect,
          align,
        )
        break
      } else if (positionPriority[i] === 'right' && willFitRight) {
        repositionToRight(
          popoverNode,
          popoverBodyNode,
          paddingInPixels,
          arrowSizeInPixels,
          trigRect,
          tipRect,
          align,
        )
        break
      } else {
        repositionToTop(
          popoverNode,
          popoverBodyNode,
          paddingInPixels,
          arrowSizeInPixels,
          trigRect,
          tipRect,
          align,
        )
      }
    }
  }
}
