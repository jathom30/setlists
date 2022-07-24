type Tip = {
  top: number
  left: number
}

export const resetBody = (popoverBodyNode: HTMLDivElement) => {
  const popoverBody = popoverBodyNode
  popoverBody.style.right = ''
  popoverBody.style.left = ''
  popoverBody.style.top = ''
  popoverBody.style.bottom = ''
}

export const placePopover = (popoverNode: HTMLDivElement, tip: Tip) => {
  const popover = popoverNode
  popover.style.top = `${tip.top}px`
  popover.style.left = `${tip.left}px`
}
