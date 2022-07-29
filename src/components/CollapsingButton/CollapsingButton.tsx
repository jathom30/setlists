import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonKind } from "components/Button";
import { WindowDimsContext } from "context";
import React, { useContext } from "react";

export const CollapsingButton = ({buttonRef, icon, kind = 'default', isDisabled = false, onClick, label}: {
  buttonRef?: React.RefObject<HTMLButtonElement>;
  icon?: IconDefinition;
  kind?: ButtonKind;
  isDisabled?: boolean;
  onClick: () => void; label: string;
}) => {
  const {isMobileWidth} = useContext(WindowDimsContext)
  return (
    <Button buttonRef={buttonRef} isDisabled={isDisabled} kind={kind} icon={icon} isRounded onClick={onClick}>{isMobileWidth ? '' : label}</Button>
  )
}
