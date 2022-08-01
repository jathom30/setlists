import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSetlists } from "api";
import { Breadcrumbs, Button, CollapsingButton, FlexBox, HeaderBox, Input, Loader, MaxHeightContainer, SetlistTile } from "components";
import { PARENT_LISTS_QUERY } from "queryKeys";
import { Link, useNavigate } from "react-router-dom";
import { Setlist } from "typings";
import './SetlistsRoute.scss'
import { useGetCurrentBand } from "hooks";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SetlistsRoute = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const bandQuery = useGetCurrentBand()

  const bandId = bandQuery.data?.id

  const setlistQuery = useQuery(
    [PARENT_LISTS_QUERY, bandId],
    async () => {
      const response = await getSetlists(bandId || '')
      return response.map(fieldSet => fieldSet.fields) as Setlist[]
    },
    {
      enabled: !!bandId
    }
  )

  const setlists = setlistQuery.data

  const sortedAndFilteredSetlists = setlists
    ?.filter(setlist => setlist.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1}
      else { return 1}
    })

  const noLists = setlistQuery.isSuccess && setlistQuery.data.length === 0

  return (
    <div className="SetlistsRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox flexDirection="column" gap="1rem" padding="1rem">
            <HeaderBox>
              <Breadcrumbs
                crumbs={[{
                  to: '/setlists',
                  label: 'Setlists',
                }]}
              />
              {!noLists && <CollapsingButton kind="primary" icon={faPlus} onClick={() => navigate('/create-setlist')} label="New setlist" />}
            </HeaderBox>
            <Input value={search} onChange={setSearch} name="search" placeholder="Search by setlist name..." />
          </FlexBox>
        }
      >
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          {setlistQuery.isLoading && <Loader size="l" />}
          {noLists ? (
            <FlexBox flexDirection="column" gap="1rem" alignItems="center">
              <FontAwesomeIcon size="4x" icon={faMagnifyingGlass} />
              <span>Looks like you don't have any setlists made yet.</span>
              <Button isRounded kind="primary" icon={faPlus} onClick={() => navigate('/create-setlist')}>Create your first setlist</Button>
            </FlexBox>
          ) : (
            <FlexBox flexDirection="column" gap="0.5rem">
              {sortedAndFilteredSetlists?.map(setlist => (
                <Link key={setlist.id} to={`/setlists/${setlist.id}`}>
                  <SetlistTile setlist={setlist} />
                </Link>
              ))}
            </FlexBox>
          )}
        </FlexBox>
      </MaxHeightContainer>
    </div>
  )
}