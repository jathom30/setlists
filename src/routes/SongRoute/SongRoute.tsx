import { faCheckSquare, faSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSong, updateSong } from "api";
import { AddNote, Button, DeleteWarning, FlexBox, GridBox, Label, LabelInput, Loader, MaxHeightContainer, Modal } from "components";
import { keyLetters, majorMinorOptions, tempos } from "songConstants";
import { WindowDimsContext, SongsContext } from "context";
import pluralize from "pluralize";
import { SONGS_QUERY } from "queryKeys";
import React, { MouseEvent, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Song } from "typings";
import './SongRoute.scss'
import { capitalizeFirstLetter } from "utils";

export const SongRoute = () => {
  const { songId } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const {getSong, isLoading} = useContext(SongsContext) || {}
  const {isMobileWidth} = useContext(WindowDimsContext)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const song = getSong && getSong(songId || '')

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

  const deleteSongMutation = useMutation(deleteSong, {onSuccess: () => navigate('/songs')})

  const handleDeleteContact = (e: MouseEvent<HTMLButtonElement>) => {
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
          <FlexBox padding={isMobileWidth ? "" : "1rem"} flexDirection="column" gap=".5rem">
            {!isMobileWidth && <Label>Name</Label>}
            <div className="SongRoute__header">
              <FlexBox alignItems="center" justifyContent="space-between" gap="0.5rem">
                <LabelInput value={song?.name || ''} onSubmit={val => handleUpdateDetails(val as string, 'name')}>
                  <h1>{song?.name}</h1>
                </LabelInput>
                <Button isRounded icon={faTrash} onClick={() => setShowDeleteModal(true)} kind="danger" />
              </FlexBox>
            </div>
          </FlexBox>
        }
      >
        <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
          <Label>Details</Label>
          <div className="SongRoute__details">
            <FlexBox flexDirection="column" gap="1rem">
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
            onDelete={handleDeleteContact}
            isLoading={deleteSongMutation.isLoading}
          >
            <span>
              Contact information for <strong>{song?.name}</strong> cannot be recovered once deleted.
            </span>
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}
