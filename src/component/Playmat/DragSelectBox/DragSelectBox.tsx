import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import './DragSelectBox.css'

export type DragSelectBoxProps = {
  zIndex: number,
  origin: {
    x: number,
    y: number,
  },
  position: {
    x: number,
    y: number,
  }
  onSelect: (
    originX: number,
    originY: number,
    pageX: number,
    pageY: number,
  ) => void
};

export type DragSelectBoxStyle = {
  opacity: string,
  top: string,
  left: string,
  width: string,
  height: string,
  zIndex: number
};

const hiddenStyle: DragSelectBoxStyle = {
  opacity: '0',
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  zIndex: -1
};

const getDimensions = (
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
    height,
    top,
    width,
    left,
  };
}

const DragSelectBox: React.FC<DragSelectBoxProps> = ({ zIndex, origin, position, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: 0,
    top: 0,
    width: 0,
    left: 0,
  });
  const isDragging = useSelector((state: RootState) => state.dragSelectReducer.isDragging);

  useEffect(() => {
    if (isDragging) {
      setDimensions(getDimensions(origin.x, origin.y, position.x, position.y));
    }

    if (isDragging && !isVisible) {
      setIsVisible(true);
    } else if (!isDragging && isVisible) {
      setIsVisible(false);
      onSelect(origin.x, origin.y, position.x, position.y);
    }
  }, [isDragging, origin, position, isVisible, onSelect]);

  return (
    <div
      className="dragSelectBox"
      style={isVisible ? {
        opacity: '0.5',
        top: `${dimensions.top}px`,
        left: `${dimensions.left}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        zIndex: zIndex,
      }: hiddenStyle}>
    </div>
  );
}

export default DragSelectBox;