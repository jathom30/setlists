import React, { ReactNode } from "react";
import { FlexBox } from "components";
import { Link, useLocation } from "react-router-dom";
import './Breadcrumbs.scss'

type Breadcrumb = {
  to: string
  label: string
}

export const Breadcrumbs = ({crumbs, currentRoute}: {crumbs?: Breadcrumb[]; currentRoute?: ReactNode}) => {
  const location = useLocation()

  const isCurrentRoute = (to: string) => location.pathname === to
  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        {crumbs?.map(crumb => {
          if (isCurrentRoute(crumb.to)) {
            return <h1>{crumb.label}</h1>
          }
          return(
            <>
              <Link key={crumb.to} to={crumb.to}>
                <h1 className="Breadcrumbs__crumb">
                  {crumb.label}
                </h1>
              </Link>
              {'/'}
            </>
        )})}
      </FlexBox>
    </div>
  )
}