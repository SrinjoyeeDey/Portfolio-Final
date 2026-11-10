import type { ReactNode, ComponentPropsWithoutRef, FC } from 'react';

export interface SlingButtonProps extends ComponentPropsWithoutRef<'span'> {
  children?: ReactNode;
  onSend?: () => void;
  padColor?: string;
  iconColor?: string;
  accentColor?: string;
  wellColor?: string;
  bandColor?: string;
  size?: number;
  strokeWidth?: number;
  armAt?: number;
  maxPull?: number;
  launchSpeed?: number;
  recoil?: number;
  flight?: number;
  particles?: number;
  spread?: number;
  axis?: 'any' | 'horizontal' | 'vertical';
  tapSends?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

declare const SlingButton: FC<SlingButtonProps>;

export default SlingButton;
