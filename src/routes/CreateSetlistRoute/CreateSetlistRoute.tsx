import React, { MouseEvent, useContext, useRef, useState } from "react";
import {Button, FlexBox, Input} from 'components'
import { SongsContext } from "context";
// import Select, { GroupBase, SingleValue } from "react-select";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Song } from "typings";
import { useGetCurrentBand, useOnClickOutside } from "hooks";
import Select, {SingleValue} from 'react-select'
import { useMutation } from "@tanstack/react-query";
import { createParentList, createSetlist } from "api";
import { useIdentityContext } from "react-netlify-identity";

export const CreateSetlistRoute = () => {
  const {user} = useIdentityContext()
  const bandQuery = useGetCurrentBand()
  const [name, setName] = useState('')
  const [setlist, setSetlist] = useState<Song[]>([])

  const {songsQuery} = useContext(SongsContext) || {}
  const songs = songsQuery?.data

  const songsNotInSetlist = songs?.filter(song => setlist.every(s => s.id !== song.id))

  const handleSelect = (song: Song) => {
    setSetlist(prevSongs => (
      [...prevSongs, song]
    ))
  }

  const createSetlistMutation = useMutation(createSetlist)
  const createParentlistMutation = useMutation(createParentList, {
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetlistMutation.mutate({
        songs: setlist.map(s => s.id),
        parent_list: [parentId]
      })
    }
  })

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createParentlistMutation.mutate({
      name,
      updated_by: user?.user_metadata.firstName,
      last_updated: (new Date()).toString(),
      bands: [bandQuery.data?.id || '']
    })
  }

  const isValid = !!name && setlist.length > 0

  return (
    <div className="CreateSetlistRoute">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <h1>Create setlist</h1>
        <form action="submit">
          <FlexBox  flexDirection="column" gap="1rem">
            <Input label="Name" value={name} onChange={setName} name="name" placeholder="Setlist name" />
            <hr />
            {setlist.map((song, i) => (
              <span key={song.id}>{i + 1}. {song.name}</span>
            ))}
            {songsNotInSetlist && <AddSong onSelect={handleSelect} songs={songsNotInSetlist} />}
            <Button isDisabled={!isValid} kind="primary" type="submit" onClick={handleSubmit}>Create Setlist</Button>
          </FlexBox>
        </form>
      </FlexBox>
    </div>
  )
}

const AddSong = ({onSelect, songs}: {onSelect: (song: Song) => void; songs: Song[]}) => {
  const [showSelect, setShowSelect] =useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([selectRef], () => {setShowSelect(false)})

  const handleChange = (song: SingleValue<Song>) => {
    if (!song) { return }
    onSelect(song)
    setShowSelect(false)
  }

  return (
    <>
    {showSelect ? (
      <div ref={selectRef}>
        <Select
          placeholder="Select song to add..."
          onChange={handleChange}
          options={songs}
          getOptionLabel={song => song.name}
          getOptionValue={song => song.id}
          defaultMenuIsOpen
        />
      </div>
    ) : (
      <Button icon={faPlus} onClick={() => setShowSelect(true)}>Add song</Button>
    )}
    </>
  )
}