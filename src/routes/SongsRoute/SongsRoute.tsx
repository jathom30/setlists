import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumbs, Button, CollapsingButton, FlexBox, HeaderBox, Input, Loader, MaxHeightContainer, SongTile } from "components";
import { useSongs } from "hooks";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './SongsRoute.scss'

export const SongsRoute = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const {songsQuery} = useSongs()
  const songs = songsQuery?.data

  const sortedAndFilteredSongs = songs
    ?.filter(song => song.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1}
      else { return 1}
    })

  const noSongs = songs?.length === 0

  if (songsQuery?.isLoading) {
    return ( <Loader size="l" />)
  }

  return (
    <div className="SongsRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox flexDirection="column" gap="1rem" padding="1rem">
            <HeaderBox>
              <Breadcrumbs
                crumbs={[{ to: '/songs', label: 'Songs'}]}
              />
              {!noSongs && <CollapsingButton kind="primary" icon={faPlus} onClick={() => navigate('/create-song')} label="Add song" />}
            </HeaderBox>
            <Input value={search} onChange={setSearch} name="search" placeholder="Search by song title..." />
          </FlexBox>
        }
      >
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          {noSongs ? (
            <FlexBox flexDirection="column" gap="1rem" alignItems="center">
              <FontAwesomeIcon size="4x" icon={faMagnifyingGlass} />
              <span>Looks like you don't have any songs yet.</span>
              <Button kind="primary" isRounded icon={faPlus} onClick={() => navigate('/create-song')}>Create your first song</Button>
            </FlexBox>
          ) : (
            <FlexBox flexDirection="column" gap=".5rem">
              {sortedAndFilteredSongs?.map(song => (
                <Link key={song.id} to={`/songs/${song.id}`}>
                  <SongTile song={song} />
                </Link>
              ))}
            </FlexBox>
          )}

        </FlexBox>
      </MaxHeightContainer>
    </div>
  )
}