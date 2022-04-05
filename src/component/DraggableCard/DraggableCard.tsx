import React, { MouseEvent, useEffect, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import Draggable from '../../lib/enum/Draggable';
import PhysicalCard, { cardEquals, getCardImage, getCopyId } from '../../lib/type/PhysicalCard';
import { RootState } from '../../redux';
import { hideContextMenus } from '../../redux/actions';
import { BASE_VERTICAL_CARD_HEIGHT } from '../../redux/reducers/CardSizeReducer';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import { CardContext } from '../../lib/hook/useCardContext';
import './DraggableCard.css';
import { PhysicalCardsDO } from '../DragPreview/CustomDragLayer';

export type DraggableCardProps = {
  zIndex: number,
  draggableCard: PhysicalCard,
  cardContext: CardContext,
};

const DraggableCard: React.FC<DraggableCardProps> = ({
  zIndex,
  draggableCard,
  cardContext,
}) => {
  const dispatch = useDispatch();
  const copyId = getCopyId(draggableCard);
  const {
    selectedCards,
    isAnimationAllowed,
    isDraggingSelection,
    setCardState,
  } = cardContext;

  const [{isDragging}, drag, preview] = useDrag<
    PhysicalCardsDO, 
    PhysicalCardsDO, 
    { isDragging: boolean }
  >({
    type: Draggable.PHYSICAL_CARDS,
    item: (): PhysicalCardsDO => {
      const draggedCards = [...selectedCards]; 
      draggedCards.forEach((card) => {
        card.sourceContextId = cardContext.contextId;
        card.currentContextId = undefined;
      });
      return {
        type: Draggable.PHYSICAL_CARDS,
        cards: selectedCards,
        anchor: draggableCard,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      if (draggableCard.currentContextId !== draggableCard.sourceContextId) {
        cardContext.removeCards([draggableCard]);
      }
    }
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  useEffect(() => {
    setCardState({
      isDraggingSelection: isDragging
    });
  }, [isDragging, setCardState]);

  
  const isSelected = useMemo(() => (
    !!selectedCards.find((selected) =>
      cardEquals(selected, draggableCard))
  ), [selectedCards, draggableCard]);

  const select = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(hideContextMenus());
    if (isSelected) return;
    const nextSelectedCards = [draggableCard];
    setCardState({
      selectedCards: nextSelectedCards
    });
  };

  const tapUntap = () => {
    const isTapped = !draggableCard.isTapped;
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isTapped = isTapped;
      return selectedCard;
    });

    setCardState({
      isAnimationAllowed: true,
      selectedCards: nextSelectedCards,
    });
    
    setTimeout(() => {
      setCardState({
        isAnimationAllowed: false,
      });
    }, 200);
  };

  const classNames = [];
  if (isSelected) {
    classNames.push('selected');
    if (isDraggingSelection) {
      classNames.push('hidden');
    }
  }
  if (isAnimationAllowed) {
    classNames.push('animated');
  }
  if (draggableCard.isTapped) {
    classNames.push('tapped');
  }

  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  return (
    <ContextMenuTrigger id={`${copyId}-menu`} zIndex={zIndex}>
      <img
        id={copyId}
        ref={drag}
        loading="eager"
        decoding="async"
        onMouseDown={select}
        onDoubleClick={tapUntap}
        alt={draggableCard.card.name}
        src={getCardImage(draggableCard)}
        className={`draggable-card ${classNames.join(' ')}`}
        style={{
          height: `${BASE_VERTICAL_CARD_HEIGHT * cardSize}px`,
          top: `${draggableCard.coordinate.y}px`,
          left: `${draggableCard.coordinate.x}px`,
          zIndex,
        }}
      />
    </ContextMenuTrigger>
  );
}

export default DraggableCard;