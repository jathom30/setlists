import React, { ReactNode, useContext } from "react";
import { FlexBox } from "components";
import { Link } from "react-router-dom";
import './Breadcrumbs.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { WindowDimsContext } from "context";

export const Breadcrumbs = ({currentRoute}: {currentRoute?: ReactNode}) => {
  const {isMobileWidth} = useContext(WindowDimsContext)
  return (
    <div className="Breadcrumbs">
      <FlexBox gap=".5rem" alignItems="center">
        <Link to="/setlists" className={`Breadcrumbs__crumb ${currentRoute ? 'Breadcrumbs__crumb--not-active': ''}`}>
          {isMobileWidth ? (
            <FontAwesomeIcon icon={faFolder} />
          ) : (
            <span className="Breadcrumbs__back">
              Your setlists
            </span>
          )}
        </Link>
        {currentRoute && (
          <>
            <span className="Breadcrumbs__back--desktop">{'/'}</span>
            {currentRoute}
          </>
        )}
      </FlexBox>
    </div>
  )
}