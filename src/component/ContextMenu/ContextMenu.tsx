import React, { createContext, FC, RefObject, useRef } from 'react';
import './ContextMenu.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';

export type ContextMenuProps = {
  id: string;
};

type Context = {
  ref?: RefObject<HTMLDivElement>;
};

export const MenuContext = createContext<Context>({
  ref: undefined
});

const ContextMenu: FC<ContextMenuProps> = ({id, children}) => {
  const self = useRef(null);
  const { left, top, visible, zIndex } = useSelector((state: RootState) => 
    state.contextMenuReducer[id] ?? {});

  return (
    <MenuContext.Provider value={{ ref: self }}>
      <div
        ref={self}
        className={`contextMenu ${visible ? '' : 'hidden'}`}
        style={{ left, top, zIndex: visible ? zIndex : -1 }}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
};

export default ContextMenu;