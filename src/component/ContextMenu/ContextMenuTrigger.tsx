import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { showMenu } from "../../redux/actions";

export type ContextMenuTriggerProps = {
  id: string;
  zIndex: number;
};

const ContextMenuTrigger: FC<ContextMenuTriggerProps> = ({id, zIndex, children}) => {
  const dispatch = useDispatch();

  return (
    <div onContextMenu={(e) => {
      // TODO: retrieve zIndex from e.currentTarget.children???
      dispatch(showMenu(id, e.pageX, e.pageY, zIndex + 1));
      e.preventDefault();
    }}>
      {children}
    </div>
  );
};

export default ContextMenuTrigger;