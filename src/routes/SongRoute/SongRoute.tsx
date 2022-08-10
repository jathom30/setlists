import React, { MouseEvent, useState } from "react";
import { faCheckSquare, faCircleDot, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSong, updateSong, getSong } from "api";
import { AddNote, Breadcrumbs, Button, DeleteWarning, FlexBox, GridBox, Label, LabelInput, Loader, MaxHeightContainer, Modal, Input, HeaderBox, CollapsingButton, Tempo, RouteWrapper } from "components";
import { feels, keyLetters, majorMinorOptions } from "songConstants";
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
  const [localSong, setLocalSong] = useState<Song>()

  // const [name, setName] = useState('')

  const songQuery = useQuery([SONG_QUERY, songId], async () => {
    const response = await getSong(songId || '')
    return response.fields as unknown as Song
  }, {
    onSuccess(data) {
      setLocalSong(data)
      // setName(data.name)
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

  const handleDebouncedUpdate = useDebouncedCallback((field: keyof Song, newVal?: string | number | boolean | string[] | SongFeel[]) => {
    if (!songQuery.isSuccess) { return }
    const song = songQuery.data
    updateSongMutation.mutate({
      ...song,
      [field]: newVal,
    })
  }, 300)

  const handleUpdateDetails = (field: keyof Song, newVal?: string | number | boolean | string[] | SongFeel[]) => {
    setLocalSong(prevSong => {
      if (!prevSong) {
        return prevSong
      }
      return {
        ...prevSong,
        [field]: newVal,
      }
    })
    handleDebouncedUpdate(field, newVal)
  }

  const deleteSongMutation = useMutation(deleteSong, {
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries([SONGS_QUERY, bandId])

      const prevSongs = queryClient.getQueryData<Song[]>([SONGS_QUERY, bandId])

      if (prevSongs) {
        const filteredSongs = prevSongs.filter(song => song.id !== deletedId)
        queryClient.setQueryData([SONGS_QUERY, bandId], filteredSongs)
      }
      return { prevSongs }
    },
    onSuccess: () => navigate('/songs')
  })

  const handleDeleteSong = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteSongMutation.mutate(songId || '')
  }

  if (localSong) {
    return (
      <RouteWrapper>
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
                        to: `/songs/${localSong.id}`,
                        label: localSong.name || ''
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
                  <Input value={localSong.name || ''} onChange={val => handleUpdateDetails('name', val)} name="name" label="Name" />

                  <FlexBox flexDirection="column" gap=".25rem">
                    <Label>Key</Label>
                    <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                      <Select
                        defaultValue={{ label: localSong.key_letter, value: localSong.key_letter }}
                        menuPortalTarget={document.body}
                        options={keyLetters.map(key => ({ label: key, value: key }))}
                        onChange={option => {
                          if (!option) return
                          handleUpdateDetails('key_letter', option.value)
                        }}
                      />
                      <Select
                        defaultValue={{ label: localSong.is_minor ? 'Minor' : 'Major', value: localSong.is_minor }}
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
                      <Tempo value={localSong.tempo || 3} onChange={val => handleUpdateDetails('tempo', val)} />
                    </FlexBox>
                    <FlexBox flexDirection="column" gap="0.25rem">
                      <Label>Feel</Label>
                      <Select
                        isMulti
                        defaultValue={localSong.feel && localSong.feel.map(f => ({ label: capitalizeFirstLetter(f), value: f }))}
                        onChange={newFeels => {
                          if (!newFeels || !localSong.feel) return
                          handleUpdateDetails('feel', newFeels.map(f => f.value))
                        }}
                        options={feels.map(feel => ({ label: capitalizeFirstLetter(feel), value: feel }))}
                      />
                    </FlexBox>
                  </GridBox>

                  <FlexBox flexDirection="column" gap=".25rem">
                    <Label>Length</Label>
                    <LabelInput step={1} value={localSong.length || 0} onSubmit={val => handleUpdateDetails('length', parseFloat(val as string))}>
                      {pluralize('minute', localSong.length, true)}
                    </LabelInput>
                  </FlexBox>

                  <FlexBox flexDirection="column" alignItems="flex-start" gap=".25rem">
                    <Label>Cover</Label>
                    <Button onClick={() => handleUpdateDetails('is_cover', !localSong.is_cover)} kind="text" icon={localSong.is_cover ? faCheckSquare : faSquare}>
                      <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>Is a cover</span>
                    </Button>
                  </FlexBox>

                  <FlexBox gap=".25rem" flexDirection="column">
                    <Label>Position</Label>
                    <FlexBox gap="1rem">
                      <Button onClick={() => handleUpdateDetails('position', 'opener',)} kind="text" icon={localSong.position === 'opener' ? faCircleDot : faCircle}>Opener</Button>
                      <Button onClick={() => handleUpdateDetails('position', 'closer',)} kind="text" icon={localSong.position === 'closer' ? faCircleDot : faCircle}>Closer</Button>
                      <Button onClick={() => handleUpdateDetails('position', '',)} kind="text" icon={!localSong.position ? faCircleDot : faCircle}>Other</Button>
                    </FlexBox>
                  </FlexBox>

                  <FlexBox gap=".25rem" flexDirection="column">
                    <Label>Setlist auto-generation importance</Label>
                    <FlexBox gap="1rem">
                      <Button onClick={() => handleUpdateDetails('rank', 'exclude',)} kind="text" icon={localSong.rank === 'exclude' ? faCircleDot : faCircle}>Always exclude</Button>
                      <Button onClick={() => handleUpdateDetails('rank', 'star',)} kind="text" icon={localSong.rank === 'star' ? faCircleDot : faCircle}>Always include</Button>
                      <Button onClick={() => handleUpdateDetails('rank', '',)} kind="text" icon={!localSong.rank ? faCircleDot : faCircle}>Other</Button>
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </div>
            </FlexBox>
            <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
              <Label>Notes</Label>
              <div className="SongRoute__details">
                <AddNote defaultNote={localSong.notes} onSave={(note) => handleUpdateDetails('notes', note)} />
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
                  <strong>{localSong.name}</strong> is currently being used in {pluralize('setlist', localSong.setlists?.length || 0, true)}. This will result in modified sets.
                </span>
              </DeleteWarning>
            </Modal>
          )}
        </div>
      </RouteWrapper>
    )
  }
  return <FlexBox flexDirection="column" padding="1rem"><Loader size="l" /></FlexBox>
}
