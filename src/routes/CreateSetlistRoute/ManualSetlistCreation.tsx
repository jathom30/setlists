import { Button, FlexBox, Input } from "components";
import React from "react";

export const ManualSetlistCreation = () => {
  return (
    <div className="ManualSetlistCreation">
      {/* <FlexBox flexDirection="column" gap="1rem">
        {(name || Object.keys(sets).length > 0) && hasAvailableSongs && (
          <Button kind="secondary" icon={faPlus} onClick={handleNewSet}>Create new set</Button>
        )}
        {!hasAvailableSongs && (
          <FlexBox flexDirection="column" gap=".5rem" alignItems="center">
            <span>All songs in use</span>
            <Link to="/create-song">
              <Button kind="secondary" icon={faPlus}>Create new song</Button>
            </Link>
          </FlexBox>
        )}
        {Object.keys(sets).length > 0 && (
          <FlexBox padding="1rem" flexDirection="column">
            <Button
              isDisabled={!isValid}
              isLoading={isLoading}
              kind="primary"
              type="submit"
              icon={!isLoading ? faSave : undefined}
            >
              Save Setlist
            </Button>
          </FlexBox>
        )}
      </FlexBox> */}
    </div>
  )
}