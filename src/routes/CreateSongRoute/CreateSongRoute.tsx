import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { createSong } from "api";
import { Button, FlexBox, Input, Loader } from "components";
import { useGetCurrentBand } from "hooks";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateSongRoute = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [length, setLength] = useState(0)

  const bandQuery = useGetCurrentBand()

  const createSongMutation = useMutation(createSong, {
    onSuccess: () => {
      navigate('/songs')
    }
  })

  const handleSave = () => {
    createSongMutation.mutate({
      name,
      length,
      bands: [bandQuery.data?.id || ''],
      is_cover: false,
      is_excluded: false,
    })
  }

  const isValid = name && length > 0

  if (bandQuery.isLoading) {
    return (
      <FlexBox padding="1rem" alignItems="center" justifyContent="center">
        <Loader size="l" />
      </FlexBox>
    )
  }

  return (
    <div className="CreateSongRoute">
      <FlexBox padding="1rem" gap="1rem" flexDirection="column">
        <h1>Create song</h1>
        <Input label="Name" value={name} onChange={setName} name="name" placeholder="Song name" />
        <Input label="Length (in minutes)" value={length} onChange={(val) => setLength(parseInt(val))} name="length" placeholder="Song length" />
        <Button kind="primary" icon={faSave} onClick={handleSave} isDisabled={!isValid}>Save song</Button>
      </FlexBox>
    </div>
  )
}