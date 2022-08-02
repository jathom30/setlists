import React, { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBand, getBandByCode, updateUser } from "api";
import { FlexBox, Button, Input } from "components";
import { useMask, useUser } from "hooks";
import { BANDS_QUERY, BAND_QUERY, USER_QUERY } from "queryKeys";
import { Band } from "typings";

export const AddBand = ({onSuccess}: {onSuccess: () => void}) => {
  const [hasAccessCode, setHasAccessCode] = useState(false)
  const [bandCode, setBandCode] = useMask('', (val) => {
    return val.toUpperCase().substring(0, 6)
  })
  const [bandName, setBandName] = useState('')
  const [userId, setUserId] = useState('')
  const queryClient = useQueryClient()

  const [userError, setUserError] = useState<string>()

  const createBandMutation = useMutation(createBand)

  const userQuery = useUser(data => setUserId(data.id))

  const getBandByIdQuery= useQuery(
    [BAND_QUERY, bandCode],
    async () => {
      const response = await getBandByCode(bandCode)
      return response[0].fields as Band
    },
    {
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (data) => {
        // check if band already exists on user
        if (userQuery.data?.bands?.some(bandId => bandId === data.id)) { 
          setUserError('Band already exists on user profile. Try a different code.')
          return
        }
        updateUserMutation.mutate({
          id: userQuery.data?.id || '',
          user: {
            bands: [...userQuery.data?.bands || [], data.id],
            current_band_id: data.id
          }
        })
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
    getBandByIdQuery.refetch()
  }

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY])
      queryClient.invalidateQueries([BANDS_QUERY])
      onSuccess()
    }
  })

  const handleNewBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newbandCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    createBandMutation.mutate({
      name: bandName,
      band_code: newbandCode,
      users: [userId || '']
    }, {
      onSuccess: (data) => {
        // after band is created, update user's current band
        updateUserMutation.mutate({
          id: userQuery.data?.id || '',
          user: {
            current_band_id: data[0].id
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
                <Button isLoading={getBandByIdQuery.isFetching} kind="primary" type="submit" isDisabled={bandCode.length !== 6}>Add band</Button>
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