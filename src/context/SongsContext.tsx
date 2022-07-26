import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getSongs } from "api";
import { useGetCurrentBand } from "hooks";
import { SONGS_QUERY } from "queryKeys";
import React, { createContext, ReactNode } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Song } from "typings";

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

  const getSong = (id: string) => songsQuery?.data?.find(s => s.id === id)

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