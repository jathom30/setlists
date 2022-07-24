import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBand } from "api";
import { useIdentityContext } from "react-netlify-identity";
import { Band } from "typings";

export const BandRoute = () => {
  const {user} = useIdentityContext()

  const getBandQuery = useQuery(
    ['band', user?.user_metadata.currentBand],
    async () => {
      if (!user?.user_metadata.currentBand) { return }
      const response = await getBand(user?.user_metadata.currentBand)
      const band = {
        id: response[0].id,
        name: response[0].fields.name,
        parent_list: response[0].fields.parent_list,
        key: response[0].fields.band_code,
      }
      return band
    }, {
      enabled: !!user?.user_metadata.currentBand
    }
  )

  const band = getBandQuery.data as unknown as Band | undefined

  return (
    <div className="BandRoute">
      <h1>Band Settings</h1>
      <h2>{band?.name}</h2>
    </div>
  )
}