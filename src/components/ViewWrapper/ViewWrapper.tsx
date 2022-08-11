import React, { ReactNode } from "react";
import './ViewWrapper.scss'

export const ViewWrapper = ({ children, right }: { children: ReactNode; right?: ReactNode }) => {


  return (
    <div className="ViewWrapper">
      <div className="ViewWrapper__main">
        {children}
      </div>
      <div className="ViewWrapper__side">
        {right}
      </div>
    </div>
  )
}