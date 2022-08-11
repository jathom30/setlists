import { FlexBox, PieChart, Label } from "components";
import React from "react";
import { heatColors } from "songConstants";
import { Song, SongFeel } from "typings";
import './FeelChart.scss'

export const FeelChart = ({ songs }: { songs: Song[] }) => {
  const feels = songs.reduce((allFeels: SongFeel[], song) => {
    if (!song.feel) return allFeels
    return [...allFeels, ...song.feel]
  }, [])

  const uniqueFeels = Array.from(new Set(feels))
  const feelSlices = uniqueFeels.map((feel, i) => {
    const totalFeels = feels.length
    return {
      percent: feels.filter(f => f === feel).length / totalFeels,
      name: feel,
      color: heatColors[i],
    }
  })

  if (uniqueFeels.length === 0) {
    return null
  }

  return (
    <div className="FeelChart">
      <FlexBox flexDirection="column" gap=".25rem">
        <Label>Feels</Label>
        <PieChart slices={feelSlices} />
      </FlexBox>
    </div>
  )
}