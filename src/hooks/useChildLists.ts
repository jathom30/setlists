import { useQuery } from "@tanstack/react-query"
import { SETLISTS_QUERY } from "queryKeys"
import { useParams } from "react-router-dom"
import { getSetlists } from "api/setlists"
import { Setlist } from "typings"

export const useChildLists = () => {
  const { id } = useParams()

  const setlistsQuery = useQuery(
    [SETLISTS_QUERY, id],
    async () => {
      const response = await getSetlists(id || '')
      return response.map(set => (set.fields)) as Setlist[]
    },
    {
      enabled: !!id
    }
  )

  return setlistsQuery
}