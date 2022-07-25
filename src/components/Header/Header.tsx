import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { HeaderBox, FlexBox, Button } from "components";
import { WindowDimsContext } from "context";
import React, { useContext, useEffect } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useNavigate } from "react-router-dom";
import './Header.scss'

export const Header = () => {
  const { logoutUser, user } = useIdentityContext()
  const {isMobileWidth} = useContext(WindowDimsContext)
  const navigate = useNavigate()

  const logoutUserQuery = useQuery(
    ['logout', user?.email],
    logoutUser,
    {
      enabled: false,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSettled: () => {
        navigate('/')
      }
    }
  )

  return (
    <div className="Header">
      <HeaderBox>
        <Link to="/">Home</Link>
        <FlexBox gap=".5rem" alignItems="center">
          <Link to="/user-settings">User</Link>
          <Button icon={faSignOut} isRounded onClick={() => logoutUserQuery.refetch()}>{isMobileWidth ? '' : 'Sign out'}</Button>
        </FlexBox>
      </HeaderBox>
    </div>
  )
}
