import React from "react";
import { faHammer, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FlexBox, GridBox } from "components";
import { Link } from "react-router-dom";

export const TypeSelection = () => {

  return (
    <div className="TypeSelection">
      <GridBox gap="2rem" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
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
    </div>
  )
}