import React, { useState } from "react";
import { faHammer, faMagicWandSparkles, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DeleteWarning, FlexBox, GridBox, HeaderBox, Modal } from "components";
import { SetlistCreationType } from "typings";
import { capitalizeFirstLetter } from "utils";

export const TypeSelection = ({onSelect, selectedType}: {selectedType?: SetlistCreationType; onSelect: (type?: SetlistCreationType) => void}) => {
  const [showWarning, setShowWarning] = useState(false)

  return (
    <div className="TypeSelection">
      {selectedType ? (
        <HeaderBox>
          <h2>{capitalizeFirstLetter(selectedType)} setlist creation</h2>
          <Button icon={faRotate} onClick={() => setShowWarning(true)}>Switch type</Button>
        </HeaderBox>
      ) :(
        <GridBox gap="2rem" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))">
          <FlexBox flexDirection="column" gap=".5rem">
            <button className="CreateSetlistRoute__type-btn" onClick={() => onSelect('manual')}>
              <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
                <span>
                  <FontAwesomeIcon icon={faHammer} size="3x" />
                </span>
                <h2>Manual</h2>
              </FlexBox>
            </button>
            <p>Manually add, remove, and move songs as you please.</p>
          </FlexBox>
          <FlexBox flexDirection="column" gap=".5rem">
            <button className="CreateSetlistRoute__type-btn" onClick={() => onSelect('auto')}>
              <FlexBox flexDirection="column" gap=".5rem" padding="1rem">
                <span>
                  <FontAwesomeIcon icon={faMagicWandSparkles} size="3x" />
                </span>
                <h2>Auto</h2>
              </FlexBox>
            </button>
            <p>Let the app auto-generate a setlist to your specifications. Then, edit the list to add your finishing touches.</p>
          </FlexBox>
        </GridBox>
      )}
      {showWarning && (
        <Modal offClick={() => setShowWarning(false)}>
          <DeleteWarning onClose={() => setShowWarning(false)} onDelete={() => {onSelect(undefined); setShowWarning(false)}}>
            <p>This will delete all progress.</p>
          </DeleteWarning>
        </Modal>
      )}
    </div>
  )
}