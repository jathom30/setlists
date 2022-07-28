import React, { FormEvent, useState } from "react";
import { CheckButton, FlexBox, GridBox } from "components";
import Select from "react-select";
import { vibes } from "songConstants";
import { capitalizeFirstLetter } from "utils";

export const AutoGenSettings = ({onSubmit}: {onSubmit: (form: any) => void}) => {
  const [covers, setCovers] = useState(false)
  const [onlyCovers, setOnlyCovers] = useState(false)
  const [noBallads, setNoBallads] = useState(false)
  const [fifths, setFifths] = useState(false)
  const [vibe, setVibe] = useState<string>()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({stuff: 'things'})
  }
  return (
    <div className="AutoGenSettings">
      <form action="submit" onSubmit={handleSubmit}>
        <FlexBox flexDirection="column" gap="1rem">
          <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
            <CheckButton selected={covers} onChange={setCovers} label="Include covers" />
            <CheckButton selected={onlyCovers} onChange={setOnlyCovers} label="Only covers" />
            <CheckButton selected={noBallads} onChange={setNoBallads} label="Remove ballads" />
            <CheckButton selected={fifths} onChange={setFifths} label="Circle of fifths" />
          </GridBox>
          <Select
            placeholder="Vibe..."
            options={vibes.map(vibe => ({
              label: capitalizeFirstLetter(vibe),
              value: vibe
            }))}
            onChange={vibe => setVibe(vibe?.value)}
          />
        </FlexBox>
      </form>
    </div>
  )
}
