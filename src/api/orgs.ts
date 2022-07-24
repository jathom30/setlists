import { base } from "./setup";

const orgsBase = base(process.env.REACT_APP_AIRTABLE_ORGS_TABLE || '')

export const getOrg = (userId: string) => orgsBase.select({filterByFormula: `SEARCH("${userId}", {user_id})`}).all()