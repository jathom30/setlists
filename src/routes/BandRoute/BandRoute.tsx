import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBand, getUsersByBand, updateBand, updateUser } from "api";
import { Breadcrumbs, Button, DeleteWarning, FlexBox, Group, Label, LabelInput, Loader, MaxHeightContainer, Modal } from "components";
import { useUser } from "hooks";
import { BAND_MEMBERS_QUERY, BAND_QUERY, USER_QUERY } from "queryKeys";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Band, User } from "typings";

export const BandRoute = () => {
  const { bandId } = useParams()
  const [removeWarning, setRemoveWarning] = useState(false)
  const userQuery = useUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const bandQuery = useQuery([BAND_QUERY, bandId], async () => {
    const response = await getBand(bandId || '')
    return response[0].fields as Band
  }, {
    enabled: !!bandId
  })

  const bandMembersQuery = useQuery([BAND_MEMBERS_QUERY, bandId], async () => {
    const response = await getUsersByBand(bandQuery.data?.id || '')
    return response.map(user => user.fields as User)
  }, {
    enabled: bandQuery.isSuccess
  })

  const bandNameMutation = useMutation(updateBand, {
    onSuccess: () => {
      bandMembersQuery.refetch()
    }
  })

  const handleBandChange = (field: keyof Band, val: string) => {
    if (!bandQuery.isSuccess) return
    bandNameMutation.mutate({
      ...bandQuery.data,
      [field]: val,
    })
  }

  const userMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USER_QUERY])
    }
  })

  const handleRemovefromBand = () => {
    if (!userQuery.isSuccess) {return}
    // if currentBand is the band being deleted, we should auto-select a new band so the user always has an active band selected
    const isCurrentBand = userQuery.data.current_band_id === bandQuery.data?.id
    const isNotCurrentBand = userQuery.data.bands?.find(bandId => bandId !== bandQuery.data?.id) || ''
    userMutation.mutate({
      id: userQuery.data?.id,
      user: {
        bands: userQuery.data.bands?.filter(bandId => bandId !== bandQuery.data?.id),
      ...(isCurrentBand && {current_band_id: isNotCurrentBand})
      }
    })
    navigate('/user-settings')
  }

  const crumbs = [
    {
      to: '/user-settings',
      label: 'User Settings'
    },
    {
      to: `/band-settings/${bandId}`,
      label: 'Band details'
    },
  ]

  if (bandQuery.isLoading) {
    return (
      <FlexBox flexDirection="column" padding="1rem">
        <Loader size="l" />
      </FlexBox>
    )
  }

  if (bandQuery.isSuccess) {
    return (
      <div className="BandRoute">
        <MaxHeightContainer
          fullHeight
          header={
            <FlexBox flexDirection="column" gap="1rem" padding="1rem">
              <Breadcrumbs
                crumbs={crumbs}
              />
            </FlexBox>
          }
        >
          <FlexBox flexDirection="column" gap="1rem" padding="1rem">
            <FlexBox flexDirection="column">
              <Label>Band name</Label>
              <LabelInput value={bandQuery.data.name} onSubmit={val => handleBandChange('name', val.toString())}>
                <h1>{bandQuery.data.name}</h1>
              </LabelInput>
            </FlexBox>
            <FlexBox flexDirection="column" gap=".25rem">
              <Label>Acces code</Label>
              <span>{bandQuery.data.band_code}</span>
            </FlexBox>
            <Group padding="1rem">
              <FlexBox flexDirection="column" gap=".5rem">
                <Label>Members</Label>
                {bandMembersQuery.isLoading && <Loader size="s" />}
                {bandMembersQuery.data?.map(member => (
                  <span key={member.id}>{member.first_name} {member.last_name}</span>
                  ))}
              </FlexBox>
            </Group>
            <Button kind="danger" onClick={() => setRemoveWarning(true)}>Remove self from band</Button>
          </FlexBox>
        </MaxHeightContainer>
        {removeWarning && (
          <Modal offClick={() => setRemoveWarning(false)}>
            <DeleteWarning onClose={() => setRemoveWarning(false)} onDelete={handleRemovefromBand} isLoading={userMutation.isLoading}>
              <p>Once you have removed yourself from this band you will no longer be able to see its setlists or songs.</p>
              <p>You can add yourself back in the future with this band's access code.</p>
            </DeleteWarning>
          </Modal>
        )}
      </div>
    )
  }
  return null
}
