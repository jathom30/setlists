import React from "react";
import { AddBand, FlexBox } from "components";

export const AddBandRoute = () => {
  return (
    <div className="AddBandRoute">
      <FlexBox flexDirection="column" gap="1rem" padding="1rem">
        <h1>Welcome!</h1>
        <AddBand onSuccess={() => window.location.reload()} />
      </FlexBox>
    </div>
  )
}