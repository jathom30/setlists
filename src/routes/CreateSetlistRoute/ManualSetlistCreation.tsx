import React, { useState } from "react";
import { Button, CreateSet, FlexBox, Input } from "components";
import { useGetCurrentBand, useSongs } from "hooks";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {v4 as uuid} from 'uuid'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createParentList, createSetlist } from "api";
import { PARENT_LISTS_QUERY } from "queryKeys";
import { Song } from "typings";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { reorder } from "utils";
import { useIdentityContext } from "react-netlify-identity";

export const ManualSetlistCreation = () => {
  const {user} = useIdentityContext()
  const [name, setName] = useState('')
  const [step, setStep] = useState(1)
  const [sets, setSets] = useState<Record<string, Song[]>>({'initial': []})
  const bandQuery = useGetCurrentBand()
  const {songsQuery} = useSongs()
  const songs = songsQuery?.data

  const songsInSets = Object.values(sets).reduce((all: Song[], songs) => [...all, ...songs], [])
  const songsNotInSetlist = songs?.filter(song => songsInSets.every(s => s.id !== song.id))
  const hasAvailableSongs = songsNotInSetlist && songsNotInSetlist?.length > 0

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleNewSet = () => {
    setSets(prevSets => {
      return {...prevSets, [uuid()]: []}
    })
  }

  const handleSubmit = () => {
    if (!isValid) return
    if (step === 1) {
      setStep(2)
      return
    }
    createSetlistMutation.mutate({
      name,
      updated_by: `${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`,
      last_updated: (new Date()).toString(),
      bands: [bandQuery.data?.id || '']
    })
  }

  const createSetMutation = useMutation(async (parentId: string) => {
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

  const createSetlistMutation = useMutation(createParentList, {
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetMutation.mutate(parentId)
    }
  })

  const handleAddSongToSetlist = (song: Song, key: string) => {
    setSets(prevSets => ({
        ...prevSets,
        [key]: [...prevSets[key], song]
    }))
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
  const isValid = eachSetHasSongs && Object.keys(sets).length > 0 && (step === 2 ? !!name : true)
  const isLoading = createSetlistMutation.isLoading || createSetMutation.isLoading

  return (
    <div className="ManualSetlistCreation">
      <FlexBox flexDirection="column" gap="1rem">
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
        {hasAvailableSongs ? (
          <Button kind="secondary" icon={faPlus} onClick={handleNewSet}>Create new set</Button>
        ) : (
          <FlexBox flexDirection="column" gap=".5rem" alignItems="center">
            <span>All songs in use</span>
            <Link to="/create-song">
              <Button kind="secondary" icon={faPlus}>Create new song</Button>
            </Link>
          </FlexBox>
        )}
        {step === 2 && (
          <Input name="name" value={name} onChange={setName} label="Setlist name" placeholder="Name your setlist..." />
        )}
        <Button
          isDisabled={!isValid}
          isLoading={isLoading}
          kind="primary"
          type="submit"
          onClick={handleSubmit}
          icon={step === 2 ? faSave : undefined}
        >
          {step === 1 ? 'Next step' : 'Save setlist'}
        </Button>
      </FlexBox>
    </div>
  )
}