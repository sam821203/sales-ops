import { useState } from 'react';
import type { ReactNode } from 'react';

export default function SidebarLinkGroup(props: {
  activeCondition: boolean;
  children: (handleClick: () => void, open: boolean) => ReactNode;
}) {
  const [open, setOpen] = useState(props.activeCondition);

  return <>{props.children(() => setOpen((v) => !v), open)}</>;
}

