import React from "react";
import { HeaderBox, FlexBox, UserSelect } from "components";
import { Link } from "react-router-dom";
import './Header.scss'

export const Header = () => {
  return (
    <div className="Header">
      <HeaderBox>
        <FlexBox gap=".5rem" alignItems="center">
          <Link to="/">Setlists</Link>
          <Link to="/songs">Songs</Link>
        </FlexBox>
        <UserSelect />
      </HeaderBox>
    </div>
  )
}
