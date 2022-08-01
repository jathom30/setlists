import { Set, Song } from 'typings'
import { base } from './setup'

const setsBase = base(process.env.REACT_APP_AIRTABLE_SETLISTS_TABLE || '')

export const getSets = (parentId: string) => setsBase.select({filterByFormula: `SEARCH("${parentId}", {parent_list})`}).all()

export const createSet = (setlist: Omit<Set, 'id'>) => setsBase.create([{fields: setlist}])

export const deleteSet = (setlistId: string) => setsBase.destroy(setlistId)

export const updateSets = (sets: Record<string, Song[]>) => {
  const formattedSets = Object.keys(sets).map(key => ({
    id: key,
    fields: {songs: sets[key].map(song => song.id)}
  }))
  return setsBase.update(formattedSets)
}
