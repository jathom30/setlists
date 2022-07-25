import { useQuery } from "@tanstack/react-query"
import { getBand } from "api"
import { BAND_QUERY } from "queryKeys"
import { useIdentityContext } from "react-netlify-identity"

export const useGetCurrentBand = () => {
  const {user} = useIdentityContext()
  const currentBand: string | undefined = user?.user_metadata.currentBand

  const bandQuery = useQuery(
    [BAND_QUERY, currentBand],
    async () => {
      if (!currentBand) { return }
      const response = await getBand(currentBand)
      const band = {
        id: response[0].id,
        name: response[0].fields.name,
        parent_list: response[0].fields.parent_list,
        key: response[0].fields.band_code,
      }
      return band
    }, {
      enabled: !!currentBand
    }
  )

  return bandQuery
}