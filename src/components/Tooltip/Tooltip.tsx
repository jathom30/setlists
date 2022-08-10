import { Popover } from "components/Popover";
import React, { ReactNode, useState } from "react";
import './Tooltip.scss'

export const Tooltip = ({ children, content }: { children: ReactNode; content: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="Tooltip">
      <Popover
        isOpen={isOpen}
        content={content}
      >
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {children}
        </div>
      </Popover>
    </div>
  )
}

export const TooltipContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="TooltipContent">
      {children}
    </div>
  )
}