import { faCheckSquare, faSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSong, updateSong } from "api";
import { AddNote, Breadcrumbs, Button, DeleteWarning, FlexBox, GridBox, Label, LabelInput, Loader, MaxHeightContainer, Modal, Input, HeaderBox, CollapsingButton } from "components";
import { keyLetters, majorMinorOptions, tempos } from "songConstants";
import pluralize, { plural } from "pluralize";
import { SONGS_QUERY } from "queryKeys";
import React, { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Song } from "typings";
import './SongRoute.scss'
import { capitalizeFirstLetter } from "utils";
import { useDebounce, useSongs } from "hooks";

export const SongRoute = () => {
  const { songId } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const {getSong, songsQuery: { isLoading }} = useSongs()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const song = getSong(songId || '')
  const [name, setName] = useState(song.name)
  const debouncedName = useDebounce(name, 500)


  const updateSongMutation = useMutation(updateSong, {
    onSettled: () => {
      queryClient.invalidateQueries([SONGS_QUERY])
    }
  })

  const handleUpdateDetails = (newVal: string | number | boolean | string[], field: keyof Song) => {
    if (!song) { return }
    updateSongMutation.mutate({
      ...song,
      [field]: newVal,
    })
  }

  useEffect(() => {
    handleUpdateDetails(debouncedName, 'name')
  }, [debouncedName])

  const deleteSongMutation = useMutation(deleteSong, {onSuccess: () => navigate('/songs')})

  const handleDeleteSong = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteSongMutation.mutate(songId || '')
  }
  
  if (isLoading) {
    return <Loader size="l" />
  }

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
                    to: `/songs/${song.id}`,
                    label: song.name
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
              <Input value={name} onChange={setName} name="name" label="Name" />

              <FlexBox flexDirection="column" gap=".25rem">
                <Label>Key</Label>
                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <Select
                    defaultValue={song?.key_letter && {label: song.key_letter, value: song.key_letter}}
                    menuPortalTarget={document.body}
                    options={keyLetters.map(key => ({label: key, value: key}))}
                    onChange={option => {
                      if (!option) return
                      handleUpdateDetails(option.value, 'key_letter')
                    }}
                  />
                  <Select
                    defaultValue={{label: song?.is_minor ? 'Minor' : 'Major', value: song?.is_minor}}
                    menuPortalTarget={document.body}
                    options={majorMinorOptions}
                    onChange={option => {
                      if (!option) return
                      handleUpdateDetails(option.value || false, 'is_minor')
                    }}
                  />
                </GridBox>
              </FlexBox>

              <FlexBox flexDirection="column" gap=".25rem">
                <Label>Tempo</Label>
                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <Select
                    defaultValue={song?.tempo && {label: capitalizeFirstLetter(song.tempo), value: song.tempo}}
                    menuPortalTarget={document.body}
                    options={tempos.map(key => ({label: capitalizeFirstLetter(key), value: key}))}
                    onChange={option => {
                      if (!option) return
                      handleUpdateDetails(option.value, 'tempo')
                    }}
                  />
                </GridBox>
              </FlexBox>

              <FlexBox flexDirection="column" gap=".25rem">
                <Label>Length</Label>
                <LabelInput step={1} value={song?.length || 0} onSubmit={val => handleUpdateDetails(parseFloat(val as string), 'length')}>
                  {pluralize('minute', song?.length, true)}
                </LabelInput>
              </FlexBox>

              <FlexBox alignItems="center" gap=".5rem">
                <Button onClick={() => handleUpdateDetails(!song?.is_cover, 'is_cover')} kind="text" icon={song?.is_cover ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Is a cover</span>
                </Button>
              </FlexBox>

              <FlexBox alignItems="center" gap=".5rem">
                <Button onClick={() => handleUpdateDetails(!song?.is_excluded, 'is_excluded')} kind="text" icon={song?.is_excluded ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Exclude from auto-generation</span>
                </Button>
              </FlexBox>
              
              <FlexBox alignItems="center" gap=".5rem">
                <Button onClick={() => handleUpdateDetails(!song?.is_starred, 'is_starred')} kind="text" icon={song?.is_starred ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Always include during auto-generation</span>
                </Button>
              </FlexBox>
            </FlexBox>
          </div>
        </FlexBox>
        <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
          <Label>Notes</Label>
          <div className="SongRoute__details">
            <AddNote defaultNote={song?.notes} onSave={(note) => handleUpdateDetails(note, 'notes')} />
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
              <strong>{song?.name}</strong> is currently being used in {pluralize('setlist', song.setlists?.length || 0, true)}. This may result in updated sets.
            </span>
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}
