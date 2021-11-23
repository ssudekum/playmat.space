import React, { FC, RefObject, useContext } from 'react';
import { MenuContext } from './ContextMenu';
import './ContextMenu.css';

export type SubContextMenuProps = {
  target: RefObject<HTMLDivElement>;
  visible: boolean;
};

const SubContextMenu: FC<SubContextMenuProps> = ({target, visible, children}) => {
  const context = useContext(MenuContext);
  const currentTarget = target.current;
  const menuBounds = context.ref?.current?.getBoundingClientRect();
  const targetBounds = currentTarget?.getBoundingClientRect();
  const left = targetBounds?.width ? targetBounds.width : 0;
  const top = menuBounds && targetBounds ? targetBounds.top - menuBounds.top - 2 : 0;

  return (
    <div 
      className={`contextMenu ${visible ? '' : 'hidden'}`} 
      style={{ left, top }}
    >
      {children}
    </div>
  );
};

export default SubContextMenu;