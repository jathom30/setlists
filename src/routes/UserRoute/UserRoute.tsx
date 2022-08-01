import React, { MouseEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddBand, Breadcrumbs, Button, CollapsingButton, FlexBox, HeaderBox, Input, Loader, MaxHeightContainer, Modal, PasswordStrength } from "components";
import { faCircleDot, faEllipsisVertical, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useGetBands, useUser } from "hooks";
import { useIdentityContext } from "react-netlify-identity";
import { passwordStrength } from "utils";
import { updateUser } from "api";
import { Band } from "typings";
import './UserRoute.scss'
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { USER_QUERY } from "queryKeys";

export const UserRoute = () => {
  const {updateUser: updateIdentityUser} = useIdentityContext()

  const userQuery = useUser()
  
  const getBandsQuery = useGetBands()

  const [firstName, setFirstName] = useState(userQuery.data?.first_name|| '')
  const [lastName, setLastName] = useState(userQuery.data?.last_name|| '')
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const [showNewBand, setShowNewBand] = useState(false)
  const queryClient = useQueryClient()



  const updateIdentityUserMutation = useMutation(updateIdentityUser)
  
  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY])
    }
  })
  
  const handleUpdateMetadata = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    updateUserMutation.mutate({
      id: userQuery.data?.id || '',
      user: {
        first_name: firstName,
        last_name: lastName,
      }
    })
  }

  const handlePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (password === verifyPassword) {
      updateIdentityUserMutation.mutate({ password })
    }
  }

  const handleSelectCurrentBand = (bandId: string) => {
    updateUserMutation.mutate({
      id: userQuery.data?.id || '',
      user: {
        current_band_id: bandId
      }
    })
  }

  const currentBand = userQuery.data?.current_band_id
  const isEnabledPassword = !!password && (password === verifyPassword) && passwordStrength(password) > 0

  return (
    <div className="UserRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox flexDirection="column" gap="1rem" padding="1rem">
            <Breadcrumbs
              crumbs={[{
                to: '/user-settings',
                label: 'User Settings'
              }]}
            />
          </FlexBox>
        }
      >
        <FlexBox flexDirection="column" gap="2rem" padding="1rem">
          <form action="submit">
            <FlexBox flexDirection="column" gap="1rem">
              <h3>Update User Info</h3>
              <Input label="First name" value={firstName} onChange={setFirstName} name="first-name" />
              <Input label="Last name" value={lastName} onChange={setLastName} name="last-name" />
              <Button type="submit" kind="primary" onClick={handleUpdateMetadata}>
                {updateUserMutation.isLoading ? <Loader /> : 'Save'}
              </Button>
            </FlexBox>
          </form>
          
          <form action="submit">
            <FlexBox flexDirection="column" gap="1rem">
              <h3>Update Password</h3>
              <FlexBox flexDirection="column" gap="0.5rem">
                <Input type="password" label="Password" value={password} onChange={setPassword} name="password" />
                <PasswordStrength password={password} />
              </FlexBox>
              <Input type="password" label="Verify Password" value={verifyPassword} onChange={setVerifyPassword} name="verify-password" />
              <Button type="submit" kind="primary" onClick={handlePassword} isDisabled={!isEnabledPassword || updateUserMutation.isLoading}>
                {updateUserMutation.isLoading ? <Loader /> : 'Update password'}
              </Button>
            </FlexBox>
          </form>
          <p style={{display: "none"}}>
            <label>
              Don’t fill this out if you’re human: <input name="bot-field" />
            </label>
          </p>

          <form action="submit">
            <FlexBox flexDirection="column" gap="1rem">
              <FlexBox alignItems="center" justifyContent="space-between" gap="1rem">
                <h3>Associated Bands</h3>
                <CollapsingButton icon={faPlus} kind="primary" onClick={() => setShowNewBand(true)} label="Add Band" />
              </FlexBox>
              {getBandsQuery.data?.map(band => (
                <BandTile key={band.id} band={band} currentBand={currentBand || ''} onChange={handleSelectCurrentBand} />
              ))}
            </FlexBox>
          </form>
        </FlexBox>
      </MaxHeightContainer>
      {showNewBand && (
        <Modal offClick={() => setShowNewBand(false)}>
          <div className="UserRoute__modal">
            <FlexBox padding="1rem" justifyContent="space-between">
              <h3>New band</h3>
              <Button onClick={() => setShowNewBand(false)} isRounded icon={faTimes} />
            </FlexBox>
            {/* // TODO  this could be handled better */}
            <AddBand
              onSuccess={() => {setShowNewBand(false)}}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

const BandTile = ({band, currentBand, onChange}: {band: Band; currentBand: string; onChange: (bandCode: string) => void}) => {
  return (
    <div className="BandTile">
      <HeaderBox>
        <FlexBox gap="1rem" alignItems="center">
          <Button
            kind="secondary"
            isRounded
            onClick={() => onChange(band.id)}
            icon={currentBand === band.id ? faCircleDot : faCircle}
          >
            {band.name}
          </Button>
        </FlexBox>
        <Link to={`/band-settings/${band.id}`}>
          <Button kind="secondary" icon={faEllipsisVertical}>Details</Button>
        </Link>
      </HeaderBox>
    </div>
  )
}