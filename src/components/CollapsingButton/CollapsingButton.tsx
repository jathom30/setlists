import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonKind } from "components/Button";
import { WindowDimsContext } from "context";
import React, { useContext } from "react";

export const CollapsingButton = ({icon, kind = 'default', onClick, label}: {icon?: IconDefinition; kind?: ButtonKind; onClick: () => void; label: string}) => {
  const {isMobileWidth} = useContext(WindowDimsContext)
  return (
    <Button kind={kind} icon={icon} isRounded onClick={onClick}>{isMobileWidth ? '' : label}</Button>
  )
}
