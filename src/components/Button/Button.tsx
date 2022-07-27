import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FlexBox } from 'components/Box';
import { Loader } from 'components/Loader';
import * as React from 'react';
import './Button.scss'

export type ButtonKind = 'default' | 'primary' | 'danger' | 'text' | 'secondary'

export const Button: React.FC<{
  buttonRef?: React.RefObject<HTMLButtonElement>
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  isRounded?: boolean,
  isDisabled?: boolean
  isLoading?: boolean
  type?: 'button' | 'submit' | 'reset'
  kind?: ButtonKind
  width?: string
  icon?: IconDefinition
  children?: React.ReactNode
}> = ({buttonRef, children, onClick, isRounded = false, kind = 'default', isLoading = false, type = 'button', isDisabled = false, width, icon}) => {
  const buttonKindClass = `Button__${kind}`
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      style={{width}}
      type={type}
      className={`Button ${isRounded ? 'Button--rounded' : ''} ${isDisabled ? 'Button--disabled' : ''} ${buttonKindClass}`}
    >
      <FlexBox gap="0.5rem" padding='0 .5rem' alignItems="center">
        {(!isLoading && icon) && <FontAwesomeIcon icon={icon} />}
        {isLoading && <Loader size='s' />}
        {children}
      </FlexBox>
    </button>
  )
}