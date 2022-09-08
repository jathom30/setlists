import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "components";
import { useOnClickOutside } from "hooks";
import React, { useRef, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Song } from "typings";

export const AddSong = ({ onSelect, songs }: { onSelect: (song: Song) => void; songs: Song[] }) => {
  const [showSelect, setShowSelect] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([selectRef], () => { setShowSelect(false) })

  const handleChange = (song: SingleValue<Song>) => {
    if (!song) { return }
    onSelect(song)
    setShowSelect(false)
  }

  const hasAvailableSongs = songs.length > 0

  return (
    <>
      {showSelect ? (
        <div ref={selectRef}>
          <Select
            placeholder="Select song to add..."
            onChange={handleChange}
            options={songs}
            getOptionLabel={song => song.name}
            getOptionValue={song => song.id}
            defaultMenuIsOpen
            menuPlacement="top"
          />
        </div>
      ) : hasAvailableSongs ? (
        <Button icon={faPlus} onClick={() => setShowSelect(true)}>Add song</Button>
      ) : null}
    </>
  )
}