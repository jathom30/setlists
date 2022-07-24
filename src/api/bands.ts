import { Band } from "typings";
import { base } from "./setup";

const bandsBase = base(process.env.REACT_APP_AIRTABLE_ORGS_TABLE || '')

export const createBand = (band: Band) => bandsBase.create([{fields: band}])

export const getBand = (bandCode: string) => bandsBase.select({filterByFormula: `SEARCH("${bandCode}", {band_code})`}).all()
