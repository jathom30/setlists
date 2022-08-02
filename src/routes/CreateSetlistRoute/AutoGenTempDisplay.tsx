import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, CreateSet, FlexBox, LabelInput } from "components";
import { useSetlist, useCreateSetlist } from "hooks";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { Song } from "typings";

export const AutoGenTempDisplay = ({initialSets, name, onNameChange}: {initialSets: Record<string, Song[]>; name: string; onNameChange: (val: string) => void}) => {
  const {
    addSongToSet,
    removeSongFromSet,
    addSet,
    removeSet,
    hasAvailableSongs,
    songsNotInSetlist,
    sets,
    handleDragEnd
  } = useSetlist(initialSets)

  const {onSubmit, isLoading} = useCreateSetlist(sets, name)

  return (
    <div className="AutoGenTempDisplay">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <LabelInput value={name} onSubmit={val => onNameChange(val.toString())}>
          <h2>{name}</h2>
        </LabelInput>
        <DragDropContext onDragEnd={handleDragEnd}>
            {Object.keys(sets)?.map((key, i) => (
              <CreateSet
                availableSongs={songsNotInSetlist}
                set={sets[key]}
                key={key}
                setKey={key}
                index={i + 1}
                isDisabledRemove={Object.keys(sets).length === 1}
                onRemove={() => removeSet(key)}
                onRemoveSong={(songId) => removeSongFromSet(key, songId)}
                onChange={(song) => addSongToSet(song, key)}
              />
            ))}
          </DragDropContext>
          {hasAvailableSongs ? (
          <Button kind="secondary" icon={faPlus} onClick={addSet}>Create new set</Button>
        ) : (
          <FlexBox flexDirection="column" gap=".5rem" alignItems="center">
            <span>All songs in use</span>
            <Link to="/create-song">
              <Button kind="secondary" icon={faPlus}>Create new song</Button>
            </Link>
          </FlexBox>
        )}
        <Button kind="primary" onClick={onSubmit} isLoading={isLoading}>Save setlist</Button>
      </FlexBox>
    </div>
  )
}