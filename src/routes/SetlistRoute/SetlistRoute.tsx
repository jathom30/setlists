import React, { useContext } from "react";
import { useSets } from "hooks";
import { Breadcrumbs, CreateSet, FlexBox, Loader } from "components";
import { missingSong, SongsContext } from "context";
import { useQuery } from "@tanstack/react-query";
import { PARENT_LIST_QUERY } from "queryKeys";
import { useParams } from "react-router-dom";
import { getParentList } from "api";
import { Setlist, Song } from 'typings'
import { DragDropContext } from "react-beautiful-dnd";

export const SetlistRoute = () => {
  const { setlistId } = useParams()

  const setlistQuery = useQuery(
    [PARENT_LIST_QUERY, setlistId],
    async () => {
      const response = await getParentList(setlistId || '')
    return response.fields as Setlist
    },
    { enabled: !!setlistId }
  )
  const setlist = setlistQuery.data

  const {songsQuery, getSong} = useContext(SongsContext) || {}
  const {setsQuery, sets} = useSets()
  const hasSets = Object.keys(sets).length > 0
  
  const songsInSets = sets && Object.values(sets).reduce((all: Song[], songs) => [...all, ...songsQuery?.data || []], [])
  const songsNotInSetlist = songsQuery?.data?.filter(song => songsInSets?.every(s => s.id !== song.id))

  const isLoading = songsQuery?.isLoading || setsQuery.isLoading || setlistQuery.isLoading

  if (!getSong) { return null }
  if (isLoading) {
    return (
      <FlexBox alignItems="center" justifyContent="center" padding="1rem">
        <Loader size="l" />
      </FlexBox>
    )
  }
  const getSetSongs = (key: string) => sets?.[key].map(songId => getSong(songId) || missingSong)
  if (setsQuery.isSuccess) {
    return (
      <div className="SetlistRoute">
        <Breadcrumbs currentRoute={
          <h1>{setlist?.name}</h1>
        } />
        <FlexBox flexDirection="column" gap="1rem">
          {hasSets && (
            <DragDropContext onDragEnd={() => {}}>
              {Object.keys(sets).map((key, i) => (
                <CreateSet
                  availableSongs={songsNotInSetlist}
                  set={getSetSongs(key)}
                  key={key}
                  setKey={key}
                  index={i + 1}
                  isDisabledRemove={Object.keys(sets).length === 1}
                  onRemove={() => console.log(key)}
                  onRemoveSong={songId => console.log(songId)}
                  onChange={song => console.log(song)}
                />
              ))}
            </DragDropContext>
          )}
        </FlexBox>
      </div>
    )
  }
  return null
}