import React, { FormEvent, useRef, useState } from "react";
import { useOnClickOutside, useSetlist, useSongs } from "hooks";
import { Breadcrumbs, Button, CollapsingButton, CreateSet, DataViz, DeleteWarning, FeelChart, FlexBox, Group, HeaderBox, Input, Label, Loader, MaxHeightContainer, Modal, Popover, RatioBar, TempoWave, ViewWrapper } from "components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PARENT_LISTS_QUERY, PARENT_LIST_QUERY, SETLISTS_QUERY } from "queryKeys";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteSetlist, deleteSet, getSetlist, updateSets, createSet, updateSetlist } from "api";
import { Setlist, Song } from 'typings'
import { DragDropContext } from "react-beautiful-dnd";
import './SetlistRoute.scss'
import { faCog, faEdit, faEye, faPencil, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";

export const SetlistRoute = () => {
  const { setlistId } = useParams()
  const [deleteWarning, setDeleteWarning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showReadOnly, setShowReadOnly] = useState(false)
  const [setlistName, setSetlistName] = useState('')
  const [showNameEdit, setShowNameEdit] = useState(false)
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
    {
      enabled: !!setlistId,
      onSuccess(data) {
        setSetlistName(data.name)
      },
    }
  )
  const setlist = setlistQuery.data

  const { songsQuery } = useSongs()
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

  const createSetMutation = useMutation(async ({ parentId, sets }: { parentId: string, sets: Record<string, Song[]> }) => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await createSet({
        songs: sets[id].map(song => song.id),
        parent_list: [parentId],
      })
      return response
    })
    return Promise.allSettled(responses)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([SETLISTS_QUERY, setlistId])
    }
  })

  const updateSetsMutation = useMutation(updateSets, {
    onSuccess: () => setHasChanged(false)
  })

  const handleUpdate = () => {
    const sortedSets = Object.keys(sets).reduce((
      allSets: {
        temp: Record<string, Song[]>,
        existing: Record<string, Song[]>
      },
      key
    ) => {
      if (key.includes('temp-')) {
        return {
          ...allSets,
          temp: {
            ...allSets.temp,
            [key]: sets[key]
          }
        }
      }
      return {
        ...allSets,
        existing: {
          ...allSets.existing,
          [key]: sets[key]
        }
      }
    }, { temp: {}, existing: {} })
    updateSetsMutation.mutate(sortedSets.existing)
    createSetMutation.mutate({ parentId: setlistId || '', sets: sortedSets.temp })
  }

  const deleteSetsMutation = useMutation(async () => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await deleteSet(id)
      return response
    })
    return Promise.allSettled(responses)
  }, { onSuccess: () => navigate('/') })

  const deleteSetlistMutation = useMutation(deleteSetlist, {
    onMutate: async (setlistId) => {
      await queryClient.cancelQueries([PARENT_LISTS_QUERY])

      const prevSetlists = queryClient.getQueryData<Setlist[]>([PARENT_LISTS_QUERY])

      if (prevSetlists) {
        const filteredSetlists = prevSetlists.filter(setlist => setlist.id !== setlistId)
        queryClient.setQueryData([PARENT_LISTS_QUERY], filteredSetlists)
      }
      return { prevSetlists }
    },
    onSuccess: () => {
      deleteSetsMutation.mutate(undefined, {
        onSuccess: () => navigate('/'),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries([SETLISTS_QUERY])
    }
  })

  const handleDelete = () => {
    deleteSetlistMutation.mutate(setlist?.id || '')
  }

  const deleteSetMutation = useMutation(deleteSet)

  const handleDeleteSet = (setId: string) => {
    deleteSetMutation.mutate(setId)
    removeSet(setId)
  }

  const updateSetlistMutation = useMutation(updateSetlist, {
    onMutate: async () => {
      await queryClient.cancelQueries([PARENT_LIST_QUERY, setlistId])

      const prevSetlist = queryClient.getQueryData<Setlist>([PARENT_LIST_QUERY, setlistId])

      if (prevSetlist) {
        queryClient.setQueryData([PARENT_LIST_QUERY, setlistId], {
          ...prevSetlist,
          name: setlistName
        })
      }
      return { prevSetlist }
    },
    onSuccess: () => {
      setShowNameEdit(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries([PARENT_LIST_QUERY, setlistId])
    }
  })

  const handleSubmitNameChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateSetlistMutation.mutate({
      id: setlistId || '', setlist: {
        name: setlistName
      }
    })
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
                        icon={faEdit}
                        kind="secondary"
                        onClick={() => { setShowNameEdit(!showNameEdit); setShowSettings(false) }}
                      >
                        Update setlist name
                      </Button>
                      <Button
                        justifyContent="flex-start"
                        icon={showReadOnly ? faPencil : faEye}
                        kind="secondary"
                        onClick={() => { setShowReadOnly(!showReadOnly); setShowSettings(false) }}
                      >
                        {showReadOnly ? 'Edit view' : 'Read only view'}
                      </Button>
                      <Button
                        justifyContent="flex-start"
                        icon={faTrash}
                        kind="danger"
                        onClick={() => { setDeleteWarning(true); setShowSettings(false) }}
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
                  <Button onClick={() => { setsQuery.refetch(); setHasChanged(false) }}>Cancel</Button>
                  <Button onClick={handleUpdate} isLoading={updateSetsMutation.isLoading} icon={faSave} kind="primary">Save</Button>
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
                    <h2 key={song.id}>{i + 1}. {song.name}</h2>
                  ))}
                </FlexBox>
              ))}
            </FlexBox>
          ) : (
            <>
              <DragDropContext onDragEnd={handleDragEnd}>
                {Object.keys(sets).map((key, i) => (
                  <ViewWrapper
                    key={key}
                    right={
                      <div style={{ position: 'sticky', top: 0 }}>
                        <DataViz set={sets[key]} />
                      </div>
                    }
                  >
                    <CreateSet
                      availableSongs={songsNotInSetlist}
                      set={sets[key]}
                      setKey={key}
                      index={i + 1}
                      isDisabledRemove={Object.keys(sets).length === 1}
                      onRemove={() => handleDeleteSet(key)}
                      onRemoveSong={songId => removeSongFromSet(key, songId)}
                      onChange={song => addSongToSet(song, key)}
                    />
                  </ViewWrapper>
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
      {showNameEdit && (
        <Modal offClick={() => setShowNameEdit(false)}>
          <div className="SetlistRoute__modal">
            <form action="submit" onSubmit={handleSubmitNameChange}>
              <FlexBox flexDirection="column" gap="1rem">
                <Input value={setlistName} onChange={setSetlistName} name="setlist-name" />
                <FlexBox justifyContent="flex-end" gap="1rem">
                  <Button onClick={() => setShowNameEdit(false)}>Cancel</Button>
                  <Button type="submit" kind="primary" isLoading={updateSetlistMutation.isLoading}>Save</Button>
                </FlexBox>
              </FlexBox>
            </form>
          </div>
        </Modal>
      )}
    </div>
  )
}