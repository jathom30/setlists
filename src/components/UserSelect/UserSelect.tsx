import { faCheckSquare, faCopy, faEllipsisVertical, faSignOut, faSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser, updateUser } from "api";
import { CollapsingButton, Popover, FlexBox, Button, Label } from "components";
import { useGetBands, useOnClickOutside } from "hooks";
import { LOGOUT_QUERY, USER_QUERY } from "queryKeys";
import React, { useRef, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useNavigate } from "react-router-dom";
import { User } from "typings";
import './UserSelect.scss'

export const UserSelect = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { logoutUser, user } = useIdentityContext()
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([buttonRef, contentRef], () => setIsOpen(false))

  const userQuery = useQuery([USER_QUERY, user?.id], async () => {
    const response = await getUser(user?.id || '')
    return response[0].fields as User
  }, {
    enabled: !!user?.id,
  })

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  const handleSelectCurrentBand = (bandCode: string) => {
    updateUserMutation.mutate({
      id: userQuery.data?.id || '',
      user: {
        current_band_code: bandCode
      }
    })
  }

  const logoutUserQuery = useQuery(
    [LOGOUT_QUERY, user?.email],
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

  const bandsQuery = useGetBands()
  const currentBandCode = userQuery.data?.current_band_code
  const isCurrentBand = (bandCode: string) => currentBandCode === bandCode
  const currentBand = bandsQuery.data?.find(band => band.band_code === currentBandCode)

  const handleCopyBandCode = () => {
    navigator.clipboard.writeText(currentBand?.band_code || '')
  }

  return (
    <div className="UserSelect">
      <Popover
        align="end"
        position={['bottom']}
        isOpen={isOpen}
        content={
          <div className="UserSelect__content" ref={contentRef}>
            <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
              {currentBand && (
                <div className="UserSelect__bands">
                  <FlexBox flexDirection="column" alignItems="center">
                    <span>{userQuery.data?.first_name} {userQuery.data?.last_name}</span>
                    <h3>{currentBand.name}</h3>
                    <Button onClick={handleCopyBandCode} icon={faCopy} isRounded kind="secondary">{currentBand.band_code}</Button>
                  </FlexBox>
                  <Link to="/user-settings" onClick={() => setIsOpen(false)}>
                    <FlexBox flexDirection="column">
                      <Button kind="text" icon={faUser}>User Settings</Button>
                    </FlexBox>
                  </Link>
                </div>
              )}
              <div className="UserSelect__bands">
                <FlexBox flexDirection="column" gap=".5rem">
                  <Label>Bands</Label>
                  {bandsQuery.data?.map(band => (
                    <Button
                      justifyContent="flex-start"
                      icon={isCurrentBand(band.band_code) ? faCheckSquare : faSquare}
                      key={band.id}
                      kind="secondary"
                      onClick={() => handleSelectCurrentBand(band.band_code)}
                      isLoading={updateUserMutation.isLoading}
                    >
                      {band.name}
                    </Button>
                  ))}
                </FlexBox>
              </div>
              <Button icon={faSignOut} onClick={() => logoutUserQuery.refetch()}>Log out</Button>
            </FlexBox>
          </div>
        }
      >
        <div>
          <CollapsingButton
            buttonRef={buttonRef}
            icon={faEllipsisVertical}
            onClick={() => setIsOpen(!isOpen)}
            label="Settings"
            kind="secondary"
          />
        </div>
      </Popover>
    </div>
  )
}