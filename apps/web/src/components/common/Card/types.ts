import type { ReactNode } from 'react';

export type CardProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  disableBodyPadding?: boolean;
  footer?: ReactNode;
  footerClassName?: string;
};
