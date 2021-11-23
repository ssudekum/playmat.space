import React, { useEffect, useState } from 'react';
import './DragSelectBox.css'

export type DragSelectBoxProps = {
  originX: number,
  originY: number,
  isDragging: boolean,
  zIndex: number
};

export type DragSelectBoxStyle = {
  opacity: string,
  top: string,
  left: string,
  width: string,
  height: string,
  zIndex: number
};

const emptyStyle: DragSelectBoxStyle = {
  opacity: '0',
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  zIndex: -1
};

const DragSelectBox: React.FC<DragSelectBoxProps> = ({ originX, originY, isDragging, zIndex }) => {
  const [style, setStyle] = useState(emptyStyle);
  const [isVisible, setIsVisible] = useState(false);

  if (isDragging && !isVisible) {
    setIsVisible(true);
  } else if (!isDragging && isVisible) {
    setIsVisible(false);
    setStyle(emptyStyle);
  }

  useEffect(() => {
    const eventListener = (event: MouseEvent) => {
      if (event != null && isDragging) {
        let differenceX = event.pageX - originX
        let differenceY = event.pageY - originY
        let style: DragSelectBoxStyle = {
          opacity: '0.5',
          top: `${originY}px`,
          left: `${originX}px`,
          width: `${differenceX}px`,
          height: `${differenceY}px`,
          zIndex: zIndex,
        }

        if (differenceX < 0) {
          style.left = `${event.pageX}px`
          style.width = `${originX - event.pageX}px`
        }

        if (differenceY < 0) {
          style.top = `${event.pageY}px`
          style.height = `${originY - event.pageY}px`
        }

        setStyle(style);
      }
    }

    document.addEventListener('mousemove', eventListener);
    return () => {
      document.removeEventListener('mousemove', eventListener);
    };
  })

  return (
    <div 
      style={style}
      className="dragSelectBox">
    </div>
  );
}

export default DragSelectBox;