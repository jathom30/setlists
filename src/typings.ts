export type Band = {
  id: string
  name: string
  band_code: string
  parent_list?: string[]
  songs?: string[]
}

export type Setlist = {
  id: string
  name: string
  sets?: string[]
  last_updated: string
  updated_by: string
  bands: string[]
}

export type Set = {
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
  is_starred: boolean
}

export type SetlistCreationType = 'auto' | 'manual'

export type SetlistFilters = {
  noCovers: boolean
  onlyCovers: boolean
  noBallads: boolean
}
export type SetlistSettings = {
  filters: SetlistFilters
  setCount: number
  setLength: number
}