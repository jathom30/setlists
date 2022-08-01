import { FieldSet } from 'airtable'
import { User } from 'typings'
import { base } from './setup'

const usersBase = base(process.env.REACT_APP_AIRTABLE_USERS_TABLE || '')

export const createUser = (user: Omit<User, 'id'>) => usersBase.create([{fields: user}])

export const getUser = (identityId: string) => usersBase.select({filterByFormula: `SEARCH("${identityId}", {identity_id})`}).all()

export const getUsersByBand = (bandId: string) => usersBase.select({filterByFormula: `SEARCH("${bandId}", {bands})`}).all()

export const updateUser = (params: {id: string, user: Partial<User>}) => {
  const {id, user} = params
  return usersBase.update([{id, fields: user as unknown as FieldSet}])
}