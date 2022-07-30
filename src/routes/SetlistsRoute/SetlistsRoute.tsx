import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getParentLists } from "api";
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

  const parentListsQuery = useQuery(
    [PARENT_LISTS_QUERY, bandId],
    async () => {
      const response = await getParentLists(bandId || '')
      return response.map(fieldSet => fieldSet.fields) as Setlist[]
    },
    {
      enabled: !!bandId,
    }
  )

  const setlists = parentListsQuery.data

  const sortedAndFilteredSetlists = setlists
    ?.filter(setlist => setlist.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1}
      else { return 1}
    })

  const noLists = parentListsQuery.isSuccess && parentListsQuery.data.length === 0

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
            <Input value={search} onChange={setSearch} name="search" label="Search" placeholder="Search by setlist name..." />
          </FlexBox>
        }
      >
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          {parentListsQuery.isLoading && <Loader size="l" />}
          {noLists ? (
            <FlexBox flexDirection="column" gap="1rem" alignItems="center">
              <FontAwesomeIcon size="4x" icon={faMagnifyingGlass} />
              <span>Looks like you don't have any setlists made yet.</span>
              <Button kind="primary" icon={faPlus} onClick={() => navigate('/create-setlist')}>Create your first setlist</Button>
            </FlexBox>
          ) : (
            <FlexBox flexDirection="column" gap="0.5rem">
              {sortedAndFilteredSetlists?.map(parent => (
                <Link key={parent.id} to={`/setlists/${parent.id}`}>
                  <SetlistTile parent={parent} />
                </Link>
              ))}
            </FlexBox>
          )}
        </FlexBox>
      </MaxHeightContainer>
    </div>
  )
}