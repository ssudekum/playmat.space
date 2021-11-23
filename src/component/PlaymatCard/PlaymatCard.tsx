import React, { useEffect, useMemo } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Draggable from '../../lib/Draggable';
import PhysicalCard, { cardEquals, getCardImage } from '../../lib/PhysicalCard';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import './PlaymatCard.css';

export type PlaymatCardProps = {
  zIndex: number;
  playmatCard: PhysicalCard;
  selectedCards: PhysicalCard[];
  setSelectedCards: (cards: PhysicalCard[]) => void;
  isDraggingSelection: boolean;
  setIsDraggingSelection: (isDraggingSelection: boolean) => void;
  isAnimated: boolean;
  animate: () => void;
};

const PlaymatCard: React.FC<PlaymatCardProps> = ({
  zIndex,
  playmatCard,
  selectedCards, 
  setSelectedCards,
  isDraggingSelection,
  setIsDraggingSelection,
  isAnimated,
  animate,
}) => {
  const id = `playmat-card_${playmatCard.card.id}_${playmatCard.copy}`;

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
    setIsDraggingSelection(isDragging);
  }, [isDragging, setIsDraggingSelection]);

  const isSelected = useMemo(() => (
    !!selectedCards.find((selected) => 
      cardEquals(selected, playmatCard))
  ), [selectedCards, playmatCard]);

  const select = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    if (isSelected) return;
    const nextSelectedCards = [playmatCard];
    setSelectedCards(nextSelectedCards);
  };

  const tapUntap = () => {
    const isTapped = !playmatCard.isTapped;
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isTapped = isTapped;
      return selectedCard;
    });
    animate();
    setSelectedCards(nextSelectedCards);
  };

  const classNames = [];
  if (isSelected) {
    classNames.push('selected');
    if (isDraggingSelection) {
      classNames.push('hidden');
    }
  }
  if (isAnimated) {
    classNames.push('animated');
  }
  if (playmatCard.isTapped) {
    classNames.push('tapped');
  }
  
  return (
    <ContextMenuTrigger id="playmat-menu" zIndex={zIndex}>
      <img
        id={id}
        ref={drag}
        style={{
          top: `${playmatCard.top}px`,
          left: `${playmatCard.left}px`,
          zIndex,
        }}
        className={`playmat-card ${classNames.join(' ')}`}
        alt={playmatCard.card.name}
        src={getCardImage(playmatCard)}
        onDoubleClick={tapUntap}
        onMouseDown={select}>
      </img>
    </ContextMenuTrigger>
  );
}

export default PlaymatCard;