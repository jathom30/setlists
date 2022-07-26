export type Band = {
  id: string
  name: string
  band_code: string
  parent_list?: string[]
  songs?: string[]
}

export type ParentList = {
  id: string
  name: string
  sets?: string[]
  last_updated: string
  updated_by: string
  bands: string[]
}

export type Setlist = {
  id: string
  songs: string[]
  parent_list: string[]
}

export type Song = {
  id: string
  length: number
  setlists?: number[]
  name: string
  bands: string[]
  is_cover: boolean
  is_excluded: boolean
  notes?: string
  key_letter: string
  is_minor: boolean
  tempo: string
}