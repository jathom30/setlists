import React from "react";
import { FlexBox } from "components";
import { Song } from "typings";
import { getCoords, getPointsWithCurve } from "utils";
import './TempoWave.scss'

export const TempoWave = ({set}: {set: Song[]}) => {
  const height = 13
  const width = 100
  const curve = getPointsWithCurve(getCoords(set, width))
  const start = `M0 ${height}`
  const end = `V ${height}`

  const finalCurve = [start, ...curve, end, 'z'].join(' ')

  return (
    <div className="TempoWave">
      {set.length <= 1 ? (
        <div className="TempoWave__empty">
          <FlexBox padding="1rem" alignItems="center" justifyContent="center">
            Add at least two songs to see setlist heatmap
          </FlexBox>
        </div>
      ) : (
        <svg version="1.1" preserveAspectRatio="xMinYMin meet" viewBox={`0 0 ${width} ${height}`}>
          <linearGradient id="grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style={{stopColor: '#219ebc', stopOpacity: .75}} />
            <stop offset="20%" style={{stopColor: '#8ecae6', stopOpacity: 1}} />
            <stop offset="70%" style={{stopColor: '#ffb703', stopOpacity: 1}} />
            <stop offset="90%" style={{stopColor: '#fb8500', stopOpacity: 1}} />
          </linearGradient>
          <path d={finalCurve} fill="url(#grad)" />
        </svg>
      )}
    </div>
  )
}