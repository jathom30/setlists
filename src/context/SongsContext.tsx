import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSongs } from "api";
import { useGetCurrentBand } from "hooks";
import { SONGS_QUERY } from "queryKeys";
import React, { createContext, ReactNode } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Song } from "typings";
import { v4 as uuid} from 'uuid'

export const missingSong: Song = {
  id: uuid(),
  length: 0,
  name: 'SONG NOT FOUND',
  bands: [''],
  is_cover: false,
  is_excluded: false,
  key_letter: '',
  is_minor: false,
  tempo: '',
  is_starred: false
}

type SongsContextType = {
  songsQuery: UseQueryResult<Song[], unknown>;
  getSong: (id: string) => Song | undefined;
  isLoading: boolean
}

export const SongsContext = createContext<SongsContextType | null>(null)

export const SongsContextProvider = ({children}: {children: ReactNode}) => {
  const {isLoggedIn} = useIdentityContext()
  const bandQuery = useGetCurrentBand()

  const bandId = bandQuery.data?.id

  const songsQuery = useQuery(
    [SONGS_QUERY, bandId],
      async () => {
      const response = await getSongs(bandId || '')
      return response.map(fieldSet => (fieldSet.fields)) as unknown as Song[]
    },
    {
      enabled: isLoggedIn && !!bandId
    }
  )

  const getSong = (id: string) => songsQuery?.data?.find(s => s.id === id) || missingSong

  const value = {
    songsQuery,
    getSong,
    isLoading: songsQuery.isLoading
  }

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  )
}