import React, { Fragment, ReactNode } from "react";
import { FlexBox } from "components";
import { Link, useLocation } from "react-router-dom";
import './Breadcrumbs.scss'

export type Breadcrumb = {
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
            return <h3 key={crumb.to}>{crumb.label}</h3>
          }
          return(
            <Fragment key={crumb.to}>
              <Link to={crumb.to}>
                <h3 className="Breadcrumbs__crumb">
                  {crumb.label}
                </h3>
              </Link>
              {'/'}
            </Fragment>
        )})}
      </FlexBox>
    </div>
  )
}

// TODO mobile breadcrumbs