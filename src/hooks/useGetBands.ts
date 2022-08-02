import { useQuery } from "@tanstack/react-query"
import { getBands } from "api"
import { Band } from "typings";
import { BANDS_QUERY } from "queryKeys";
import { useUser } from "./useUser";

export const useGetBands = () => {
  const userQuery = useUser()
  const userId = userQuery.data?.id

  const bandsQuery = useQuery(
    [BANDS_QUERY, userId],
    async () => {
      const response = await getBands(userId || '')
      return response.map(data => data.fields) as Band[]
    },
    {
      enabled: !!userId,
    }
  )

  return bandsQuery
}