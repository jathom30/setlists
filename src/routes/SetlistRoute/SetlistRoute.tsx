import React, { useRef, useState } from "react";
import { useOnClickOutside, useSetlist, useSongs } from "hooks";
import { Breadcrumbs, Button, CollapsingButton, CreateSet, DeleteWarning, FlexBox, Group, HeaderBox, Loader, MaxHeightContainer, Modal, Popover } from "components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PARENT_LIST_QUERY, SETLISTS_QUERY } from "queryKeys";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteSetlist, deleteSet, getSetlist, updateSets } from "api";
import { Setlist } from 'typings'
import { DragDropContext } from "react-beautiful-dnd";
import './SetlistRoute.scss'
import { faCog, faCopy, faEye, faEyeSlash, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";

export const SetlistRoute = () => {
  const { setlistId } = useParams()
  const [deleteWarning, setDeleteWarning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showReadOnly, setShowReadOnly] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  useOnClickOutside([buttonRef, contentRef], () => setShowSettings(false))
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const setlistQuery = useQuery(
    [PARENT_LIST_QUERY, setlistId],
    async () => {
      const response = await getSetlist(setlistId || '')
    return response.fields as Setlist
    },
    { enabled: !!setlistId }
  )
  const setlist = setlistQuery.data

  const {songsQuery} = useSongs()
  const {
    sets,
    addSet,
    removeSet,
    removeSongFromSet,
    addSongToSet,
    handleDragEnd,
    songsNotInSetlist,
    setsQuery,
    hasAvailableSongs,
    hasChanged,
    setHasChanged,
  } = useSetlist()

  const updateSetsMutation = useMutation(updateSets, {onSuccess: () => setHasChanged(false)})

  const handleUpdate = () => {
    updateSetsMutation.mutate(sets)
  }

  const handleSaveAsNew = () => {
    alert('not yet working')
  }

  const deleteSetsMutation = useMutation(async () => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await deleteSet(id)
      return response
    })
    return Promise.allSettled(responses)
  }, {onSuccess: () => navigate('/')})

  const deleteSetlistMutation = useMutation(deleteSetlist, {
    onSuccess: () => {
      deleteSetsMutation.mutate()
    },
    onSettled: () => {
      queryClient.invalidateQueries([SETLISTS_QUERY])
    }
  })

  const handleDelete = () => {
    deleteSetlistMutation.mutate(setlist?.id || '')
  }

  const isLoading = songsQuery?.isLoading || setsQuery.isLoading || setlistQuery.isLoading

  if (isLoading) {
    return (
      <FlexBox alignItems="center" justifyContent="center" padding="1rem">
        <Loader size="l" />
      </FlexBox>
    )
  }
  return (
    <div className="SetlistRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding="1rem" flexDirection="column">
            <HeaderBox>
              <Breadcrumbs
                crumbs={[
                  {
                    to: '/setlists',
                    label: 'Setlists'
                  },
                  {
                    to: `/setlists/${setlist?.id}`,
                    label: setlist?.name || ''
                  }
                ]}
              />
              <Popover
                align="end"
                position={['bottom']}
                isOpen={showSettings}
                content={
                  <div className="SetlistRoute__content" ref={contentRef}>
                    <FlexBox flexDirection="column" padding="1rem" gap=".5rem">
                      <Button
                        justifyContent="flex-start"
                        icon={showReadOnly ? faEyeSlash : faEye}
                        kind="secondary"
                        onClick={() => {setShowReadOnly(!showReadOnly); setShowSettings(false)}}
                      >
                        {showReadOnly ? 'Edit view' : 'Read only view'}
                      </Button>
                      <Button
                        justifyContent="flex-start"
                        icon={faTrash}
                        kind="danger"
                        onClick={() => {setDeleteWarning(true); setShowSettings(false)}}
                      >
                        Delete setlist
                      </Button>
                    </FlexBox>
                  </div>
                }
              >
                <div>
                  <CollapsingButton buttonRef={buttonRef} icon={faCog} label="Settings" onClick={() => setShowSettings(!showSettings)} />
                </div>
              </Popover>
            </HeaderBox>
          </FlexBox>
        }
        footer={
          hasChanged && (
            <FlexBox paddingBottom="1rem" flexDirection="column">
              <Group>
                <FlexBox gap="1rem" padding="1rem" justifyContent="flex-end">
                  <Button onClick={() => {setsQuery.refetch(); setHasChanged(false)}}>Cancel</Button>
                  <Button onClick={handleUpdate} isLoading={updateSetsMutation.isLoading} icon={faSave} kind="primary">Save</Button>
                  <Button onClick={handleSaveAsNew} icon={faCopy} kind="secondary">Save as new</Button>
                </FlexBox>
              </Group>
            </FlexBox>
          )
        }
      >
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          {showReadOnly ? (
            <FlexBox flexDirection="column" gap="1rem">
              {Object.keys(sets).map((key, index) => (
                <FlexBox key={key} flexDirection="column">
                  <h5>Set {index + 1}</h5>
                  {sets[key].map((song, i) => (
                    <h2 key={song.id}>{i+1}. {song.name}</h2>
                  ))}
                </FlexBox>
              ))}
            </FlexBox>
          ) : (
            <>
              <DragDropContext onDragEnd={handleDragEnd}>
                {Object.keys(sets).map((key, i) => (
                  <CreateSet
                    availableSongs={songsNotInSetlist}
                    set={sets[key]}
                    key={key}
                    setKey={key}
                    index={i + 1}
                    isDisabledRemove={Object.keys(sets).length === 1}
                    onRemove={() => removeSet(key)}
                    onRemoveSong={songId => removeSongFromSet(key, songId)}
                    onChange={song => addSongToSet(song, key)}
                  />
                ))}
              </DragDropContext>
              {hasAvailableSongs ? (
                <Button kind="secondary" icon={faPlus} onClick={addSet}>Create new set</Button>
              ) : (
                <FlexBox flexDirection="column" gap=".5rem" alignItems="center">
                  <span>All songs in use</span>
                  <Link to="/create-song">
                    <Button kind="secondary" icon={faPlus}>Create new song</Button>
                  </Link>
                </FlexBox>
              )}
            </>
          )}
        </FlexBox>
      </MaxHeightContainer>
      {deleteWarning && (
        <Modal offClick={() => setDeleteWarning(false)}>
          <DeleteWarning onClose={() => setDeleteWarning(false)} onDelete={handleDelete} isLoading={deleteSetlistMutation.isLoading || deleteSetsMutation.isLoading}>
            <span>This will perminantly delete <strong>{setlist?.name}</strong>.</span>
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}