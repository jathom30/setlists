import React, { MouseEvent, ReactNode, useState } from "react";
import { Button, FlexBox, Group, Input, Label } from "components";
import { useSongs } from "hooks";
import { handleGreaterThanZeroChange } from "utils";
import { autoGenSetlist } from "utils/setlists";
import { AutoGenSettings } from "./AutoGenSettings";
import { Song, SetlistFilters } from "typings";
import { useNavigate } from "react-router-dom";

export const AutoSetlistCreation = ({onSubmit}: {onSubmit: (sets: Record<string, Song[]>, name: string) => void}) => {
  const [step, setStep] = useState(1)
  const [setLength, setSetLength] = useState(45)
  const [setCount, setSetCount] = useState(1)
  const [filters, setFilters] = useState<SetlistFilters>()
  const {songsQuery} = useSongs()
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!name) {
      setStep(prevStep => prevStep + 1)
    } else {
      if (!songsQuery.isSuccess || !filters) { return }
      onSubmit(autoGenSetlist(songsQuery.data, {
        filters,
        setCount,
        setLength,
      }), name)
      navigate('temp')
    }
  }

  const isValid = () => {
    switch (step) {
      case 3:
        return !!name
      default:
        return true
    }
  }

  return (
    <div className="AutoSetlistCreation">
      <form action="submit">
        <FlexBox flexDirection="column" gap="1rem" padding="1rem">
          {step >= 1 && (
            <Step number={1} label="Set details">
              <FlexBox flexDirection="column" gap="1rem">
                <Input label="Set length (in minutes)" value={setLength} onChange={val => setSetLength(handleGreaterThanZeroChange(parseInt(val)))} step={1} name="set-length" />
                <Input label="Number of sets" value={setCount} onChange={val => setSetCount(handleGreaterThanZeroChange(parseInt(val)))} step={1} name="number-of-sets" />
              </FlexBox>
            </Step>
          )}
          {step >= 2 && (
            <Step number={2} label="Auto-generation settings">
              <AutoGenSettings onChange={setFilters} />
            </Step>
          )}
          {step >= 3 && (
            <Step number={3} label="Pick a name">
              <Input label="Name" value={name} onChange={setName} name="name" placeholder="Name your setlist..." />
            </Step>
          )}
          <Button type="submit" kind="primary" isDisabled={!isValid()} onClick={handleNext}>{!name ? "Next step" : 'Create sets'}</Button>
        </FlexBox>
      </form>
    </div>
  )
}

export const Step = ({number, label, children}: {number: number; label: string; children: ReactNode}) => {
  return (
    <FlexBox flexDirection="column" gap=".25rem">
      <Label>{number}. {label}</Label>
      <Group padding="1rem">
        {children}
      </Group>
    </FlexBox>
  )
}