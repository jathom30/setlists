import React from "react";
import { FlexBox, HeaderBox, GridBox } from "components";
import { Setlist } from "typings";
import './SetlistTile.scss'
import pluralize from "pluralize";

export const SetlistTile = ({parent}: {parent: Setlist}) => {
  const lastUpdatedDate = (new Date(parent.last_updated)).toDateString()
  return (
    <div className="SetlistTile">
      <FlexBox padding=".5rem" flexDirection="column" gap=".5rem">
        <HeaderBox>
          <h3>{parent.name}</h3>
        </HeaderBox>
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          <span>{pluralize('set', parent.sets?.length || 0, true)}</span>
        </GridBox>
        <FlexBox justifyContent="flex-end">
          <span>Updated by <strong>{parent.updated_by}</strong> on <strong>{lastUpdatedDate}</strong></span>
        </FlexBox>
      </FlexBox>
    </div>
  )
}