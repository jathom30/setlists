import { Box } from "components/Box";
import React, { ReactNode } from "react";
import './Group.scss'

export const Group = ({children, padding}: {children: ReactNode; padding?: string}) => {
  return (
    <div className="Group">
      <Box padding={padding}>
        {children}
      </Box>
    </div>
  )
}