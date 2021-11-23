import React, { useEffect, useMemo, useRef } from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import Draggable from '../../lib/Draggable';
import PlaymatCard, { cardEquals, getCardImage } from '../../lib/PlaymatCard';
import ContextMenu from './ContextMenu/ContextMenu';
import './PhysicalCard.css';

export type PhysicalCardProps = {
  zIndex: number;
  playmatCard: PlaymatCard;
  selectedCards: PlaymatCard[];
  setSelectedCards: (cards: PlaymatCard[]) => void;
  isDraggingSelection: boolean;
  setIsDraggingSelection: (isDraggingSelection: boolean) => void;
  isAnimated: boolean;
  animate: () => void;
  addCopies: (cards: PlaymatCard[]) => void;
};

const PhysicalCard: React.FC<PhysicalCardProps> = ({
  zIndex,
  playmatCard,
  selectedCards, 
  setSelectedCards,
  isDraggingSelection,
  setIsDraggingSelection,
  isAnimated,
  animate,
  addCopies
}) => {
  const id = `physical-card_${playmatCard.card.id}_${playmatCard.copy}`;
  const cardRef = useRef(null);

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

  const flip = () => {
    const isFlipped = !playmatCard.isFlipped;
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isFlipped = isFlipped;
      return selectedCard;
    });
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

  const options = [
    {
      display: 'Flip',
      onClick: flip
    },{
      display: 'Clone',
      onClick: () => addCopies(selectedCards)
    },{
      display: 'Add Counter',
      onClick: () => {}
    },{
      display: 'Move to',
      options: [{
        display: 'Graveyard',
        onClick: () => {}
      },{
        display: 'Exile',
        onClick: () => {}
      },{
        display: 'Top of library',
        onClick: () => {}
      },{
        display: 'X cards from the top of library',
        onClick: () => {}
      },{
        display: 'Bottom of library',
        onClick: () => {}
      }]
    }
  ];
  
  return (<>
    <ContextMenu 
      target={cardRef}
      options={options}
    />
    <span 
      ref={cardRef}
      style={{
        zIndex: zIndex
      }}
    >
      <img
        id={id}
        ref={drag}
        style={{
          top: `${playmatCard.top}px`,
          left: `${playmatCard.left}px`,
        }}
        className={`physical-card ${classNames.join(' ')}`}
        alt={playmatCard.card.name}
        src={getCardImage(playmatCard)}
        onDoubleClick={tapUntap}
        onMouseDown={select}>
      </img>
    </span>
  </>);
}

export default PhysicalCard;