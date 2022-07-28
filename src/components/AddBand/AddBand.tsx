import { useMutation } from "@tanstack/react-query";
import { createBand } from "api";
import { FlexBox, Button, Input } from "components";
import React, { FormEvent, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";

export const AddBand = ({onSuccess}: {onSuccess: () => void}) => {
  const {user, updateUser} = useIdentityContext()
  const [hasAccessCode, setHasAccessCode] = useState(false)
  const [bandCode, setBandCode] = useState('')
  const [bandName, setBandName] = useState('')

  const bands: string[] = user?.user_metadata?.bandCode || []
  const createBandMutation = useMutation(createBand)

  const updateUserMetaDataMutation = useMutation(updateUser, {
    onSuccess: (data) => {
      onSuccess()
    }
  })

  const handleExistingBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const uniqueBands = Array.from(new Set(...bands, bandCode))

    updateUserMetaDataMutation.mutate({ data: {
      bandCode: uniqueBands,
      currentBand: bandCode
    }})
  }

  const handleNewBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newBandCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    createBandMutation.mutate({name: bandName, band_code: newBandCode}, {
      onSuccess: () => {
        updateUserMetaDataMutation.mutate({ data: {
          bandCode: [...bands, newBandCode],
          currentBand: newBandCode
        }})
      }
    })
  }

  return (
    <div className="AddBand">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        {hasAccessCode ? (
          <>
            <p>If you have a six digit band access code, enter it below.</p>
            <form action="submit" onSubmit={handleExistingBand}>
              <FlexBox flexDirection="column" gap="1rem">
                <Input label="Access code" name="add-existing" value={bandCode} onChange={setBandCode} />
                <Button kind="primary" type="submit" isDisabled={bandCode.length !== 6}>Add band</Button>
              </FlexBox>
            </form>
          </>
        ) : (
          <>
            <p>Create a new band to start building setlists!</p>
            <form action="submit" onSubmit={handleNewBand}>
              <FlexBox flexDirection="column" gap="1rem">
                <Input label="Band name" value={bandName} onChange={setBandName} name="band-name" />
                <Button kind="primary" type="submit" isDisabled={!bandName} isLoading={createBandMutation.isLoading}>Create New</Button>
              </FlexBox>
            </form>
          </>
        )}
        <Button kind="secondary" onClick={() => setHasAccessCode(!hasAccessCode)}>{hasAccessCode ? 'Create a new band' : 'Received band invite?'}</Button>
      </FlexBox>
    </div>
  )
}