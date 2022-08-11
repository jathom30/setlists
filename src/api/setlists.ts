import { Setlist } from 'typings'
import { base } from './setup'

const setlistsBase = base(process.env.REACT_APP_AIRTABLE_PARENT_LIST_TABLE || '')

export const getSetlists = (bandId: string) => setlistsBase.select({filterByFormula: `SEARCH("${bandId}", {bands})`}).all()

export const getSetlist = (id: string) => setlistsBase.find(id)

export const updateSetlist = (params: {id: string, setlist: Partial<Setlist>}) => {
  const {id, setlist} = params
  return setlistsBase.update([{id, fields: setlist}])
}

export const createSetlist = (setlist: Omit<Setlist, 'id'>) => setlistsBase.create([{fields: setlist}])

export const deleteSetlist = (id: string) => setlistsBase.destroy(id)