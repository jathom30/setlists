import { useQuery } from "@tanstack/react-query"
import { SETLISTS_QUERY } from "queryKeys"
import { useParams } from "react-router-dom"
import { getSetlists } from "api/setlists"
import { Set } from "typings"
import {useState } from "react"

export const useSets = () => {
  const { setlistId } = useParams()
  const [sets, setSets] = useState<Record<string, string[]>>({})

  const setsQuery = useQuery(
    [SETLISTS_QUERY, setlistId],
    async () => {
      const response = await getSetlists(setlistId || '')
      return response.map(set => (set.fields)) as Set[]
    },
    {
      enabled: !!setlistId,
      onSuccess(data) {
        const transformed = data.reduce((all, set) => {
          return {
            ...all,
            [set.id]: set.songs
          }
        }, {})
        setSets(transformed)
      },
    }
  )

  return {setsQuery, sets}
}