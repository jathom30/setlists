import React, { useState } from "react";
import { FlexBox, Button, Popover } from "components";
import { Link, useNavigate } from "react-router-dom";
import { useIdentityContext } from "react-netlify-identity";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBand } from "api";
import { Band } from "typings";
import './Header.scss'

export const Header = () => {
  const {user} = useIdentityContext()
  const [showSelect, setShowSelect] = useState(false)

  const bandCode: string[] = user?.user_metadata.bandCode
  const currentBand: string = user?.user_metadata.currentBand

  const getBandQuery = useQuery(
    ['band', currentBand],
    async () => {
      if (!currentBand) { return }
      const response = await getBand(currentBand)
      const band = {
        id: response[0].id,
        name: response[0].fields.name,
        parent_list: response[0].fields.parent_list,
        key: response[0].fields.band_code,
      }
      return band
    }, {
      enabled: !!currentBand
    }
  )

  const band = getBandQuery.data as unknown as Band | undefined

  // const updateUserMetaDataMutation = useMutation(updateUser, {
  //   onSuccess: () => {
  //     window.location.reload()
  //   }
  // })

  // const removeAllBands = () => updateUserMetaDataMutation.mutate({
  //   data: {
  //     bandCode: [],
  //     currentBand: ''
  //   }
  // })


  return (
    <div className="Header">
      <FlexBox alignItems="center" justifyContent="space-between" gap="1rem" padding="1rem">
        <Link to="/">Home</Link>
        <FlexBox gap="1rem">
          {/* <Button kind="danger" onClick={removeAllBands}>Delete ALL</Button> */}
          <Popover
            align="end"
            content={<BandSelect onSelect={() => setShowSelect(false)} bandCodes={bandCode} />}
            position={['bottom']}
            isOpen={showSelect}
          >
            <div>
              <Button kind="secondary" onClick={() => setShowSelect(!showSelect)}>{band?.name}</Button>
            </div>
          </Popover>
        </FlexBox>
      </FlexBox>
    </div>
  )
}

const BandSelect = ({onSelect, bandCodes}: {onSelect: () => void; bandCodes: string[]}) => {
  const {user, updateUser} = useIdentityContext()
  const navigate = useNavigate()

  const currentBand: string = user?.user_metadata.currentBand

  const getBandsQuery = useQuery(
    ['bands', bandCodes],
    async () => {
      const response = bandCodes.map(async code => {
        const res = await getBand(code)
        return res
      })
      const bandsRes = Promise.all(response)
      return (await bandsRes).reduce((acc: {name: string; band_code: string}[], band) => {
        if (band.length < 1) {
          return acc
        }
        const bandFields = band[0].fields as Band
        return [
          ...acc,
          {
            name: bandFields.name,
            band_code: bandFields.band_code
          }
        ]
      }, [])
    }
  )

  const updateUserMetaDataMutation = useMutation(updateUser, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  const handleSelectBand = (band: string) => {
    updateUserMetaDataMutation.mutate({
      data: {
        currentBand: band
      }
    })
    onSelect()
  }

  const bands = getBandsQuery.data

  const handleRouteToNew = () => {
    navigate('/user-settings', {replace: true})
    onSelect()
  }

  return (
    <div className="BandSelect">
      <FlexBox flexDirection="column" gap=".5rem">
        {bands?.map(band => (
          <Button kind={currentBand === band.band_code ? 'primary' : 'default'} key={band.band_code} onClick={() => handleSelectBand(band.band_code)}>{band.name}</Button>
        ))}
        <Button onClick={handleRouteToNew}>Create New</Button>
      </FlexBox>
    </div>
  )
}