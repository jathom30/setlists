import React, { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createBand, getBand, getUser, updateBand, updateUser } from "api";
import { FlexBox, Button, Input } from "components";
import { useMask } from "hooks";
import { useIdentityContext } from "react-netlify-identity";
import { BAND_QUERY } from "queryKeys";
import { Band, User } from "typings";

export const AddBand = ({onSuccess}: {onSuccess: () => void}) => {
  const {user} = useIdentityContext()
  const [hasAccessCode, setHasAccessCode] = useState(false)
  const [bandCode, setBandCode] = useMask('', (val) => val.toUpperCase())
  const [bandName, setBandName] = useState('')
  const [userId, setUserId] = useState('')

  const [userError, setUserError] = useState<string>()

  const createBandMutation = useMutation(createBand)

  const userQuery = useQuery(['user', user?.id], async () => {
    const response = await getUser(user?.id || '')
    return response[0].fields as User
  }, {
    enabled: !!user?.id,
    onSuccess: (data) => {
      setUserId(data.id)
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
      retry: 0,
      onSuccess: (data) => {
        updateUserMutation.mutate({
          id: userQuery.data?.id || '',
          user: {
            bands: [...userQuery.data?.bands || [], data.id],
            current_band_code: data.band_code
          }
        })
        console.log(data)
      },
      onError: () => {
        setUserError('Invalid access code. Check code and try again.')
      }
    }
  )

  const handleExistingBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUserError(undefined)
    // when adding a band via code, we need to check if the band exists.
    // this query runs to get the band via code. If successful, user metadata is updated
    // if failed, user is notified that the band code is note accurate.
    getBandByCodeQuery.refetch()
  }

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      onSuccess()
    }
  })

  const handleNewBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newBandCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    createBandMutation.mutate({
      name: bandName,
      band_code: newBandCode,
      users: [userId || '']
    }, {
      onSuccess: (data) => {
        // after band is created, update user's current band
        updateUserMutation.mutate({
          id: userQuery.data?.id || '',
          user: {
            current_band_code: newBandCode
          }
        })
      }
    } 
    )
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
                <Button isLoading={getBandByCodeQuery.isFetching} kind="primary" type="submit" isDisabled={bandCode.length !== 6}>Add band</Button>
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
                <Button kind="primary" type="submit" isDisabled={!bandName || userQuery.isLoading} isLoading={createBandMutation.isLoading || updateUserMutation.isLoading}>Create New</Button>
              </FlexBox>
            </form>
          </>
        )}
        <Button kind="secondary" onClick={() => setHasAccessCode(!hasAccessCode)}>{hasAccessCode ? 'Create a new band' : 'Received band invite?'}</Button>
      </FlexBox>
    </div>
  )
}