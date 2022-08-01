import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSetlist, createSet } from "api"
import { PARENT_LISTS_QUERY } from "queryKeys"
import { useNavigate } from "react-router-dom"
import { Song } from "typings"
import { useGetCurrentBand } from "./useGetCurrentBand"
import { useUser } from "./useUser"

export const useCreateSetlist = (sets: Record<string, Song[]>, name: string) => {
  const bandQuery = useGetCurrentBand()
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
      queryClient.invalidateQueries([PARENT_LISTS_QUERY])
      navigate('/setlists')
    }
  })

  const createSetlistMutation = useMutation(createSetlist, {
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetMutation.mutate(parentId)
    }
  })

  const onSubmit = () => {
    createSetlistMutation.mutate({
      name,
      updated_by: `${user?.first_name} ${user?.last_name}`,
      last_updated: (new Date()).toString(),
      bands: [bandQuery.data?.id || '']
    })
  }

  return {
    onSubmit,
    isLoading: createSetMutation.isLoading || createSetlistMutation.isLoading
  }
}