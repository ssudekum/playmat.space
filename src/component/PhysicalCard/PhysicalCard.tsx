import React from 'react';
import { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import './PhysicalCard.css';
import Card from '../../lib/Card';
import { Draggable } from '../../lib/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend';

type PhysicalCardProps = {
  num: number,
  card: Card,
  onDoubleClick: DoubleClickFunction
};

type DoubleClickFunction = {
  (event: React.MouseEvent<HTMLImageElement, MouseEvent>): void
};

const PhysicalCard: React.FC<PhysicalCardProps> = ({ num, card, onDoubleClick }) => {
  let id = `physical-card-${card.id}-${num}`;
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

  return <>
    <img
      id={id}
      ref={drag}
      className={`physical-card ${isDragging ? 'hidden' : ''}`}
      alt={card.name}
      src={card.image_uris ? card.image_uris.png : ''}
      onDoubleClick={onDoubleClick}
      onMouseDown={selectOnlyThis}>
    </img>
  </>
}

export default PhysicalCard;