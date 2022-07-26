import React, { ReactNode } from "react";
import './RouteWrapper.scss'

export const RouteWrapper = ({children}: {children: ReactNode}) => {
  return (
    <div className="RouteWrapper">
      {children}
    </div>
  )
}