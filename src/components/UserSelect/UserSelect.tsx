import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare, faCopy, faEllipsisVertical, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "api";
import { CollapsingButton, Popover, FlexBox, Button, Label } from "components";
import { useGetBands, useOnClickOutside, useUser } from "hooks";
import { LOGOUT_QUERY, USER_QUERY } from "queryKeys";
import React, { useRef, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useNavigate } from "react-router-dom";
import './UserSelect.scss'

export const UserSelect = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { logoutUser, user } = useIdentityContext()
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  useOnClickOutside([buttonRef, contentRef], () => setIsOpen(false))

  const userQuery = useUser()

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY])
    }
  })

  const handleSelectCurrentBand = (bandId: string) => {
    updateUserMutation.mutate({
      id: userQuery.data?.id || '',
      user: {
        current_band_id: bandId
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
  const currentBandCode = userQuery.data?.current_band_id
  const isCurrentBand = (bandId: string) => currentBandCode === bandId
  const currentBand = bandsQuery.data?.find(band => band.id === currentBandCode)

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
                      icon={isCurrentBand(band.id) ? faCheckSquare : faSquare}
                      key={band.id}
                      kind="secondary"
                      onClick={() => handleSelectCurrentBand(band.id)}
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