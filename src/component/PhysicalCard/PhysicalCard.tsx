import React, { useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import './PhysicalCard.css';
import Card from '../../lib/Card';
import { Draggable } from '../../lib/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { SelectedCard } from '../CustomDrag/CustomDragLayer';

export type CardPosition = {
  top: number;
  left: number;
  zIndex: number;
};

export type PhysicalCardProps = {
  id: string;
  card: Card;
  position: CardPosition;
  isDraggingCards: boolean;
  setIsDraggingCards: (dragging: boolean) => void;
  selectedCards: SelectedCard[];
  setSelectedCards: (ids: SelectedCard[]) => void;
};

const PhysicalCard: React.FC<PhysicalCardProps> = ({
  id, 
  card, 
  position, 
  isDraggingCards, 
  setIsDraggingCards, 
  selectedCards, 
  setSelectedCards
}) => {
  const [isTapped, setIsTapped] = useState(false);

  const selectedCard = useMemo(() => ({
    id: id,
    image: card.image_uris?.png,
    left: position.left,
    top: position.top,
  }), [id, card, position]);

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: Draggable.PHYSICAL_CARDS, 
      cards: selectedCards,
      anchor: selectedCard
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  useEffect(() => {
    setIsDraggingCards(isDragging);
  }, [isDragging, setIsDraggingCards]);

  const isSelected = useCallback(() => {
    return !!selectedCards.find((selected) => 
      selected.id === id
    );
  }, [id, selectedCards]);

  const select = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    if (isSelected()) return;
    const nextSelectedCards = [selectedCard];
    setSelectedCards(nextSelectedCards);
  };

  const classNames = useMemo(() => {
    const classNames = [];
    if (isSelected()) {
      classNames.push('selected');
      if (isDraggingCards) {
        classNames.push('hidden');
      }
    }

    if (isTapped) {
      classNames.push('tapped');
    }

    return classNames;
  }, [isDraggingCards, isSelected, isTapped]);

  return (
    <img
      id={id}
      ref={drag}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: position.zIndex
      }}
      className={`physical-card ${classNames.join(' ')}`}
      alt={card.name}
      src={card.image_uris ? card.image_uris.png : ''}
      onDoubleClick={() => setIsTapped(tapped => !tapped)}
      onMouseDown={select}>
    </img>
  );
}

export default PhysicalCard;