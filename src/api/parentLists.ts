import { base } from './setup'

const parentListBase = base(process.env.REACT_APP_AIRTABLE_PARENT_LIST_TABLE || '')

export const getParentLists = (bandId: string) => parentListBase.select({filterByFormula: `SEARCH("${bandId}", {bands})`}).all()
