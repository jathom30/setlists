import { faFilter, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumbs, Button, CollapsingButton, FlexBox, HeaderBox, Input, Loader, MaxHeightContainer, Popover, RouteWrapper, SongFilters, SongTile, Wrapper } from "components";
import { WindowDimsContext } from "context";
import { useSongs } from "hooks";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { filterByCover, filterByFeel, filterByPosition, filterByTempo } from "utils";
import './SongsRoute.scss'

export const SongsRoute = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { width } = useContext(WindowDimsContext)

  const { songsQuery } = useSongs()
  const songs = songsQuery.data
  const [showFilters, setShowFilters] = useState(false)
  const [filteredSongs, setFilteredSongs] = useState(songs)

  useEffect(() => {
    setFilteredSongs(songs)
  }, [songs])

  const noSongs = songs?.length === 0

  const handleFilterChange = (filters: Record<string, string[]>) => {
    const { tempos, feels, cover, position } = filters
    if (!songs) return
    const allFiltered = filterByTempo(filterByFeel(filterByCover(filterByPosition(songs, position), cover), feels), tempos)
    setFilteredSongs(allFiltered)
  }

  const sortedAndFilteredSongs = filteredSongs
    ?.filter(song => song.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1 }
      else { return 1 }
    })

  return (
    <div className="SongsRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <Wrapper>
            <FlexBox flexDirection="column" gap="1rem" padding="1rem">
              <HeaderBox>
                <Breadcrumbs
                  crumbs={[{ to: '/songs', label: 'Songs' }]}
                />
                {!noSongs && <CollapsingButton kind="primary" icon={faPlus} onClick={() => navigate('/create-song')} label="Add song" />}
              </HeaderBox>
              <Input value={search} onChange={setSearch} name="search" placeholder="Search by song title..." />
              {width < 900 && (
                <FlexBox justifyContent="flex-end">
                  <Popover
                    isOpen={showFilters}
                    content={
                      <div className="SongsRoute__popover">
                        <SongFilters onChange={handleFilterChange} />
                      </div>
                    }
                    position={['bottom']}
                    align="end"
                  >
                    <div>
                      <CollapsingButton icon={faFilter} label="Filters" onClick={() => setShowFilters(!showFilters)} />
                    </div>
                  </Popover>
                </FlexBox>
              )}
            </FlexBox>
          </Wrapper>
        }
      >
        <Wrapper
          leftContent={<SongFilters onChange={handleFilterChange} />}
        >
          {songsQuery.isLoading && <FlexBox flexDirection="column" padding="1rem"><Loader size="l" /></FlexBox>}
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
        </Wrapper>
      </MaxHeightContainer>
    </div>
  )
}