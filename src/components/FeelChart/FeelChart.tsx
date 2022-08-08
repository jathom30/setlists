import { FlexBox } from "components";
import React from "react";
import { Song, SongFeel } from "typings";
import { capitalizeFirstLetter, createSlices } from "utils";
import './FeelChart.scss'

const feelColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'grey', 'black']

export const FeelChart = ({songs}: {songs: Song[]}) => {
  const radius = 1

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
      color: feelColors[i],
    }
  })

  const slices = createSlices(feelSlices)
  return (
    <div className="FeelChart">
      <FlexBox gap="1rem" alignItems="center" justifyContent="center">
        <svg version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="-1 -1 2 2" style={{transform: 'rotate(-90deg)'}}>
          <circle r={radius} cx={0} cy={0} fill="white" />
          {slices.map(slice => (
            <path onMouseOver={() => console.log('over')} key={slice.pathData} d={slice.pathData} fill={slice.color} />
          ))}
        </svg>
        <FlexBox gap="1rem" flexDirection="column">
          {slices.map(slice => (
            <FlexBox gap=".25rem" key={slice.pathData} alignItems="center">
              <span style={{background: slice.color, width: '1rem', height: '1rem'}} />
              {capitalizeFirstLetter(slice.name)}
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
    </div>
  )
}