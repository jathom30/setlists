import { Dial, FlexBox } from "components";
import React from "react";

export const Tempo = ({ value, onChange }: { value: number; onChange: (newVal: number) => void }) => {
  return (
    <FlexBox gap="1rem" alignItems="center">
      <Dial tempo="ballad" />
      <input style={{ width: '100%' }} className="Tempo__input" type="range" min={1} max={5} value={value} onChange={e => onChange(parseInt(e.target.value))} />
      <Dial tempo="burner" />
    </FlexBox>
  )
}