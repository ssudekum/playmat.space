import React from 'react';
import { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import './PhysicalCard.css';
import Card from '../../lib/Card';
import { Draggable } from '../../lib/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend';

export type CardPosition = {
  top: number;
  left: number;
  zIndex: number;
};

export type PhysicalCardProps = {
  id: string;
  card: Card;
  position: CardPosition;
  onDoubleClick: DoubleClickFunction;
};

type DoubleClickFunction = {
  (event: React.MouseEvent<HTMLImageElement, MouseEvent>): void
};

const PhysicalCard: React.FC<PhysicalCardProps> = ({ id, card, position, onDoubleClick }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: Draggable.CARD, id: id, card: card },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  const selectOnlyThis = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.currentTarget.setAttribute('selected', 'true');
    const playmatElem = document.getElementById('playmat');
    if (!playmatElem) {
      console.error("Error: could not locate Playmat element");
      return;
    }

    let cardElements = playmatElem.getElementsByClassName('physical-card');
    for (let [, cardElem] of Object.entries(cardElements)) {
      if (cardElem &&
        cardElem.getAttribute('id') !== id &&
        cardElem.getAttribute('selected') === 'true') {
        cardElem.setAttribute('selected', 'false')
      }
    }

    event.stopPropagation();
  }

  return (
    <img
      id={id}
      ref={drag}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: position.zIndex
      }}
      className={`physical-card ${isDragging ? 'hidden' : ''}`}
      alt={card.name}
      src={card.image_uris ? card.image_uris.png : ''}
      onDoubleClick={onDoubleClick}
      onMouseDown={selectOnlyThis}>
    </img>
  );
}

export default PhysicalCard;