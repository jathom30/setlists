import React, { useState } from "react";
import { FlexBox, Button, Popover } from "components";
import { Link } from "react-router-dom";
import { useIdentityContext } from "react-netlify-identity";
import { useMutation } from "@tanstack/react-query";

export const Header = () => {
  const [showSelect, setShowSelect] = useState(false)
  return (
    <div className="Header">
      <FlexBox alignItems="center" justifyContent="space-between" gap="1rem" padding="1rem">
        <Link to="/">Home</Link>
        <Popover
          align="end"
          content={<BandSelect onSelect={() => setShowSelect(false)} />}
          position={['bottom']}
          isOpen={showSelect}
        >
          <div>
            <Button onClick={() => setShowSelect(!showSelect)}>open</Button>
          </div>
        </Popover>
      </FlexBox>
    </div>
  )
}

const BandSelect = ({onSelect}: {onSelect: () => void}) => {
  const {user, updateUser} = useIdentityContext()

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

  const bands: string[] = user?.user_metadata.bandCode

  return (
    <div className="BandSelect">
      <FlexBox flexDirection="column" gap="1rem">
        {bands.map(band => (
          <Button key={band} onClick={() => handleSelectBand(band)}>{band}</Button>
        ))}
      </FlexBox>
    </div>
  )
}