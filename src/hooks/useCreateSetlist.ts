import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSetlist, createSet } from "api"
import { PARENT_LISTS_QUERY } from "queryKeys"
import { useNavigate } from "react-router-dom"
import { Setlist, Song } from "typings"
import { useGetCurrentBand } from "./useGetCurrentBand"
import { useUser } from "./useUser"

export const useCreateSetlist = (sets: Record<string, Song[]>, name: string) => {
  const bandQuery = useGetCurrentBand()
  const bandId = bandQuery.data?.id
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const userQuery = useUser()
  const user = userQuery.data

  const createSetMutation = useMutation(async (parentId: string) => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await createSet({
        songs: sets[id].map(song => song.id),
        parent_list: [parentId],
      })
      return response
    })
    return Promise.allSettled(responses)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries([PARENT_LISTS_QUERY, bandId])
    }
  })

  const createSetlistMutation = useMutation(createSetlist, {
    onMutate: async (newSetlist) => {
      await queryClient.cancelQueries([PARENT_LISTS_QUERY, bandId])

      const prevSetlists = queryClient.getQueryData<Setlist[]>([PARENT_LISTS_QUERY, bandId])

      if (prevSetlists) {
        queryClient.setQueryData([PARENT_LISTS_QUERY, bandId], [...prevSetlists, newSetlist])
      }
      return { prevSetlists }
    },
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetMutation.mutate(parentId, {
        onSuccess: (data) => {
          navigate(`/setlists/${parentId}`)
        }
      })
    }
  })

  const onSubmit = () => {
    createSetlistMutation.mutate({
      name,
      updated_by: `${user?.first_name} ${user?.last_name}`,
      last_updated: (new Date()).toString(),
      bands: [bandId || '']
    })
  }

  return {
    createSetMutation,
    onSubmit,
    isLoading: createSetMutation.isLoading || createSetlistMutation.isLoading
  }
}