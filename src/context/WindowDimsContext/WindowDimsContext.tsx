import { createContext, ReactNode, useLayoutEffect, useState } from "react";

type WindowDims = {
  width: number
  height: number
  twoCols: boolean
  singleCol: boolean
  isMobileWidth: boolean
}

const defaultValues = {
  width: 0,
  height: 0,
  twoCols: false,
  singleCol: false,
  isMobileWidth: true
}

export const WindowDimsContext = createContext<WindowDims>(defaultValues)

export const WindowDimsContextProvider = ({ children }: { children: ReactNode }) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const twoCols = width <= 1400
  const singleCol = width <= 800
  const isMobileWidth = width < 650

  const value = {
    width,
    height,
    twoCols,
    singleCol,
    isMobileWidth
  }

  return (
    <WindowDimsContext.Provider value={value}>
      {children}
    </WindowDimsContext.Provider>
  )
}