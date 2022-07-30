import React, { Fragment, useContext } from "react";
import { FlexBox } from "components";
import { Link, useLocation } from "react-router-dom";
import './Breadcrumbs.scss'
import { WindowDimsContext } from "context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export type Breadcrumb = {
  to: string
  label: string
}

export const Breadcrumbs = ({crumbs}: {crumbs: Breadcrumb[];}) => {
  const location = useLocation()
  const {isMobileWidth} = useContext(WindowDimsContext)

  const secondToLastCrumb = crumbs[crumbs.length - 2]
  const mobileCrumbs = [
    ...(secondToLastCrumb ? [secondToLastCrumb] : []),
    crumbs[crumbs.length - 1]
  ]

  const responsiveCrumbs = isMobileWidth ? mobileCrumbs : crumbs

  const isCurrentRoute = (to: string) => location.pathname === to
  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        {responsiveCrumbs?.map(crumb => {
          if (isCurrentRoute(crumb.to)) {
            return <h2 key={crumb.to}>{crumb.label}</h2>
          }
          return(
            <Fragment key={crumb.to}>
              <Link to={crumb.to}>
                <h2 className="Breadcrumbs__crumb">
                  {isMobileWidth ? (<FontAwesomeIcon icon={faChevronLeft} />) : crumb.label}
                </h2>
              </Link>
              {!isMobileWidth && '/'}
            </Fragment>
        )})}
      </FlexBox>
    </div>
  )
}
