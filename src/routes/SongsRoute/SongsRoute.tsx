import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, HeaderBox, Input, Loader, SongTile } from "components";
import { SongsContext } from "context/SongsContext";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import './SongsRoute.scss'

export const SongsRoute = () => {
  const [search, setSearch] = useState('')

  const {songsQuery} = useContext(SongsContext) || {}
  const songs = songsQuery?.data

  const sortedAndFilteredSongs = songs
    ?.filter(song => song.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1}
      else { return 1}
    })

  if (songsQuery?.isLoading) {
    return ( <Loader size="l" />)
  }

  return (
    <div className="SongsRoute">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <HeaderBox>
          <h1>Songs</h1>
          <Button kind="primary" icon={faPlus}>Add Song</Button>
        </HeaderBox>
        <Input value={search} onChange={setSearch} name="search" label="Search" />

        <FlexBox flexDirection="column" gap=".5rem">
          {sortedAndFilteredSongs?.map(song => (
            <Link key={song.id} to={`/songs/${song.id}`}>
              <SongTile song={song} />
            </Link>
          ))}
        </FlexBox>
      </FlexBox>
    </div>
  )
}