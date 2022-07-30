import React, { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBand, getBand } from "api";
import { FlexBox, Button, Input } from "components";
import { useMask } from "hooks";
import { useIdentityContext } from "react-netlify-identity";
import { BAND_QUERY } from "queryKeys";
import { Band } from "typings";

export const AddBand = ({onSuccess}: {onSuccess: () => void}) => {
  const {user, updateUser} = useIdentityContext()
  const [hasAccessCode, setHasAccessCode] = useState(false)
  const [bandCode, setBandCode] = useMask('', (val) => val.toUpperCase())
  const [bandName, setBandName] = useState('')

  const [userError, setUserError] = useState<string>()

  const bands: string[] = user?.user_metadata?.bandCode || []
  const createBandMutation = useMutation(createBand)

  const updateUserMetaDataMutation = useMutation(updateUser, {
    onSuccess: (data) => {
      onSuccess()
    }
  })

  const getBandByCodeQuery = useQuery(
    [BAND_QUERY, bandCode],
    async () => {
      const response = await getBand(bandCode)
      return response[0].fields as Band
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      onSuccess: () => {
        const uniqueBands = Array.from(new Set([...bands, bandCode]))
        updateUserMetaDataMutation.mutate({ data: {
          bandCode: uniqueBands,
          currentBand: bandCode
        }})
      },
      onError: () => {
        setUserError('Invalid access code. Check code and try again.')
      }
    }
  )

  const handleExistingBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // when adding a band via code, we need to check if the band exists.
    // this query runs to get the band via code. If successful, user metadata is updated
    // if failed, user is notified that the band code is note accurate.
    getBandByCodeQuery.refetch()
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
                <Button isLoading={getBandByCodeQuery.isLoading || updateUserMetaDataMutation.isLoading} kind="primary" type="submit" isDisabled={bandCode.length !== 6}>Add band</Button>
                {userError && <span style={{textAlign: 'center', color: 'var(--color-danger)'}}>{userError}</span>}
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