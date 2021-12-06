import React, { CSSProperties, FC } from "react";
import "./IconButton.css";

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  style?: CSSProperties
};

const IconButton: FC<IconButtonProps> = ({icon, onClick, style}) => {
  return (
    <div className="iconButton" onClick={onClick} style={style}>
      <i className={icon}></i>
    </div>
  );
};

export default IconButton;
