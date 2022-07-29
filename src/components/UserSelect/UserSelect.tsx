import { faCheckSquare, faCopy, faEllipsisVertical, faSignOut, faSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CollapsingButton, Popover, FlexBox, Button, Label } from "components";
import { useGetBands, useOnClickOutside } from "hooks";
import { LOGOUT_QUERY } from "queryKeys";
import React, { useRef, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useNavigate } from "react-router-dom";
import './UserSelect.scss'

export const UserSelect = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { logoutUser, user, updateUser } = useIdentityContext()
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([buttonRef, contentRef], () => setIsOpen(false))

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  const handleSelectCurrentBand = (bandCode: string) => {
    updateUserMutation.mutate({ data: {
      currentBand: bandCode
    }})
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

  const hasBands = user?.user_metadata.bandCode?.length > 0
  
  const bandsQuery = useGetBands()
  const currentBandCode: string | undefined = user?.user_metadata.currentBand
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
                    <span>{user?.user_metadata.firstName} {user?.user_metadata.lastName}</span>
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
              {hasBands && (
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
              )}
              <Button icon={faSignOut} onClick={() => logoutUserQuery.refetch()}>Log out</Button>
            </FlexBox>
          </div>
        }
      >
        <div ref={buttonRef}>
          <CollapsingButton
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