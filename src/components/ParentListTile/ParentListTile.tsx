import React from "react";
import { FlexBox, HeaderBox, GridBox } from "components";
import { ParentList } from "typings";
import './ParentListTile.scss'

export const ParentListTile = ({parent}: {parent: ParentList}) => {
  const lastUpdatedDate = (new Date(parent.last_updated)).toDateString()
  return (
    <div className="ParentListTile">
      <FlexBox padding=".5rem" flexDirection="column" gap=".5rem">
        <HeaderBox>
          <h3>{parent.name}</h3>
        </HeaderBox>
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          <span>{parent.sets?.length} set(s)</span>
        </GridBox>
        <FlexBox justifyContent="flex-end">
          <span>Updated by: <strong>{parent.updated_by}</strong> on <strong>{lastUpdatedDate}</strong></span>
        </FlexBox>
      </FlexBox>
    </div>
  )
}