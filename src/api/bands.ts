import { FieldSet } from "airtable";
import { Band } from "typings";
import { base } from "./setup";

const bandsBase = base(process.env.REACT_APP_AIRTABLE_ORGS_TABLE || '')

export const createBand = (band: Omit<Band, 'id'>) => bandsBase.create([{fields: band}])

export const deleteBand = (id: string) => bandsBase.destroy(id)

export const getBand = (bandCode: string) => bandsBase.select({filterByFormula: `SEARCH("${bandCode}", {band_code})`}).all()

export const updateBand = (band: Band) => {
  const {id, ...fields} = band
  return bandsBase.update([{id, fields: fields as unknown as FieldSet}])
}
