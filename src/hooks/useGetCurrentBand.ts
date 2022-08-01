import { useQuery } from "@tanstack/react-query"
import { getBand } from "api"
import { BAND_QUERY } from "queryKeys"
import { useState } from "react"
import { Band } from "typings"
import { useUser } from "./useUser"

export const useGetCurrentBand = () => {
  const [bandCode, setBandCode] = useState('')
  useUser(data => setBandCode(data.current_band_code || ''))

  const bandQuery = useQuery(
    [BAND_QUERY, bandCode],
    async () => {
      if (!bandCode) { return }
      const response = await getBand(bandCode)
      return response[0].fields as Band
    }, {
      enabled: !!bandCode
    }
  )

  return bandQuery
}