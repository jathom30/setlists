import { faCheckSquare, faCircleDot, faSave } from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { createSong } from "api";
import { AddNote, Breadcrumbs, Button, FlexBox, GridBox, Input, Label, Loader, MaxHeightContainer } from "components";
import { useGetCurrentBand } from "hooks";
import React, { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { keyLetters, majorMinorOptions, tempos } from "songConstants";
import { capitalizeFirstLetter } from "utils";
import './CreateSongRoute.scss'

export const CreateSongRoute = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [length, setLength] = useState(0)
  const [keyLetter, setKeyLetter] = useState('C')
  const [isMinor, setIsMinor] = useState<boolean>(false)
  const [tempo, setTempo] = useState('')
  const [isCover, setIsCover] = useState(false)
  const [position, setPosition] = useState<'opener' | 'closer'>()
  const [rank, setRank] = useState<'exclude' | 'star'>()
  const [note, setNote] = useState('')


  const bandQuery = useGetCurrentBand()

  const createSongMutation = useMutation(createSong, {
    onSuccess: () => {
      navigate('/songs')
    }
  })

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createSongMutation.mutate({
      name,
      length,
      bands: [bandQuery.data?.id || ''],
      is_cover: isCover,
      key_letter: keyLetter,
      is_minor: isMinor || false,
      tempo,
      notes: note,
      position,
      rank
    })
  }

  const isValid = name && length > 0 && keyLetter && isMinor !== undefined && tempo

  if (bandQuery.isLoading) {
    return (
      <FlexBox padding="1rem" alignItems="center" justifyContent="center">
        <Loader size="l" />
      </FlexBox>
    )
  }

  return (
    <div className="CreateSongRoute">
      <MaxHeightContainer
        fullHeight
        header={
          <FlexBox padding="1rem">
            <Breadcrumbs
              crumbs={[
                {
                  to: '/songs',
                  label: 'Songs'
                },
                {
                  to: '/create-song',
                  label: 'Create song'
                }
              ]}
            />
          </FlexBox>
        }
      >
        <FlexBox padding="1rem" gap="1rem" flexDirection="column">
          <form action="submit">
            <FlexBox gap="1rem" flexDirection="column">
              <Input required label="Name" value={name} onChange={setName} name="name" placeholder="Song name" />
              
              <Input required label="Length (in minutes)" value={length} onChange={(val) => setLength(parseInt(val))} name="length" placeholder="Song length" />
              
              <FlexBox flexDirection="column" gap=".25rem">
                <Label required>Key</Label>
                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <Select
                    value={{label: keyLetter, value: keyLetter}}
                    placeholder="Select a key..."
                    menuPortalTarget={document.body}
                    options={keyLetters.map(key => ({label: key, value: key}))}
                    onChange={option => {
                      if (!option) return
                      setKeyLetter(option.value)
                    }}
                  />
                  <Select
                    value={{label: isMinor ? 'Minor' :'Major', value: isMinor}}
                    placeholder="Major or minor..."
                    menuPortalTarget={document.body}
                    options={majorMinorOptions}
                    onChange={option => {
                      if (!option) return
                      setIsMinor(option.value)
                    }}
                  />
                </GridBox>
              </FlexBox>
              
              <FlexBox flexDirection="column" gap=".25rem">
                <Label required>Tempo</Label>
                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <Select
                    placeholder="Select a tempo..."
                    menuPortalTarget={document.body}
                    options={tempos.map(key => ({label: capitalizeFirstLetter(key), value: key}))}
                    onChange={option => {
                      if (!option) return
                      setTempo(option.value)
                    }}
                  />
                </GridBox>
              </FlexBox>

              <FlexBox flexDirection="column" alignItems="flex-start"  gap="1rem">
                <Button onClick={() => setIsCover(!isCover)} kind="text" icon={isCover ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Is a cover</span>
                </Button>
              </FlexBox>

              <FlexBox gap=".25rem" flexDirection="column">
                <Label required>Position</Label>
                <FlexBox gap="1rem">
                  <Button onClick={() => setPosition('opener')} kind="text" icon={position === 'opener' ? faCircleDot : faCircle}>Opener</Button>
                  <Button onClick={() => setPosition('closer')} kind="text" icon={position === 'closer' ? faCircleDot : faCircle}>Closer</Button>
                  <Button onClick={() => setPosition(undefined)} kind="text" icon={!position ? faCircleDot : faCircle}>Other</Button>
                </FlexBox>
              </FlexBox>

              <FlexBox gap=".25rem" flexDirection="column">
                <Label required>Setlist auto-generation importance</Label>
                <FlexBox gap="1rem">
                  <Button onClick={() => setRank('exclude')} kind="text" icon={rank === 'exclude' ? faCircleDot : faCircle}>Always exclude</Button>
                  <Button onClick={() => setRank('star')} kind="text" icon={rank === 'star' ? faCircleDot : faCircle}>Always include</Button>
                  <Button onClick={() => setRank(undefined)} kind="text" icon={!rank ? faCircleDot : faCircle}>Other</Button>
                </FlexBox>
              </FlexBox>

              <FlexBox flexDirection="column" gap=".25rem">
                <Label>Notes</Label>
                <AddNote onSave={setNote} />
              </FlexBox>
              
              <Button type="submit" kind="primary" icon={faSave} onClick={handleSave} isDisabled={!isValid}>Save song</Button>
            </FlexBox>
          </form>
        </FlexBox>
      </MaxHeightContainer>
    </div>
  )
}