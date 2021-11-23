import React, { FC, RefObject } from 'react';
import { ContextMenuOption } from './ContextMenu';
import ContextOption from './ContextOption';
import './ContextMenu.css';

export type SubContextMenuProps = {
  options: ContextMenuOption[];
  target: RefObject<HTMLDivElement>,
  visible: boolean,
};

const SubContextMenu: FC<SubContextMenuProps> = ({options, target, visible}) => {
  const currentTarget = target.current;
  const bounds = currentTarget?.getBoundingClientRect();

  return (
    <div
      className={`contextMenu ${visible ? '' : 'hidden'}`} 
      style={{
        top: -1, // TODO: get container top and option top difference
        left: bounds?.width ? bounds.width + 10 : 0,
      }}>
      {
        options.map((option, index) => (
          <ContextOption 
            key={index}
            option={option} 
            setIsVisible={() => {}}
          />
        ))
      }
    </div>
  );
};

export default SubContextMenu;