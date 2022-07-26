import React from "react";
import pluralize from 'pluralize'
import { FlexBox, HeaderBox, GridBox } from "components";
import { Song } from "typings";
import './SongTile.scss'

export const SongTile = ({song}: {song: Song}) => {
  return (
    <div className="SongTile">
      <FlexBox flexDirection="column" gap=".5rem">
        <HeaderBox>
          <FlexBox alignItems="center" gap=".5rem">
            <h4>{song.name}</h4>
            {song.is_cover && <span>(Cover)</span>}
          </FlexBox>
          {song.is_excluded && <span className="SongTile__warning-text">Excluded from auto-generation</span>}
        </HeaderBox>
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          <span>{pluralize('minute', song.length, true)}</span>
          <span>Featured in {pluralize('setlist', song.setlists?.length, true)}</span>
        </GridBox>
      </FlexBox>
    </div>
  )
}