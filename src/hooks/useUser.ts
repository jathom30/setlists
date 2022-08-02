import { useQuery } from "@tanstack/react-query"
import { getUser } from "api"
import { USER_QUERY } from "queryKeys"
import { useIdentityContext } from "react-netlify-identity"
import { User } from "typings"

export const useUser = () => {
  const { user } = useIdentityContext()

  const userQuery = useQuery([USER_QUERY, user?.id], async () => {
    const response = await getUser(user?.id || '')
    return response[0].fields as User
  }, {
    enabled: !!user?.id
  })

  return userQuery
}