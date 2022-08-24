import React, { ReactNode } from "react";
import './Wrapper.scss'

export const Wrapper = ({ children, leftContent, rightContent }: { children: ReactNode; leftContent?: ReactNode; rightContent?: ReactNode }) => {
  return (
    <div className="Wrapper">
      <div className="Wrapper__side">{leftContent}</div>
      <div className="Wrapper__main">
        {children}
      </div>
      <div className="Wrapper__side">{rightContent}</div>
    </div>
  )
}