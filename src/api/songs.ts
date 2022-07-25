import { base } from './setup'

const songsBase = base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '')

export const getSongs = (bandId: string) => songsBase.select({filterByFormula: `SEARCH("${bandId}", {bands})`}).all()