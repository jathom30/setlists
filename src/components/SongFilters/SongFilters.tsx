import React, { useEffect, useState } from "react";
import { FlexBox, Button, Label, HeaderBox, Box } from "components";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { capitalizeFirstLetter } from "utils";
import { faCaretDown, faCaretUp, faCheckSquare, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './SongFilters.scss'
import { feels } from "songConstants";

const positions = ['opener', 'closer', 'other']
const coverOptions = ['Is a cover', 'Is an original']
const tempoOptions = ['ballad', 'down', 'medium', 'up', 'burner']

export const SongFilters = ({ onChange }: { onChange: (filters: Record<string, string[]>) => void }) => {
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [cover, setCover] = useState<string[]>([])
  const [selectedFeels, setSelectedFeels] = useState<string[]>([])
  const [selectedTempos, setSelectedTempos] = useState<string[]>([])

  useEffect(() => {
    onChange({
      position: selectedPositions,
      cover,
      feels: selectedFeels,
      tempos: selectedTempos
    })
  }, [cover, selectedFeels, selectedPositions, selectedTempos])

  return (
    <div className="SongFilters">
      <FlexBox flexDirection="column" gap=".25rem" padding="1rem">
        <Label>Filters</Label>
        <Filter label="Tempo" options={tempoOptions} selected={selectedTempos} onChange={setSelectedTempos} />
        <Filter label="Feels" options={feels} selected={selectedFeels} onChange={setSelectedFeels} />
        <Filter label="Cover" options={coverOptions} selected={cover} onChange={setCover} />
        <Filter label="Positions" options={positions} selected={selectedPositions} onChange={setSelectedPositions} />
        {/* <Label>Key</Label> */}
        {/* <Label>Setlist auto-generation importance</Label> */}
      </FlexBox>
    </div>
  )
}

const Filter = ({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (newOptions: string[]) => void;
}) => {
  const [showFilter, setShowFilter] = useState(true)
  const [showAllOptions, setShowAllOptions] = useState(false)

  const isSelected = (option: string) => selected.some(thing => thing === option)

  const handleClick = (option: string) => {
    if (selected.some(opt => opt === option)) {
      onChange(selected.filter(opt => opt !== option))
    } else {
      onChange([...selected, option])
    }
  }

  const hasExtraOptions = options.length > 4
  const slicedOptions = (hasExtraOptions && !showAllOptions) ? options.slice(0, 4) : options

  return (
    <div className="Filter">
      <FlexBox flexDirection="column" gap=".25rem">
        <button
          className="Button Button__secondary Filter__btn"
          onClick={() => setShowFilter(!showFilter)}
        >
          <Box padding="0 .25rem">
            <HeaderBox>
              {label}
              <FontAwesomeIcon icon={showFilter ? faCaretUp : faCaretDown} />
            </HeaderBox>
          </Box>
        </button>
        {showFilter && (
          <>
            {slicedOptions.map(option => (
              <Button
                key={option}
                kind="text"
                icon={isSelected(option) ? faCheckSquare : faSquare}
                justifyContent="flex-start"
                onClick={() => handleClick(option)}
              >
                {capitalizeFirstLetter(option)}
              </Button>
            ))}
            {hasExtraOptions && (
              <Button
                justifyContent="flex-start"
                icon={showAllOptions ? faMinus : faPlus}
                onClick={() => setShowAllOptions(!showAllOptions)}
              >
                Show {showAllOptions ? 'less' : 'all'}
              </Button>
            )}
          </>
        )}
      </FlexBox>
    </div>
  )
}