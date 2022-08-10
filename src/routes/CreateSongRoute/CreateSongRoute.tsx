import { faCheckSquare, faCircleDot, faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { faCircle, faSquare } from "@fortawesome/free-regular-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSong } from "api";
import { AddNote, Breadcrumbs, Button, FlexBox, GridBox, HeaderBox, Input, Label, Loader, MaxHeightContainer, Modal, RouteWrapper, SongImport, Tempo } from "components";
import { useGetCurrentBand } from "hooks";
import React, { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { keyLetters, majorMinorOptions } from "songConstants";
import { capitalizeFirstLetter } from "utils";
import './CreateSongRoute.scss'
import { SONGS_QUERY } from "queryKeys";
import { Song, SongFeel } from "typings";
import { feels as songFeels } from "songConstants";

export const CreateSongRoute = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [length, setLength] = useState(0)
  const [keyLetter, setKeyLetter] = useState('C')
  const [isMinor, setIsMinor] = useState<boolean>(false)
  const [tempo, setTempo] = useState(3)
  const [isCover, setIsCover] = useState(false)
  const [position, setPosition] = useState<'opener' | 'closer'>()
  const [rank, setRank] = useState<'exclude' | 'star'>()
  const [note, setNote] = useState('')
  const [feels, setFeels] = useState<SongFeel[]>()

  const [showImport, setShowImport] = useState(false)

  const queryClient = useQueryClient()
  const bandQuery = useGetCurrentBand()
  const bandId = bandQuery.data?.id || ''

  const createSongMutation = useMutation(createSong, {
    onMutate: async (newSong) => {
      await queryClient.cancelQueries([SONGS_QUERY, bandId])

      const prevSongs = queryClient.getQueryData<Song[]>([SONGS_QUERY, bandId])

      if (prevSongs) {
        queryClient.setQueryData([SONGS_QUERY, bandId], [...prevSongs, newSong])
      }
      return { prevSongs }
    },
    onSuccess: (data) => {
      navigate(`/songs/${data[0].id}`)
    }
  })

  const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createSongMutation.mutate({
      name,
      length,
      bands: [bandId],
      is_cover: isCover,
      key_letter: keyLetter,
      is_minor: isMinor || false,
      tempo,
      notes: note,
      position,
      rank,
      feel: feels,
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
    <RouteWrapper>
      <div className="CreateSongRoute">
        <MaxHeightContainer
          fullHeight
          header={
            <HeaderBox>
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
              <Button kind="secondary" icon={faUpload} isRounded onClick={() => setShowImport(true)}>Import song(s)</Button>
            </HeaderBox>
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
                      value={{ label: keyLetter, value: keyLetter }}
                      placeholder="Select a key..."
                      menuPortalTarget={document.body}
                      options={keyLetters.map(key => ({ label: key, value: key }))}
                      onChange={option => {
                        if (!option) return
                        setKeyLetter(option.value)
                      }}
                    />
                    <Select
                      value={{ label: isMinor ? 'Minor' : 'Major', value: isMinor }}
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
                  <GridBox gap="1rem" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" alignItems="center">
                    <FlexBox flexDirection="column" gap=".25rem">
                      <Label required>Tempo</Label>
                      <Tempo value={tempo} onChange={setTempo} />
                    </FlexBox>
                    <FlexBox flexDirection="column" gap="0.25rem">
                      <Label>Feel</Label>
                      <Select
                        isMulti
                        defaultValue={feels && feels.map(f => ({ label: capitalizeFirstLetter(f), value: f }))}
                        onChange={newFeels => {
                          if (!newFeels) return
                          setFeels(newFeels.map(f => f.value))
                        }}
                        options={songFeels.map(feel => ({ label: capitalizeFirstLetter(feel), value: feel }))}
                      />
                    </FlexBox>
                  </GridBox>
                </FlexBox>

                <FlexBox flexDirection="column" alignItems="flex-start" gap=".25rem">
                  <Label>Cover</Label>
                  <Button onClick={() => setIsCover(!isCover)} kind="text" icon={isCover ? faCheckSquare : faSquare}>
                    <span style={{ fontWeight: 'normal', fontSize: '1rem' }}>Is a cover</span>
                  </Button>
                </FlexBox>

                <FlexBox gap=".25rem" flexDirection="column">
                  <Label>Position</Label>
                  <FlexBox gap="1rem">
                    <Button onClick={() => setPosition('opener')} kind="text" icon={position === 'opener' ? faCircleDot : faCircle}>Opener</Button>
                    <Button onClick={() => setPosition('closer')} kind="text" icon={position === 'closer' ? faCircleDot : faCircle}>Closer</Button>
                    <Button onClick={() => setPosition(undefined)} kind="text" icon={!position ? faCircleDot : faCircle}>Other</Button>
                  </FlexBox>
                </FlexBox>

                <FlexBox gap=".25rem" flexDirection="column">
                  <Label>Setlist auto-generation importance</Label>
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
        {showImport && (
          <Modal offClick={() => setShowImport(false)}>
            <div className="CreateSongRoute__modal">
              <SongImport onClose={() => setShowImport(false)} />
            </div>
          </Modal>
        )}
      </div>
    </RouteWrapper>
  )
}