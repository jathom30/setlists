import React, { ChangeEvent } from "react";
import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FlexBox, HeaderBox, Button, Group } from "components";
import { readSongCSV } from "utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Song } from "typings";
import { createSong } from "api";
import { SONGS_QUERY } from "queryKeys";
import { RateLimit } from "async-sema";
import { useNavigate } from "react-router-dom";
import { useGetCurrentBand } from "hooks";

export const SongImport = ({onClose}: {onClose: () => void}) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const bandQuery = useGetCurrentBand()
  const bandId = bandQuery.data?.id || ''

  const createSongsMutation = useMutation(async (songs: Omit<Song, 'id'>[]) => {
    const limit = RateLimit(5) // requests per second

    const responses = songs.map(async song => {
      await limit()
      const response = await createSong(song)
      return response[0].fields as unknown as Song
    })
    return Promise.allSettled(responses)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([SONGS_QUERY])
      navigate('/songs')
    }
  })

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (!file) return
    const csvText = await file.text()
    const songs = readSongCSV(csvText)
    const songsWithBand = songs.map(song => {
      return {
        ...song,
        bands: [bandId]
      }
    })
    createSongsMutation.mutate(songsWithBand)
  }

  return (
    <div className="SongImport">
      <FlexBox padding="1rem" flexDirection="column" gap="1rem">
        <HeaderBox>
          <h3>Import Song(s)</h3>
          <Button icon={faTimes} onClick={onClose} />
        </HeaderBox>
        <p>Download the csv template below, then upload a completed csv with as many songs as you'd like.</p>
        <Group>
            <FlexBox alignItems="center" justifyContent="center" padding="2rem">
              <input type="file" name="file" accept=".csv" onChange={handleChange} />
            </FlexBox>
        </Group>
        <FlexBox>
          <a href="/assets/songs_template.csv" download>
            <Button icon={faDownload}>Template</Button>
          </a>
        </FlexBox>
        <FlexBox justifyContent="flex-end" gap="1rem">
          <Button>Cancel</Button>
          <Button kind="primary">Upload</Button>
        </FlexBox>
      </FlexBox>
    </div>
  )
}