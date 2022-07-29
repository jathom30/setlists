import React from "react";
import { HeaderBox, FlexBox, UserSelect, Button } from "components";
import { Link, useLocation } from "react-router-dom";
import './Header.scss'

export const Header = () => {
  const location = useLocation()
  const includesLocation = (path: string) => location.pathname.includes(path)
  return (
    <div className="Header">
      <HeaderBox>
        <FlexBox gap=".5rem" alignItems="center">
          <Link to="/">
            <Button isRounded kind={includesLocation('setlist') ? 'secondary' : 'text'}>Setlists</Button>
          </Link>
          <Link to="/songs">
            <Button isRounded kind={includesLocation('song') ? 'secondary' : 'text'}>Songs</Button>
          </Link>
        </FlexBox>
        <UserSelect />
      </HeaderBox>
    </div>
  )
}
