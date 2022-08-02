import { useQuery } from "@tanstack/react-query"
import { getBand } from "api"
import { BAND_QUERY } from "queryKeys"
import { Band } from "typings"
import { useUser } from "./useUser"

export const useGetCurrentBand = () => {
  const userQuery = useUser()
  const bandId = userQuery.data?.current_band_id

  const bandQuery = useQuery(
    [BAND_QUERY, bandId],
    async () => {
      if (!bandId) { return }
      const response = await getBand(bandId)
      return response[0].fields as Band
    }, {
      enabled: !!bandId,
      onSuccess: data => {
        document.title = `${data?.name} Setlists`
      }
    }
  )

  return bandQuery
}