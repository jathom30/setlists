import React from "react";
import { FlexBox } from "components";
import { capitalizeFirstLetter, createPaths } from "utils";

export const PieChart = ({ slices }: { slices: { percent: number; name: string; color: string }[] }) => {
  const paths = createPaths(slices)
  return (
    <FlexBox gap="1rem" alignItems="center" justifyContent="center">
      <svg version="1.1" preserveAspectRatio="xMinYMin meet" viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }}>
        {paths.map(path => (
          <path key={path.pathData} d={path.pathData} fill={path.color} />
        ))}
      </svg>
      <FlexBox gap="1rem" flexDirection="column">
        {paths.map(path => (
          <FlexBox gap=".25rem" key={path.pathData} alignItems="center">
            <span style={{ background: path.color, width: '1rem', height: '1rem' }} />
            {capitalizeFirstLetter(path.name)} {Math.round(path.percent)}%
          </FlexBox>
        ))}
      </FlexBox>
    </FlexBox>
  )
}