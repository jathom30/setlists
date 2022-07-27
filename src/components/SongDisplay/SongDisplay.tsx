import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, HeaderBox } from "components";
import React, { ReactNode } from "react";
import { Song } from "typings";
import './SongDisplay.scss'

export const SongDisplay = ({song, children, onRemove, index}: {song: Song; children: ReactNode; onRemove: () => void; index: number}) => {
  return (
    <div className="SongDisplay">
      <HeaderBox>
        <FlexBox gap="1rem" alignItems="center">
          {children}
          <span>{index}. <strong>{song.name}</strong></span>
        </FlexBox>
        <Button kind="danger" icon={faMinusCircle} onClick={onRemove} />
      </HeaderBox>
    </div>
  )
}