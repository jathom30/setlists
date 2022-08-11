import React from "react";
import { FlexBox, HeaderBox } from "components/Box";
import { heatColors } from "songConstants";
import './RatioBar.scss'

export const RatioBar = ({ ratio }: { ratio: Record<'start' | 'stop', { label: string; amount: number }> }) => {
  const { start, stop } = ratio
  const percent = (start.amount / (start.amount + stop.amount)) * 100
  return (
    <FlexBox flexDirection="column" gap=".25rem">
      <div className="RatioBar" style={{ background: heatColors[1] }}>
        <div className="RatioBar__inner" style={{ background: heatColors[2], width: `${percent}%` }} />
      </div>
      <HeaderBox>
        <FlexBox alignItems="center" gap=".25rem">
          <span style={{ background: heatColors[2], width: '1rem', height: '1rem' }} />
          <span>{start.label} {Math.round(percent)}%</span>
        </FlexBox>
        <FlexBox alignItems="center" gap=".25rem">
          <span style={{ background: heatColors[1], width: '1rem', height: '1rem' }} />
          <span>{stop.label} {Math.round(100 - percent)}%</span>
        </FlexBox>
      </HeaderBox>
    </FlexBox>
  )
}