import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getParentLists } from "api";
import { Button, FlexBox, GridBox, HeaderBox, Loader, ParentListTile } from "components";
import { PARENT_LISTS_QUERY } from "queryKeys";
import { Link, useNavigate } from "react-router-dom";
import { ParentList } from "typings";
import './SetlistsRoute.scss'
import { useGetCurrentBand } from "hooks";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SetlistsRoute = () => {
  const navigate = useNavigate()
  const bandQuery = useGetCurrentBand()

  const bandId = bandQuery.data?.id

  const parentListsQuery = useQuery(
    [PARENT_LISTS_QUERY, bandId],
    async () => {
      const response = await getParentLists(bandId || '')
      return response
    },
    {
      enabled: !!bandId,
    }
  )

  const parentLists = parentListsQuery.data?.map(parentList => ({
    id: parentList.id,
    ...parentList.fields
  })) as ParentList[] | undefined

  const noLists = parentListsQuery.isSuccess && parentListsQuery.data.length === 0

  return (
    <div className="SetlistsRoute">
      <HeaderBox>
        <h1>Setlists</h1>
        {!noLists && <Button kind="primary">New setlist</Button>}
      </HeaderBox>
      {parentListsQuery.isLoading && <Loader size="l" />}
      {noLists ? (
        <FlexBox flexDirection="column" gap="1rem" alignItems="center">
          <FontAwesomeIcon size="4x" icon={faMagnifyingGlass} />
          <span>Looks like you don't have any setlists made yet.</span>
          <Button kind="primary" isRounded icon={faPlus} onClick={() => navigate('/create-new')}>Create your first setlist</Button>
        </FlexBox>
      ) : (
        <GridBox gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))">
          {parentLists?.map(parent => (
            <Link key={parent.id} to={`/setlists/${parent.id}`}>
              <ParentListTile parent={parent} />
            </Link>
          ))}
        </GridBox>
      )}
    </div>
  )
}