import { useQuery } from "@tanstack/react-query"
import { getBand } from "api"
import { useIdentityContext } from "react-netlify-identity"
import { RateLimit } from "async-sema";
import { Band } from "typings";
import { BANDS_QUERY } from "queryKeys";

export const useGetBands = () => {
  const {user} = useIdentityContext()
  const bandCodes: string[] = user?.user_metadata.bandCode
  const limit = RateLimit(5)

  const bandsQuery = useQuery(
    [BANDS_QUERY, bandCodes],
    async () => {
      const response = bandCodes.map(async code => {
        await limit()
        const res = await getBand(code)
        return res
      })
      const bandsRes = Promise.all(response)
      return (await bandsRes).reduce((acc: Band[], band) => {
        if (band.length < 1) {
          return acc
        }
        const bandFields = band[0].fields as Band
        return [
          ...acc,
          {
            id: band[0].id,
            name: bandFields.name,
            band_code: bandFields.band_code
          }
        ]
      }, [])
    }
  )

  return bandsQuery
}