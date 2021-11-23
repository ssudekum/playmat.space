import React, { FC, useRef, useState } from "react";
import { ContextMenuOption } from "./ContextMenu";
import SubContextMenu from './SubContextMenu';

export type ContextOptionProps = {
  option: ContextMenuOption;
  setIsVisible: (visible: boolean) => void;
};

const ContextOption: FC<ContextOptionProps> = ({option, setIsVisible}) => {
  const {display, onClick, options} = option;
  const optionRef = useRef<HTMLDivElement>(null);
  const [subContextIsVisible, setSubContextIsVisible] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
    setIsVisible(false);
  };

  return (<>
    <div 
      ref={optionRef}
      className="contextMenuOption" 
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseOver={() => setSubContextIsVisible(true)}
      onMouseOut={() => setSubContextIsVisible(false)}
    >
      {display}
      {options?.length 
        ? <>
          <i className="fa fa-arrow-right" /> 
          <SubContextMenu 
            options={options} 
            target={optionRef}
            visible={subContextIsVisible}
          /> 
        </> : null}
    </div>
  </>);
};

export default ContextOption;