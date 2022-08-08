import React, { MouseEvent, useState } from "react";
import { faCheckSquare, faCircleDot, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSong, updateSong, getSong } from "api";
import { AddNote, Breadcrumbs, Button, DeleteWarning, FlexBox, GridBox, Label, LabelInput, Loader, MaxHeightContainer, Modal, Input, HeaderBox, CollapsingButton } from "components";
import { feels, keyLetters, majorMinorOptions, tempos } from "songConstants";
import pluralize from "pluralize";
import { SONGS_QUERY, SONG_QUERY } from "queryKeys";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Song, SongFeel } from "typings";
import './SongRoute.scss'
import { capitalizeFirstLetter } from "utils";
import { useDebouncedCallback, useGetCurrentBand } from "hooks";

export const SongRoute = () => {
  const { songId } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const bandQuery = useGetCurrentBand()
  const bandId = bandQuery.data?.id

  const [name, setName] = useState('')
  
  const songQuery = useQuery([SONG_QUERY, songId], async () => {
    const response = await getSong(songId || '')
    return response.fields as unknown as Song
  }, {
    onSuccess(data) {
      setName(data.name)
    },
  })
  

  const updateSongMutation = useMutation(updateSong, {
    onMutate: async (newSong) => {
      await queryClient.cancelQueries([SONG_QUERY, songId])

      const prevSong = queryClient.getQueryData<Song>([SONG_QUERY, songId])
      if (prevSong) {
        queryClient.setQueryData([SONG_QUERY, songId], {
          ...prevSong,
          ...newSong
        })
      }
      return { prevSong }
    },
    onSettled: () => {
      queryClient.invalidateQueries([SONG_QUERY, songId])
    }
  })

  const handleUpdateDetails = (field: keyof Song, newVal?: string | number | boolean | string[] | SongFeel[]) => {
    if (!songQuery.isSuccess) { return }
    const song = songQuery.data
    updateSongMutation.mutate({
      ...song,
      [field]: newVal,
    })
  }

  const debouncedName = useDebouncedCallback((newName: string) => {
    handleUpdateDetails('name', newName)
  }, 500)

  const handleNameChange = (val: string) => {
    setName(val)
    debouncedName(val)
  }

  const deleteSongMutation = useMutation(deleteSong, {
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries([SONGS_QUERY, bandId])

      const prevSongs = queryClient.getQueryData<Song[]>([SONGS_QUERY, bandId])

      if (prevSongs) {
        const filteredSongs = prevSongs.filter(song => song.id !== deletedId)
        queryClient.setQueryData([SONGS_QUERY, bandId], filteredSongs)
      }
      return { prevSongs}
    },
    onSuccess: () => navigate('/songs')
  })

  const handleDeleteSong = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteSongMutation.mutate(songId || '')
  }
  
  if (songQuery.isLoading) {
    return <FlexBox flexDirection="column" padding="1rem"><Loader size="l" /></FlexBox>
  }

  if (songQuery.isSuccess) {
    const song = songQuery.data
    return (
      <div className="SongRoute">
        <MaxHeightContainer
          header={
            <FlexBox padding="1rem" flexDirection="column">
              <HeaderBox>
                <Breadcrumbs
                  crumbs={[
                    {
                      to: '/songs',
                      label: 'Songs'
                    },
                    {
                      to: `/songs/${song?.id}`,
                      label: song?.name || ''
                    }
                  ]}
                />
                <CollapsingButton
                  icon={faTrash}
                  kind="danger"
                  onClick={() => setShowDeleteModal(true)}
                  label="Delete song"
                />
              </HeaderBox>
            </FlexBox>
          }
        >
          <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
            <Label>Details</Label>
            <div className="SongRoute__details">
              <FlexBox flexDirection="column" gap="1rem">
                <Input value={name} onChange={handleNameChange} name="name" label="Name" />
  
                <FlexBox flexDirection="column" gap=".25rem">
                  <Label>Key</Label>
                  <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                    <Select
                      defaultValue={{label: song.key_letter, value: song.key_letter}}
                      menuPortalTarget={document.body}
                      options={keyLetters.map(key => ({label: key, value: key}))}
                      onChange={option => {
                        if (!option) return
                        handleUpdateDetails('key_letter', option.value)
                      }}
                    />
                    <Select
                      defaultValue={{label: song?.is_minor ? 'Minor' : 'Major', value: song?.is_minor}}
                      menuPortalTarget={document.body}
                      options={majorMinorOptions}
                      onChange={option => {
                        if (!option) return
                        handleUpdateDetails('is_minor', option.value || false)
                      }}
                    />
                  </GridBox>
                </FlexBox>

                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <FlexBox flexDirection="column" gap="0.25rem">
                    <Label>Tempo</Label>
                    <Select
                      defaultValue={song?.tempo && {label: capitalizeFirstLetter(song.tempo), value: song.tempo}}
                      menuPortalTarget={document.body}
                      options={tempos.map(key => ({label: capitalizeFirstLetter(key), value: key}))}
                      onChange={option => {
                        if (!option) return
                        handleUpdateDetails('tempo', option.value)
                      }}
                    />
                  </FlexBox>
                  <FlexBox flexDirection="column" gap="0.25rem">
                    <Label>Feel</Label>
                    <Select
                      isMulti
                      defaultValue={song.feel && song.feel.map(f => ({label: capitalizeFirstLetter(f), value: f}))}
                      onChange={newFeels => {
                        if (!newFeels || !song.feel) return
                        handleUpdateDetails('feel', newFeels.map(f => f.value))
                      }}
                      options={feels.map(feel => ({label: capitalizeFirstLetter(feel), value: feel}))}
                    />
                  </FlexBox>
                </GridBox>

                <FlexBox flexDirection="column" gap=".25rem">
                  <Label>Length</Label>
                  <LabelInput step={1} value={song?.length || 0} onSubmit={val => handleUpdateDetails('length', parseFloat(val as string))}>
                    {pluralize('minute', song?.length, true)}
                  </LabelInput>
                </FlexBox>
  
                <FlexBox flexDirection="column" alignItems="flex-start" gap=".25rem">
                  <Label>Cover</Label>
                  <Button onClick={() => handleUpdateDetails('is_cover', !song?.is_cover)} kind="text" icon={song?.is_cover ? faCheckSquare : faSquare}>
                    <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Is a cover</span>
                  </Button>
                </FlexBox>
  
                <FlexBox gap=".25rem" flexDirection="column">
                  <Label>Position</Label>
                  <FlexBox gap="1rem">
                    <Button onClick={() => handleUpdateDetails('position','opener', )} kind="text" icon={song?.position === 'opener' ? faCircleDot : faCircle}>Opener</Button>
                    <Button onClick={() => handleUpdateDetails('position', 'closer', )} kind="text" icon={song?.position === 'closer' ? faCircleDot : faCircle}>Closer</Button>
                    <Button onClick={() => handleUpdateDetails('position', '', )} kind="text" icon={!song?.position ? faCircleDot : faCircle}>Other</Button>
                  </FlexBox>
                </FlexBox>
                
                <FlexBox gap=".25rem" flexDirection="column">
                  <Label>Setlist auto-generation importance</Label>
                  <FlexBox gap="1rem">
                    <Button onClick={() => handleUpdateDetails('rank','exclude', )} kind="text" icon={song?.rank === 'exclude' ? faCircleDot : faCircle}>Always exclude</Button>
                    <Button onClick={() => handleUpdateDetails('rank', 'star', )} kind="text" icon={song?.rank === 'star' ? faCircleDot : faCircle}>Always include</Button>
                    <Button onClick={() => handleUpdateDetails('rank', '', )} kind="text" icon={!song?.rank ? faCircleDot : faCircle}>Other</Button>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </div>
          </FlexBox>
          <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
            <Label>Notes</Label>
            <div className="SongRoute__details">
              <AddNote defaultNote={song?.notes} onSave={(note) => handleUpdateDetails('notes', note)} />
            </div>
          </FlexBox>
        </MaxHeightContainer>
        {showDeleteModal && (
          <Modal offClick={() => setShowDeleteModal(false)}>
            <DeleteWarning
              onClose={() => setShowDeleteModal(false)}
              onDelete={handleDeleteSong}
              isLoading={deleteSongMutation.isLoading}
            >
              <span>
                <strong>{song?.name}</strong> is currently being used in {pluralize('setlist', song?.setlists?.length || 0, true)}. This will result in modified sets.
              </span>
            </DeleteWarning>
          </Modal>
        )}
      </div>
    )
  }
  return null
}
