import React, { useContext, useEffect, useState } from "react";
import { CollapsingButton, FlexBox, HeaderBox, SongDisplay, DataViz, AddSong } from "components";
import pluralize from "pluralize";
import { Song } from "typings";
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { faDatabase, faEyeSlash, faGrip, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import "./CreateSet.scss"
import { WindowDimsContext } from "context";

export const CreateSet = ({ set, availableSongs, setKey, onChange, onRemove, onRemoveSong, isDisabledRemove, index }: {
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
  const [showDataViz, setShowDataViz] = useState(false)
  const { singleCol } = useContext(WindowDimsContext)
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

  // make sure mobile dataViz closes when moving to wider viewports
  useEffect(() => {
    if (!singleCol) {
      setShowDataViz(false)
    }
  }, [singleCol])

  if (!enabled) { return null }

  return (
    <div className="CreateSet">
      <FlexBox flexDirection="column" gap="1rem">
        <HeaderBox>
          <FlexBox gap=".5rem" alignItems="center">
            <h4>Set {index}</h4>
            <span>{pluralize('minute', setLength, true)}</span>
          </FlexBox>
          <FlexBox gap=".5rem">
            {singleCol && <CollapsingButton icon={showDataViz ? faEyeSlash : faDatabase} label={showDataViz ? "Hide Data" : "Show Data"} onClick={() => setShowDataViz(!showDataViz)} />}
            {!isDisabledRemove && <CollapsingButton icon={faTrash} label="Remove set" kind="danger" onClick={onRemove} />}
          </FlexBox>
        </HeaderBox>
        {showDataViz && (
          <DataViz set={set} />
        )}
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