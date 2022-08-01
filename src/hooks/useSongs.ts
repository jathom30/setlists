import { useQuery } from "@tanstack/react-query"
import { getSongs } from "api"
import { SONGS_QUERY } from "queryKeys"
import { Song } from "typings"
import { useGetCurrentBand } from "./useGetCurrentBand"
import { v4 as uuid} from 'uuid'

export const missingSong: Song = {
  id: uuid(),
  length: 0,
  name: 'SONG NOT FOUND',
  bands: [''],
  is_cover: false,
  key_letter: '',
  is_minor: false,
  tempo: '',
}

export const useSongs = () => {
  const bandQuery = useGetCurrentBand()

  const bandId = bandQuery.data?.id

  const songsQuery = useQuery(
    [SONGS_QUERY, bandId],
      async () => {
      const response = await getSongs(bandId || '')
      return response.map(fieldSet => (fieldSet.fields)) as unknown as Song[]
    },
    {
      enabled: !!bandId
    }
  )

  // returns either the found song based on id or the "SONG NOT FOUND"
  const getSong = (id: string) => songsQuery?.data?.find(s => s.id === id) || missingSong

  return {
    songsQuery,
    getSong
  }
}