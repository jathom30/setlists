import { useQuery } from "@tanstack/react-query"
import { getBand } from "api"
import { BAND_QUERY } from "queryKeys"
import { useState } from "react"
import { Band } from "typings"
import { useUser } from "./useUser"

export const useGetCurrentBand = () => {
  const [bandId, setBandId] = useState('')
  useUser(data => setBandId(data.current_band_id || ''))

  const bandQuery = useQuery(
    [BAND_QUERY, bandId],
    async () => {
      if (!bandId) { return }
      const response = await getBand(bandId)
      return response[0].fields as Band
    }, {
      enabled: !!bandId
    }
  )

  return bandQuery
}