import { FieldSet } from 'airtable'
import { Song } from 'typings'
import { base } from './setup'

const songsBase = base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '')

export const getSongs = (bandId: string) => songsBase.select({filterByFormula: `SEARCH("${bandId}", {bands})`}).all()

export const getSong = (songId: string) => songsBase.find(songId)

export const deleteSong = (songId: string) => songsBase.destroy(songId)

export const updateSong = (song: Song) => {
  const {id, ...fields} = song
  return songsBase.update([{id, fields: fields as unknown as FieldSet}])
} 