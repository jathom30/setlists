import { useQuery } from "@tanstack/react-query";
import { getBand, getParentLists } from "api";
import { FlexBox } from "components";
import React, { useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link } from "react-router-dom";
import { ParentList } from "typings";
import './SetlistsRoute.scss'

export const SetlistsRoute = () => {
  const {user} = useIdentityContext()
  const currentBand: string | undefined = user?.user_metadata.currentBand
  const [bandId, setBandId] = useState('')

  useQuery(
    ['bands', currentBand],
    async () => {
      const response = await getBand(currentBand || '')
      return response
    }, {
      enabled: !!currentBand,
      onSuccess: (data) => {
        setBandId(data?.[0].id)
      }
    }
  )

  const parentListsQuery = useQuery(
    ['parent-list', bandId],
    async () => {
      const response = await getParentLists(bandId)
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

  return (
    <div className="SetlistsRoute">
      <h1>Setlists</h1>
      <div className="SetlistsRoute__list">
        {parentLists?.map(parent => (
          <Link key={parent.id} to={`/setlists/${parent.id}`}>
            <div className="SetlistsRoute__parent-set">
              <FlexBox padding=".5rem" flexDirection="column" gap=".5rem">
                <span>Name: <strong>{parent.name}</strong></span>
                <span>Number of Sets: <strong>{parent.sets.length}</strong></span>
              </FlexBox>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}