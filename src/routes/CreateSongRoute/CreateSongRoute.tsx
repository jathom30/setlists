import { faCheckSquare, faSave, faSquare } from "@fortawesome/free-solid-svg-icons";
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
  const [keyLetter, setKeyLetter] = useState('')
  const [isMinor, setIsMinor] = useState<boolean>()
  const [tempo, setTempo] = useState('')
  const [isCover, setIsCover] = useState(false)
  const [isExcluded, setIsExcluded] = useState(false)
  const [isStarred, setIsStarred] = useState(false)
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
      is_excluded: isExcluded,
      key_letter: keyLetter,
      is_minor: isMinor || false,
      tempo,
      notes: note,
      is_starred: isStarred,
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

  const handleExcludeStar = (type: 'star' | 'exclude') => {
    if (type === 'star') {
      setIsStarred(prevStarred => {
        if (!prevStarred) {
          setIsExcluded(false)
        }
        return !prevStarred
      })
    } else {
      setIsExcluded(prevExcluded => {
        if (!prevExcluded) {
          setIsStarred(false)
        }
        return !prevExcluded
      })
    }
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
              <Input label="Name" value={name} onChange={setName} name="name" placeholder="Song name" />
              
              <Input label="Length (in minutes)" value={length} onChange={(val) => setLength(parseInt(val))} name="length" placeholder="Song length" />
              
              <FlexBox flexDirection="column" gap=".25rem">
                <Label>Key</Label>
                <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                  <Select
                    placeholder="Select a key..."
                    menuPortalTarget={document.body}
                    options={keyLetters.map(key => ({label: key, value: key}))}
                    onChange={option => {
                      if (!option) return
                      setKeyLetter(option.value)
                    }}
                  />
                  <Select
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
                <Label>Tempo</Label>
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
                <Button onClick={() => handleExcludeStar('exclude')} kind="text" icon={isExcluded ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Exclude from auto-generation</span>
                </Button>
                <Button onClick={() => handleExcludeStar('star')} kind="text" icon={isStarred ? faCheckSquare : faSquare}>
                  <span style={{fontWeight: 'normal', fontSize: '1rem'}}>Always include during auto-generation</span>
                </Button>
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