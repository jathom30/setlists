import React, { useEffect, useState } from "react";
import { CheckButton, FlexBox, GridBox, Label } from "components";
import Select from "react-select";
import { vibes } from "songConstants";
import { capitalizeFirstLetter } from "utils";
import { SetlistFilters } from "typings";

export const AutoGenSettings = ({onChange}: {onChange: (filters: SetlistFilters) => void}) => {
  const [noCovers, setNoCovers] = useState(false)
  const [onlyCovers, setOnlyCovers] = useState(false)
  const [noBallads, setNoBallads] = useState(false)
  // const [fifths, setFifths] = useState(false)
  // const [vibe, setVibe] = useState<string>()

  const handleCheck = (key: 'covers' | 'onlyCovers') => {
    if (key === 'covers') {
      if (!noCovers) {
        setOnlyCovers(false)
      }
      setNoCovers(!noCovers)
    } else {
      if (!onlyCovers) {
        setNoCovers(false)
      }
      setOnlyCovers(!onlyCovers)
    }
  }

  useEffect(()=> {
    onChange({
      noCovers,
      onlyCovers,
      noBallads,
      // fifths,
      // vibe,
    })
  }, [noBallads, noCovers, onChange, onlyCovers])

  return (
    <div className="AutoGenSettings">
      <FlexBox flexDirection="column" gap="1rem">
        <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))">
          <CheckButton selected={noCovers} onChange={() => handleCheck('covers')} label="Originals only" />
          <CheckButton selected={onlyCovers} onChange={() => handleCheck('onlyCovers')} label="Covers only" />
          <CheckButton selected={noBallads} onChange={setNoBallads} label="Remove ballads" />
          {/* <CheckButton selected={fifths} onChange={setFifths} label="Circle of fifths" /> */}
        </GridBox>
        {/* <FlexBox flexDirection="column" gap=".25rem">
          <Label>Select a vibe</Label>
          <Select
            isClearable
            placeholder="Vibe..."
            options={vibes.map(vibe => ({
              label: capitalizeFirstLetter(vibe),
              value: vibe
            }))}
            onChange={vibe => setVibe(vibe?.value)}
          />
        </FlexBox> */}
      </FlexBox>
    </div>
  )
}
