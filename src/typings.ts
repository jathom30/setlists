export type Band = {
  id: string
  name: string
  band_code: string
  parent_list?: string[]
}

export type ParentList = {
  id: string
  name: string
  sets: string[]
}