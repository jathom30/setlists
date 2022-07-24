import { useMutation } from "@tanstack/react-query";
import { Input } from "components";
import React, { FormEvent, useState } from "react";
import { useIdentityContext } from "react-netlify-identity";

export const UserRoute = () => {
  const {user, updateUser} = useIdentityContext()

  const bands = user?.user_metadata.bandCode
  const [newBand, setNewBand] = useState('')

  const updateUserMetaDataMutation = useMutation(updateUser)

  const handleNewBand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateUserMetaDataMutation.mutate({ data: {
      bandCode: [...bands, newBand]
    }})
  }

  return (
    <div className="UserRoute">
      <h1>User Settings</h1>
      <form action="submit" onSubmit={handleNewBand}>
        <Input label="Add band" value={newBand} onChange={setNewBand} name="new-band" />
      </form>

      {bands.map((band: string) => (
        <p key={band}>{band}</p>
      ))}
    </div>
  )
}