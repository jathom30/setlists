import React from "react";
import { FlexBox, Label, FeelChart, TempoWave, RatioBar } from "components";
import { Song } from "typings";

export const DataViz = ({ set }: { set: Song[] }) => {
  return (
    <div className="DataViz">
      <FlexBox flexDirection="column" gap="2rem">
        <FeelChart songs={set} />
        <FlexBox flexDirection="column" gap=".25rem">
          <Label>Tempos</Label>
          <TempoWave set={set} />
        </FlexBox>
        <FlexBox flexDirection="column" gap=".25rem">
          <Label>Covers / Originals ratio</Label>
          <RatioBar ratio={{
            start: {
              label: 'Covers', amount: set.filter(song => song.is_cover).length
            },
            stop: {
              label: 'Originals', amount: set.filter(song => !song.is_cover).length
            }
          }} />
        </FlexBox>
      </FlexBox>
    </div>
  )
}