import React from "react";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { HeaderBox, FlexBox, CollapsingButton } from "components";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useNavigate } from "react-router-dom";
import './Header.scss'

export const Header = () => {
  const { logoutUser, user } = useIdentityContext()
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
        <FlexBox gap=".5rem" alignItems="center">
          <Link to="/">Setlists</Link>
          <Link to="/songs">Songs</Link>
        </FlexBox>
        <FlexBox gap=".5rem" alignItems="center">
          <Link to="/user-settings">User</Link>
          <CollapsingButton icon={faSignOut} onClick={() => logoutUserQuery.refetch()} label="Sign out" />
        </FlexBox>
      </HeaderBox>
    </div>
  )
}
