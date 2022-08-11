import { faEdit, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { Button, FlexBox, HeaderBox } from "components";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Song } from "typings";
import './SongDisplay.scss'

export const SongDisplay = ({ song, children, onRemove, index }: { song: Song; children: ReactNode; onRemove: () => void; index: number }) => {
  return (
    <div className="SongDisplay">
      <HeaderBox>
        <div className="SongDisplay__name-wrapper">
          {children}
          <span className="SongDisplay__name">{index}. <strong>{song.name}</strong></span>
        </div>
        <FlexBox gap=".5rem">
          <Link to={`/songs/${song.id}`}>
            <Button kind="secondary" isRounded icon={faEdit} />
          </Link>
          <Button kind="danger" isRounded icon={faMinusCircle} onClick={onRemove} />
        </FlexBox>
      </HeaderBox>
    </div>
  )
}