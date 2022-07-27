import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonKind } from "components/Button";
import { WindowDimsContext } from "context";
import React, { useContext } from "react";

export const CollapsingButton = ({icon, kind = 'default', isDisabled = false, onClick, label}: {icon?: IconDefinition; kind?: ButtonKind; isDisabled?: boolean; onClick: () => void; label: string}) => {
  const {isMobileWidth} = useContext(WindowDimsContext)
  return (
    <Button isDisabled={isDisabled} kind={kind} icon={icon} isRounded onClick={onClick}>{isMobileWidth ? '' : label}</Button>
  )
}
