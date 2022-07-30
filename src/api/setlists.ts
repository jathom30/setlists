import { Set, Song } from 'typings'
import { base } from './setup'

const setlistBase = base(process.env.REACT_APP_AIRTABLE_SETLISTS_TABLE || '')

export const getSetlists = (parentId: string) => setlistBase.select({filterByFormula: `SEARCH("${parentId}", {parent_list})`}).all()

export const createSetlist = (setlist: Omit<Set, 'id'>) => setlistBase.create([{fields: setlist}])

export const deleteSetlist = (setlistId: string) => setlistBase.destroy(setlistId)

export const updateSetlists = (sets: Record<string, Song[]>) => {
  const formattedSets = Object.keys(sets).map(key => ({
    id: key,
    fields: {songs: sets[key].map(song => song.id)}
  }))
  return setlistBase.update(formattedSets)
}
