import { FieldSet } from "airtable";
import { Band } from "typings";
import { base } from "./setup";

const bandsBase = base(process.env.REACT_APP_AIRTABLE_ORGS_TABLE || '')

export const createBand = (band: Omit<Band, 'id'>) => bandsBase.create([{fields: band}])

export const deleteBand = (id: string) => bandsBase.destroy(id)

// get band by band id (should be a single band, though api returns an array)
export const getBand = (bandId: string) => bandsBase.select({filterByFormula: `SEARCH("${bandId}", {id})`}).all()

export const getBandByCode = (bandCode: string) => bandsBase.select({filterByFormula: `SEARCH("${bandCode}", {band_code})`}).all()

// get band by user id (can be multiple bands)
export const getBands = (userId: string) => bandsBase.select({filterByFormula: `SEARCH("${userId}", {users})`}).all()

export const updateBand = (band: Band) => {
  const {id, ...fields} = band
  return bandsBase.update([{id, fields: fields as unknown as FieldSet}])
}
