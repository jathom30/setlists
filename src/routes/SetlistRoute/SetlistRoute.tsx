import React, { useContext } from "react";
import { useChildLists } from "hooks/useChildLists";
import { FlexBox, Loader } from "components";
import { SongsContext } from "context/SongsContext";

export const SetlistRoute = () => {
  const setlistsQuery = useChildLists()
  const {songsQuery, getSong} = useContext(SongsContext) || {}

  const setlists = setlistsQuery.data?.sort((a, b) => {
    if (a.position_in_parent < b.position_in_parent) {
      return -1
    } else {return 1}
  })

  if (songsQuery?.isLoading) {
    return (
      <Loader size="l" />
    )
  }
  return (
    <div className="SetlistRoute">
      <h1>Setlists / This list</h1>
      {setlists?.map(list => (
        <FlexBox key={list.id} gap="1rem" flexDirection="column">
          <span>{list.position_in_parent + 1}</span>
          Songs:
          <FlexBox flexDirection="column">
            {list.songs.map(id => {
              const song = getSong && getSong(id)
              return (
                <span key={id}>{song?.name} {song?.length}</span>
              )
            })}
          </FlexBox>
        </FlexBox>
      ))}
    </div>
  )
}