import { TooltipContent, Tooltip } from "components";
import { capitalizeFirstLetter } from "utils";
import React from "react";
import './Dial.scss'

type Tempo = 'ballad' | 'chill' | 'medium' | 'up' | 'burner'
export const Dial = ({ tempo }: { tempo: Tempo }) => {
  return (
    <Tooltip
      content={
        <TooltipContent>
          <span>Tempo: <strong>{capitalizeFirstLetter(tempo)}</strong></span>
        </TooltipContent>
      }
    >
      <svg className={`Dial Dial--${tempo}`} viewBox="0 0 226 226" xmlSpace="preserve" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2">
        <path className="Dial__knob" d="M112.516 0c62.1 0 112.517 50.417 112.517 112.516 0 62.1-50.417 112.517-112.517 112.517C50.417 225.033 0 174.616 0 112.516 0 50.417 50.417 0 112.516 0Zm-12.5 90.866v-65.85c0-6.903 5.597-12.5 12.5-12.5 6.904 0 12.5 5.597 12.5 12.5v65.85c7.47 4.324 12.5 12.405 12.5 21.65 0 13.798-11.202 25-25 25-13.797 0-25-11.202-25-25 0-9.245 5.031-17.326 12.5-21.65Z" />
      </svg>
    </Tooltip>
  )
}