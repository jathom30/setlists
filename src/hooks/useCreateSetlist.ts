import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createParentList, createSetlist } from "api"
import { PARENT_LISTS_QUERY } from "queryKeys"
import { useIdentityContext } from "react-netlify-identity"
import { useNavigate } from "react-router-dom"
import { Song } from "typings"
import { useGetCurrentBand } from "./useGetCurrentBand"

export const useCreateSetlist = (sets: Record<string, Song[]>, name: string) => {
  const {user} = useIdentityContext()
  const bandQuery = useGetCurrentBand()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const createSetMutation = useMutation(async (parentId: string) => {
    const setIds = Object.keys(sets)
    const responses = setIds.map(async id => {
      const response = await createSetlist({
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

  const createSetlistMutation = useMutation(createParentList, {
    onSuccess: (data) => {
      const parentId = data[0].id
      createSetMutation.mutate(parentId)
    }
  })

  const onSubmit = () => {
    createSetlistMutation.mutate({
      name,
      updated_by: `${user?.user_metadata.firstName} ${user?.user_metadata.lastName}`,
      last_updated: (new Date()).toString(),
      bands: [bandQuery.data?.id || '']
    })
  }

  return {
    onSubmit,
    isLoading: createSetMutation.isLoading || createSetlistMutation.isLoading
  }
}