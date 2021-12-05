import React, { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { hideContextMenus } from "../../redux/actions";
import SubContextMenu from './SubContextMenu';

export type ContextOptionProps = {
  label: string;
  onClick?: () => void
}

const ContextOption: FC<ContextOptionProps> = ({label, onClick, children}) => {
  const dispatch = useDispatch();
  const optionRef = useRef<HTMLDivElement>(null);
  const [subContextIsVisible, setSubContextIsVisible] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    dispatch(hideContextMenus());
  };

  return (
    <div 
      ref={optionRef}
      className="contextMenuOption" 
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseOver={() => setSubContextIsVisible(true)}
      onMouseOut={() => setSubContextIsVisible(false)}
    >
      {label}
      {children
        ? <>
          <i className="fa fa-arrow-right" /> 
          <SubContextMenu
            target={optionRef}
            visible={subContextIsVisible}
          >
            {children}
          </SubContextMenu>
        </> : null}
    </div>
  );
};

export default ContextOption;