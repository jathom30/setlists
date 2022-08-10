import React, { ReactNode, useContext } from "react";
import { WindowDimsContext } from "context";
import './ViewWrapper.scss'

export const ViewWrapper = ({ children, left, right }: { children: ReactNode; left?: ReactNode; right?: ReactNode }) => {
  const { twoCols, singleCol } = useContext(WindowDimsContext)


  return (
    <div className="ViewWrapper">
      <div className="ViewWrapper__left-side">
        {!(twoCols || singleCol) && left}
      </div>
      <div className="ViewWrapper__main">
        {children}
      </div>
      <div className="ViewWrapper__right-side">
        {twoCols ? (
          <>
            {left}
            {right}
          </>
        ) : right}
      </div>
    </div>
  )
}