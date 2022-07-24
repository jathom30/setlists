import React, { MouseEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AddBand, Button, DeleteWarning, FlexBox, Input, LabelInput, Loader, Modal, PasswordStrength } from "components";
import { faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useGetBands } from "hooks";
import { useIdentityContext } from "react-netlify-identity";
import { passwordStrength } from "utils";
import { updateBand } from "api";
import { Band } from "typings";
import './UserRoute.scss'

export const UserRoute = () => {
  const {user, updateUser} = useIdentityContext()
  
  const getBandsQuery = useGetBands()

  const [firstName, setFirstName] = useState(user?.user_metadata.firstName)
  const [lastName, setLastName] = useState(user?.user_metadata.lastName)
  const [password, setPassword] = useState('')
  const [verifyPassword, setVerifyPassword] = useState('')

  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [showNewBand, setShowNewBand] = useState(false)



  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      window.location.reload()
    }
  })
  
  const updateBandMutation = useMutation(updateBand, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  const handleUpdateMetadata = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    updateUserMutation.mutate({data: {
      firstName, lastName
    }})
  }

  const handlePassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (password === verifyPassword) {
      updateUserMutation.mutate({ password })
    }
  }

  const handleDeleteBand = (bandCode: string) => {
    const bandCodes: string[] = user?.user_metadata.bandCode
    const filteredBandCodes = bandCodes.filter(code => code !== bandCode)
    updateUserMutation.mutate({data: {
      bandCode: filteredBandCodes,
      currentBand: filteredBandCodes[0]
    }})
  }

  const handleUpdateBand = (newName: string | number, band: Band) => {
    if (typeof newName !== 'string') { return }
    updateBandMutation.mutate({
      ...band,
      name: newName
    })
  }

  const isEnabledPassword = !!password && (password === verifyPassword) && passwordStrength(password) > 0

  return (
    <div className="UserRoute">
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
              <Button icon={faPlus} kind="primary" isRounded onClick={() => setShowNewBand(true)} />
            </FlexBox>
            {getBandsQuery.data?.map(band => (
              <FlexBox key={band.band_code} gap="1rem" alignItems="center" justifyContent="space-between">
                <LabelInput value={band.name} onSubmit={(newName) => handleUpdateBand(newName, band)}>
                  <span>{band.name}</span>
                </LabelInput>
                <Button onClick={() => setShowDeleteWarning(true)} isRounded kind="danger" icon={faTrash} />
                {showDeleteWarning && (
                  <Modal offClick={() => setShowDeleteWarning(false)}>
                    <DeleteWarning
                      onClose={() => setShowDeleteWarning(false)}
                      onDelete={() => handleDeleteBand(band.band_code)}
                      isLoading={updateUserMutation.isLoading}
                    >
                      <span>This action will remove your access to <strong>{band.name}</strong>'s setlists and songs.</span>
                    </DeleteWarning>
                  </Modal>
                )}  
              </FlexBox>
            ))}
          </FlexBox>
        </form>
      </FlexBox>
      {showNewBand && (
        <Modal offClick={() => setShowNewBand(false)}>
          <div className="UserRoute__modal">
            <FlexBox padding="1rem" justifyContent="space-between">
              <h3>New band</h3>
              <Button onClick={() => setShowNewBand(false)} isRounded icon={faTimes} />
            </FlexBox>
            <AddBand />
          </div>
        </Modal>
      )}
    </div>
  )
}