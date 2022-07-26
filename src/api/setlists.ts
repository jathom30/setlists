import { Setlist } from 'typings'
import { base } from './setup'

const setlistBase = base(process.env.REACT_APP_AIRTABLE_SETLISTS_TABLE || '')

export const getSetlists = (parentId: string) => setlistBase.select({filterByFormula: `SEARCH("${parentId}", {parent_list})`}).all()

export const createSetlist = (setlist: Omit<Setlist, 'id'>) => setlistBase.create([{fields: setlist}])