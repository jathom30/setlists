import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FlexBox, HeaderBox, Button } from "components";
import React from "react";
import { ParentList } from "typings";
import './ParentListTile.scss'

export const ParentListTile = ({parent}: {parent: ParentList}) => {
  const lastUpdatedDate = (new Date(parent.last_updated)).toDateString()
  const lastUpdatedTime = (new Date(parent.last_updated)).toLocaleTimeString()
  return (
    <div className="ParentListTile">
      <FlexBox padding=".5rem" flexDirection="column" gap=".5rem">
        <HeaderBox>
          <h3>{parent.name}</h3>
          <Button icon={faTrash} isRounded kind="danger" />
        </HeaderBox>
        <span>{parent.sets?.length} set(s)</span>
        <span>Updated by <strong>{parent.updated_by}</strong> on <strong>{lastUpdatedDate}</strong> at <strong>{lastUpdatedTime}</strong></span>
      </FlexBox>
    </div>
  )
}