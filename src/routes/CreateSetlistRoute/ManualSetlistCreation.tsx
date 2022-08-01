import React, { useState } from "react";
import { Button, CreateSet, FlexBox, Input } from "components";
import { useSetlist, useCreateSetlist } from "hooks";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";

export const ManualSetlistCreation = () => {
  const [name, setName] = useState('')
  const [step, setStep] = useState(1)

  const {
    addSongToSet,
    removeSongFromSet,
    addSet,
    removeSet,
    hasAvailableSongs,
    songsNotInSetlist,
    sets,
    handleDragEnd
  } = useSetlist()

  const {onSubmit, isLoading} = useCreateSetlist(sets, name)


  const handleSubmit = () => {
    if (!isValid) return
    if (step === 1) {
      setStep(2)
      return
    }
    onSubmit()
  }

  const eachSetHasSongs = Object.values(sets).every(set => set.length > 0)
  const isValid = eachSetHasSongs && Object.keys(sets).length > 0 && (step === 2 ? !!name : true)

  return (
    <div className="ManualSetlistCreation">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
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
        {step === 2 && (
          <Input name="name" value={name} onChange={setName} label="Setlist name" placeholder="Name your setlist..." />
        )}
        <Button
          isDisabled={!isValid}
          isLoading={isLoading}
          kind="primary"
          type="submit"
          onClick={handleSubmit}
          icon={step === 2 ? faSave : undefined}
        >
          {step === 1 ? 'Next step' : 'Save setlist'}
        </Button>
      </FlexBox>
    </div>
  )
}