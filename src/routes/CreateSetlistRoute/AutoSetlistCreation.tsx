import { Button, FlexBox, Group, Input, Label } from "components";
import React, { ReactNode, useState } from "react";
import { handleGreaterThanZeroChange } from "utils";
import { AutoGenSettings } from "./AutoGenSettings";

export const AutoSetlistCreation = ({onCreate}: {onCreate: (autoSettings: any) => void}) => {
  const [step, setStep] = useState(1)
  const [setLength, setSetLength] = useState(45)
  const [numberOfSets, setNumberOfSets] = useState(1)
  const [settings, setSettings] = useState({})

  const [name, setName] = useState('')

  const handleNext = () => {
    if (!name) {
      setStep(prevStep => prevStep + 1)
    } else {
      onCreate({
        name, setLength, numberOfSets, ...settings
      })
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
      <FlexBox flexDirection="column" gap="1rem">
        {step >= 1 && (
          <Step number={1} label="Set details">
            <FlexBox flexDirection="column" gap="1rem">
              <Input label="Set length (in minutes)" value={setLength} onChange={val => setSetLength(handleGreaterThanZeroChange(parseInt(val)))} step={1} name="set-length" />
              <Input label="Number of sets" value={numberOfSets} onChange={val => setNumberOfSets(handleGreaterThanZeroChange(parseInt(val)))} step={1} name="number-of-sets" />
            </FlexBox>
          </Step>
        )}
        {step >= 2 && (
          <Step number={2} label="Auto-generation settings">
            <AutoGenSettings onChange={setSettings} />
          </Step>
        )}
        {step >= 3 && (
          <Step number={3} label="Pick a name">
            <Input label="Name" value={name} onChange={setName} name="name" placeholder="Name your setlist..." />
          </Step>
        )}
        <Button kind="primary" isDisabled={!isValid()} onClick={handleNext}>{!name ? "Next step" : 'Create sets'}</Button>
      </FlexBox>
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