import React from "react";
import { faHammer, faMagicWandSparkles, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, FlexBox, GridBox } from "components";
import { Link } from "react-router-dom";
import { useSongs } from "hooks";

export const TypeSelection = () => {

  const {songsQuery} = useSongs()

  
  if (songsQuery.isSuccess) {
    const noSongs = songsQuery.data.length === 0
    return (
      <div className="TypeSelection">
        {noSongs ? (
          <FlexBox flexDirection="column" padding="1rem" gap="1rem" alignItems="center">
            <FlexBox flexDirection="column" alignItems="center">
              <p><strong>Looks like this band doesn't have any songs.</strong></p>
              <p>To create a setlist, you need to have some songs.</p>
            </FlexBox>
            <Link to="/create-song">
              <Button icon={faPlus} isRounded kind="primary">Create a song</Button>
            </Link>
          </FlexBox>
        ) : (
          <GridBox padding="1rem" gap="2rem" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
            <FlexBox flexDirection="column" gap=".5rem">
              <Link className="CreateSetlistRoute__type-btn" to="manual">
                  <FlexBox alignItems="center" flexDirection="column" gap=".5rem" padding="1rem">
                    <span>
                      <FontAwesomeIcon icon={faHammer} size="3x" />
                    </span>
                    <h2>Manual</h2>
                  </FlexBox>
              </Link>
              <p>Manually add, remove, and move songs as you please.</p>
            </FlexBox>
            <FlexBox flexDirection="column" gap=".5rem">
              <Link className="CreateSetlistRoute__type-btn" to="auto">
                <FlexBox alignItems="center" flexDirection="column" gap=".5rem" padding="1rem">
                  <span>
                    <FontAwesomeIcon icon={faMagicWandSparkles} size="3x" />
                  </span>
                  <h2>Auto</h2>
                </FlexBox>
              </Link>
              <p>Let the app auto-generate a setlist to your specifications. Then, edit the list to add your finishing touches.</p>
            </FlexBox>
          </GridBox>
        )}
      </div>
    )
  }
  return null
}