import React, { MouseEvent, useContext, useState } from "react";
import {Breadcrumbs, Button, FlexBox, Input, CreateSet, MaxHeightContainer} from 'components'
import { useGetCurrentBand } from "hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {v4 as uuid} from 'uuid'
import { createParentList, createSetlist } from "api";
import { useIdentityContext } from "react-netlify-identity";
import { Song } from "typings";
import { SongsContext } from "context";
import { PARENT_LISTS_QUERY } from "queryKeys";
import { useNavigate } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { reorder } from "utils";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import './CreateSetlistRoute.scss'

export const CreateSetlistRoute = () => {
  const {user} = useIdentityContext()
  const bandQuery = useGetCurrentBand()
  const [name, setName] = useState('')
  const [sets, setSets] = useState<Record<string, Song[]>>({})
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {songsQuery} = useContext(SongsContext) || {}
  const songs = songsQuery?.data

  const songsInSets = Object.values(sets).reduce((all: Song[], songs) => [...all, ...songs], [])
  const songsNotInSetlist = songs?.filter(song => songsInSets.every(s => s.id !== song.id))

  const createSetlistMutation = useMutation(async (parentId: string) => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await createSetlist({
        songs: sets[id].map(song => song.id),
        parent_list: [parentId],
      })
      return response
    })
    return Promise.allSettled(responses)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([PARENT_LISTS_QUERY])
      navigate('/setlists')
    }
  })

  const createParentlistMutation = useMutation(createParentList, {
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetlistMutation.mutate(parentId)
    }
  })

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createParentlistMutation.mutate({
      name,
      updated_by: `${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`,
      last_updated: (new Date()).toString(),
      bands: [bandQuery.data?.id || '']
    })
  }

  const handleAddSongToSetlist = (song: Song, key: string) => {
    setSets(prevSets => ({
        ...prevSets,
        [key]: [...prevSets[key], song]
    }))
  }

  const handleNewSet = () => {
    setSets(prevSets => {
      return {...prevSets, [uuid()]: []}
    })
  }

  const handleRemoveSet = (key: string) => {
    setSets(prevSets => {
      const newKeys = Object.keys(prevSets).filter(setKey => setKey !== key)
      const remainingSets = newKeys.reduce((sets, setKey) => {
        return {
          ...sets,
          [setKey]: prevSets[setKey]
        }
      }, {})
      return remainingSets
    })
  }

  const handleRemoveSongFromSet = (setKey: string, songId: string) => {
    setSets(prevSets => {
      return {
        ...prevSets,
        [setKey]: prevSets[setKey].filter(song => song.id !== songId)
      }
    })
  }

  const handleDragEnd = (result: DropResult) => {
    const {type} = result
    if (type === 'SONG') {
      setSets(prevSets => {
        if (!result.destination) {
          return prevSets
        }
        const destinationSetlistId = result.destination.droppableId
        const sourceSetlistId = result.source.droppableId

        // if dragging and dropping within the same container
        if (result.destination.droppableId === result.source.droppableId) {
          return {
            ...prevSets,
            [sourceSetlistId]: reorder(
              prevSets[sourceSetlistId],
              result.source.index,
              result.destination.index
            )
          }
        }

        // if dragging and dropping between two different containers
        // get dragged song from draggableId
        const draggedSong = songs?.find(song => song.id === result.draggableId)
        if (!draggedSong) {
          return prevSets
        }
        // remove id from source
        const updatedSourceList = prevSets[sourceSetlistId].filter(song => song.id !== result.draggableId)
        // add to destination
        const updatedDestinationList = [
          ...prevSets[destinationSetlistId].slice(0, result.destination.index),
          draggedSong,
          ...prevSets[destinationSetlistId].slice(result.destination.index)
        ]
        return {
          ...prevSets,
          [sourceSetlistId]: updatedSourceList,
          [destinationSetlistId]: updatedDestinationList,
        }
      })
    }
  }

  const eachSetHasSongs = Object.values(sets).every(set => set.length > 0)
  const isValid = !!name && eachSetHasSongs
  const isLoading = createParentlistMutation.isLoading || createSetlistMutation.isLoading

  return (
    <div className="CreateSetlistRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding="1rem">
            <Breadcrumbs currentRoute={
              <h1>Create setlist</h1>
            } />
          </FlexBox>
        }
        footer={
          Object.keys(sets).length > 0 && (
            <FlexBox padding="1rem" flexDirection="column">
              <Button
                isDisabled={!isValid}
                isLoading={isLoading}
                kind="primary"
                type="submit"
                onClick={handleSubmit}
                icon={!isLoading ? faSave : undefined}
              >
                Save Setlist
              </Button>
            </FlexBox>
          )
        }
      >
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          <form action="submit">
            <FlexBox  flexDirection="column" gap="1rem">
              <Input label="Name" value={name} onChange={setName} name="name" placeholder="Setlist name..." />
              <hr />
              <DragDropContext onDragEnd={handleDragEnd}>
                {Object.keys(sets)?.map((key, i) => (
                  <CreateSet
                    availableSongs={songsNotInSetlist}
                    set={sets[key]}
                    key={key}
                    setKey={key}
                    index={i + 1}
                    isDisabledRemove={Object.keys(sets).length === 1}
                    onRemove={() => handleRemoveSet(key)}
                    onRemoveSong={(songId) => handleRemoveSongFromSet(key, songId)}
                    onChange={(song) => handleAddSongToSetlist(song, key)}
                  />
                ))}
              </DragDropContext>
              {(name || Object.keys(sets).length > 0) && (
                <Button kind="secondary" icon={faPlus} onClick={handleNewSet}>Create new set</Button>
              )}
            </FlexBox>
          </form>
        </FlexBox>
      </MaxHeightContainer>
    </div>
  )
}
