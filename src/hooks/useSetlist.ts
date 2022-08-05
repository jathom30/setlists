import { useQuery } from "@tanstack/react-query"
import { getSets } from "api"
import { SETLISTS_QUERY } from "queryKeys"
import { useState } from "react"
import { DropResult } from "react-beautiful-dnd"
import { useParams } from "react-router-dom"
import { Set, Song } from "typings"
import { reorder } from "utils"
import {v4 as uuid} from 'uuid'
import { useSongs } from "./useSongs"

export const useSetlist = (initialSets?: Record<string, Song[]>) => {
  const { setlistId } = useParams()
  const [sets, setSets] = useState<Record<string, Song[]>>(initialSets || {'initial': []})
  const {songsQuery, getSong} = useSongs()
  const [hasChanged, setHasChanged] = useState(false)

  const setsQuery = useQuery(
    [SETLISTS_QUERY, setlistId],
    async () => {
      const response = await getSets(setlistId || '')
      const mappedResponse = response.map(set => (set.fields)) as Set[]
      return mappedResponse.reduce((all: Record<string, Song[]>, set) => ({
        ...all,
        // ! it is possible for the songs array to not return if all songs in the setlist were removed
        ...(set.songs && {[set.id]: set.songs.map(songId => getSong(songId))})
      }), {})
    },
    {
      enabled: !!setlistId && songsQuery.isSuccess,
      onSuccess: (data) => {
        setSets(data)
      },
      refetchOnWindowFocus: false,
    }
  )

  const songs = songsQuery?.data

  const songsInSets = Object.values(sets).reduce((all: Song[], songs) => [...all, ...songs], [])
  const songsNotInSetlist = songs?.filter(song => songsInSets.every(s => s.id !== song.id)) || []
  const hasAvailableSongs = songsNotInSetlist?.length > 0

  const addSongToSet = (song: Song, key: string) => {
    setSets(prevSets => ({
        ...prevSets,
        [key]: [...prevSets[key], song]
    }))
    setHasChanged(true)
  }

  const removeSongFromSet = (setKey: string, songId: string) => {
    setSets(prevSets => {
      return {
        ...prevSets,
        [setKey]: prevSets[setKey].filter(song => song.id !== songId)
      }
    })
    setHasChanged(true)
  }

  const addSet = () => {
    setSets(prevSets => {
      return {...prevSets, [`temp-${uuid()}`]: []}
    })
    setHasChanged(true)
  }

  const removeSet = (key: string) => {
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
    setHasChanged(true)
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
    setHasChanged(true)
  }

  return {
    handleDragEnd,
    addSongToSet,
    removeSongFromSet,
    addSet,
    removeSet,
    hasAvailableSongs,
    songsNotInSetlist,
    setsQuery,
    sets,
    hasChanged,
    setHasChanged
  }
}