import React, { useMemo } from 'react';
import { useEffect } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import './PhysicalCard.css';
import { Draggable } from '../../lib/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { cardEquals, PlaymatCard } from '../Playmat/Playmat';
import cardBack from '../../image/mtg-card-back.png';

export type PhysicalCardProps = {
  zIndex: number;
  playmatCard: PlaymatCard;
  isDraggingCards: boolean;
  setIsDraggingCards: (dragging: boolean) => void;
  selectedCards: PlaymatCard[];
  setSelectedCards: (ids: PlaymatCard[]) => void;
};

const PhysicalCard: React.FC<PhysicalCardProps> = ({
  zIndex,
  playmatCard,
  isDraggingCards, 
  setIsDraggingCards, 
  selectedCards, 
  setSelectedCards
}) => {
  const id = `physical-card_${playmatCard.card.id}_${playmatCard.copy}`;

  const isSelected = useMemo(() => (
    !!selectedCards.find((selected) => 
      cardEquals(selected, playmatCard))
  ), [selectedCards, playmatCard]);

  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: Draggable.PHYSICAL_CARDS, 
      selectedCards: selectedCards,
      anchor: playmatCard
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

  const select = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    if (isSelected) return;
    const nextSelectedCards = [playmatCard];
    setSelectedCards(nextSelectedCards);
  };

  const tapUntapAction = () => {
    const isTapped = !playmatCard.isTapped;
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isTapped = isTapped;
      return selectedCard;
    });
    setSelectedCards(nextSelectedCards);
  };

  const classNames = [];
  if (isSelected) {
    classNames.push('selected');
    if (isDraggingCards) {
      classNames.push('hidden');
    }
  }
  if (playmatCard.isTapped) {
    classNames.push('tapped');
  }
  
  return (
    <img
      id={id}
      ref={drag}
      style={{
        top: `${playmatCard.top}px`,
        left: `${playmatCard.left}px`,
        zIndex: zIndex,
      }}
      className={`physical-card ${classNames.join(' ')}`}
      alt={playmatCard.card.name}
      src={playmatCard.card.image_uris?.normal ?? cardBack}
      onDoubleClick={tapUntapAction}
      onMouseDown={select}>
    </img>
  );
}

export default PhysicalCard;