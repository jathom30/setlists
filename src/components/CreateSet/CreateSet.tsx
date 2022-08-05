import React, { useEffect, useState } from "react";
import { CollapsingButton, FlexBox, HeaderBox, SongDisplay, AddSong, TempoWave } from "components";
import pluralize from "pluralize";
import { Song } from "typings";
import { Draggable, Droppable} from 'react-beautiful-dnd'
import { faEye, faEyeSlash, faGrip, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import "./CreateSet.scss"

export const CreateSet = ({set, availableSongs, setKey, onChange, onRemove, onRemoveSong, isDisabledRemove, index}: {
  set: Song[];
  availableSongs?: Song[];
  setKey: string;
  onChange: (song: Song) => void;
  onRemove: () => void;
  onRemoveSong: (songId: string) => void;
  isDisabledRemove: boolean;
  index: number;
}) => {
  const [enabled, setEnabled] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const setLength = set?.reduce((total, song) => {
    return total += song.length
  }, 0)

  // React 18 currrently has a bug with StrictMode that is effecting react-beautiful-dnd
  // https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1167427762
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))
    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) { return null}

  return (
    <div className="CreateSet">
      <FlexBox flexDirection="column" gap="1rem">
        <HeaderBox>
          <FlexBox gap=".5rem" alignItems="center">
            <h4>Set {index}</h4>
            <span>{pluralize('minute', setLength, true)}</span>
          </FlexBox>
          <FlexBox gap=".5rem">
            <CollapsingButton icon={showTimeline ? faEyeSlash : faEye} label={showTimeline ? "Hide timeline" : "Show timeline"} onClick={() => setShowTimeline(!showTimeline)} />
            {!isDisabledRemove && <CollapsingButton icon={faTrash} label="Remove set" kind="danger" onClick={onRemove} />}
          </FlexBox>
        </HeaderBox>
        {showTimeline && <TempoWave set={set} />}
          <Droppable droppableId={setKey} type="SONG" direction="vertical">
            {(provided, snapshot) => (
              <div
                className={`CreateSet__droppable ${snapshot.isDraggingOver ? 'CreateSet__droppable--is-dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {set.map((song, i) => (
                  <Draggable key={song.id} draggableId={song.id} index={i}>
                    {(provided) => (
                      <div
                        className="CreateSet__draggable"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <SongDisplay song={song} index={i + 1} onRemove={() => onRemoveSong(song.id)}>
                          <div className="CreateSet__song-handle" {...provided.dragHandleProps}>
                            <FontAwesomeIcon icon={faGrip} />
                          </div>
                        </SongDisplay>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        {set.length === 0 && (
          <Select
            placeholder="Select song to add..."
            onChange={song => {
              if (!song) return
              onChange(song)
            }}
            options={availableSongs}
            getOptionLabel={song => song.name}
            getOptionValue={song => song.id}
            defaultMenuIsOpen
          />
      )}
        {availableSongs && <AddSong onSelect={onChange} songs={availableSongs} />}
      </FlexBox>
    </div>
  )
}