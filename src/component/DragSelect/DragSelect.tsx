import React, { CSSProperties, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import './DragSelect.css';

export type DragSelectProps = {
  zIndex: number,
  onSelect: (
    originX: number,
    originY: number,
    pageX: number,
    pageY: number,
  ) => void
};

const hiddenStyle: CSSProperties = {
  opacity: '0',
  userSelect: 'none',
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  zIndex: -1
};

const getStyle = (
  originX: number,
  originY: number,
  positionX: number,
  positionY: number,
) => {
  let height = positionY - originY;
  let top = originY;
  if (height < 0) {
    height = originY - positionY;
    top = positionY;
  }

  let width = positionX - originX;
  let left = originX;
  if (width < 0) {
    width = originX - positionX;
    left = positionX;
  }
  
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
}

export const isSelected = (
  minX: number, 
  minY: number, 
  maxX: number, 
  maxY: number, 
  originX: number, 
  originY: number, 
  mouseX: number, 
  mouseY: number,
) => {
  const leftOrigin = minX > originX && originX < maxX;
  const centerXOrigin = minX < originX && originX < maxX;
  const rightOrigin = minX < originX && originX > maxX;
  const aboveOrigin = minY > originY && originY < maxY;
  const centerYOrigin = minY < originY && originY < maxY;
  const belowOrigin = minY < originY && originY > maxY;
  const leftMouse = minX > mouseX && mouseX < maxX;
  const rightMouse = minX < mouseX && mouseX > maxX;
  const aboveMouse = minY > mouseY && mouseY < maxY;
  const belowMouse = minY < mouseY && mouseY > maxY;

  // selection is based on where the mouse cannot be, given some point of origin
  return ((leftOrigin && aboveOrigin && !leftMouse && !aboveMouse) || // upper left
    (leftOrigin && centerYOrigin && !leftMouse) || // left of center
    (leftOrigin && belowOrigin && !leftMouse && !belowMouse) || // bottom left
    (centerXOrigin && aboveOrigin && !aboveMouse) || // above center
    (centerXOrigin && belowOrigin && !belowMouse) || // below center
    (rightOrigin && aboveOrigin && !rightMouse && !aboveMouse) || // upper right
    (rightOrigin && centerYOrigin && !rightMouse) || // right of center
    (rightOrigin && belowOrigin && !rightMouse && !belowMouse)); // bottom right
}

const DragSelect: React.FC<DragSelectProps> = ({ zIndex, onSelect }) => {
  const {isDragging, origin, location} = useSelector((state: RootState) => state.dragSelectReducer);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isDragging && !isVisible) {
      setIsVisible(true);
    } else if (!isDragging && isVisible) {
      setIsVisible(false);
      onSelect(
        origin.x,
        origin.y,
        location.x,
        location.y
      );
    }
  }, [isDragging, isVisible, origin, location, onSelect]);

  return createPortal(
    <div
      className="dragSelect"
      style={isVisible ? {
        opacity: '0.5',
        userSelect: 'none',
        zIndex: zIndex,
        ...getStyle(
          origin.x,
          origin.y,
          location.x,
          location.y
        ),
      }: hiddenStyle}>
    </div>,
    document.body
  );
}

export default DragSelect;
