import { Button, FlexBox } from "components";
import { useOnClickOutside } from "hooks";
import React, { useRef, useState } from "react";
import './AddNote.scss'

export const AddNote = ({onSave, defaultNote}: {onSave: (newNote: string) => void; defaultNote?: string}) => {
  const [note, setNote] = useState(defaultNote || '')
  const [edit, setEdit] = useState(false)
  const newNoteRef = useRef<HTMLTextAreaElement>(null)
  const saveNoteRef = useRef<HTMLButtonElement>(null)

  useOnClickOutside([newNoteRef, saveNoteRef], () => {
    setEdit(false)
  })

  const handleSave = () => {
    onSave(note)
    setEdit(false)
  }

  const splitNote = note.split('\n')

  if (!note.trim() && !edit) {
    return (
      <Button onClick={() => setEdit(true)}>Add note</Button>
    )
  }

  return (
    <div className="AddNote">
      <FlexBox flexDirection="column" gap="1rem">
        {edit ? (
          <FlexBox flexDirection="column" gap="1rem">
            <textarea ref={newNoteRef} rows={10} value={note} onChange={e => setNote(e.target.value)} />
            <FlexBox gap="1rem" justifyContent="flex-end">
              <Button>Cancel</Button>
              <Button buttonRef={saveNoteRef} kind="primary" onClick={handleSave}>Save</Button>
            </FlexBox>
          </FlexBox>
        ) : (
          <button className="AddNote__text-btn" onClick={() => setEdit(true)}>
            {splitNote.map((split, i) => (
              <p className="AddNote__note-strand" key={i}>{split}</p>
            ))}
          </button>
        )}
      </FlexBox>
    </div>
  )
}