import React, { FC, RefObject, useEffect, useState } from 'react';
import ContextOption from './ContextOption';
import './ContextMenu.css';

export type ContextMenuOption = {
  display: string;
  onClick?: () => void;
  options?: ContextMenuOption[];
};

export type ContextMenuProps = {
  target: RefObject<HTMLElement>;
  options: ContextMenuOption[];
};

const ContextMenu: FC<ContextMenuProps> = ({target, options}) => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const currentTarget = target.current;

  useEffect(() => {
    const hide = () => {
      setIsVisible(false);
    };

    const onContextMenu = (event: MouseEvent) => {
      setLeft(event.pageX);
      setTop(event.pageY);
      setIsVisible(true);
      event.preventDefault();
    };

    document.body.addEventListener("click", hide);
    if (currentTarget) {
      currentTarget.addEventListener("contextmenu", onContextMenu);
    }
    return () => {
      document.body.removeEventListener("click", hide);
      if (currentTarget) {
        currentTarget.removeEventListener("contextmenu", onContextMenu);
      }
    }
  }, [currentTarget]);

  return (
    <div
      className={`contextMenu ${isVisible ? '' : 'hidden'}`} 
      style={{
        top: top,
        left: left,
        zIndex: isVisible ? Number(currentTarget?.style.zIndex) + 1 : -1
      }}>
      {
        options.map((option, index) => (
          <ContextOption
            key={index}
            option={option} 
            setIsVisible={setIsVisible}
          />
        ))
      }
    </div>
  );
};

export default ContextMenu;