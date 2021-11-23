import React, { FC, useState, useEffect, useMemo } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import Card from '../../lib/Card';
import PhysicalCard, { cardEquals } from '../../lib/PhysicalCard';
import './Playmat.css'
import Draggable from '../../lib/Draggable'
import PlaymatCard from '../PlaymatCard/PlaymatCard'
import DragSelectBox, { DragSelectBoxProps } from './DragSelectBox/DragSelectBox';
import playmatImage from '../../image/goyf-playmat.jpg'
import CountedCollection from '../../lib/CountedCollection';
import Deckbox from '../Deckbox/Deckbox';
import { PhysicalCardsDO, TextCardDO } from '../CustomDrag/CustomDragLayer';
import ContextMenu from '../ContextMenu/ContextMenu';
import ContextOption from '../ContextMenu/ContextOption';

let playmatStyle = {};
if (playmatImage) {
  playmatStyle = {
    backgroundImage: `url(${playmatImage})`
  }
}

const Playmat: FC = () => {
  const [cardStack, setCardStack] = useState<PhysicalCard[]>([]);
  const [cardCollection, setCardCollection] = useState(new CountedCollection<Card>());
  const [selectedCards, setSelectedCards] = useState<PhysicalCard[]>([]);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [isAnimatingCards, setIsAnimatingCards] = useState(false);
  const [dragSelectBoxProps, setDragSelectBoxProps] = useState<DragSelectBoxProps>({
    originX: 0,
    originY: 0,
    isDragging: false,
    zIndex: -1,
  });

  const [, drop] = useDrop({
    accept: [Draggable.PHYSICAL_CARDS, Draggable.TEXT_CARD],
    drop: (item: PhysicalCardsDO | TextCardDO, target) => {
      if (item.type === Draggable.PHYSICAL_CARDS) {
        dropPhyscialCards(item as PhysicalCardsDO, target);
      } else {
        dropTextCard(item as TextCardDO, target);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const nextCardCollection = new CountedCollection(cardCollection);
        const nextCardStack = [...cardStack];

        for (const selected of selectedCards) {
          const stackIndex = nextCardStack.findIndex((stack) => cardEquals(stack, selected));
          const stackCard = nextCardStack.splice(stackIndex, 1)[0];
          nextCardCollection.subtractOne(stackCard.card)
        }

        setCardCollection(nextCardCollection);
        setCardStack(nextCardStack);
      }
    }

    document.addEventListener('keydown', eventListener);
    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, [cardCollection, cardStack, selectedCards]);

  const dropPhyscialCards = (dragObject: PhysicalCardsDO, target: DropTargetMonitor) => {
    const nextCardStack = [...cardStack];
    const nextSelectedCards = [...selectedCards];
    const offset = target.getDifferenceFromInitialOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;

    for (const dropped of dragObject.selectedCards) {
      const stackIndex = nextCardStack.findIndex((stack) => cardEquals(stack, dropped));
      if (stackIndex === -1) {
        throw Error(`Card {id: ${dropped.card.id}, copy: ${dropped.copy}} is missing from stack`);
      }
      
      const stackCard = nextCardStack.splice(stackIndex, 1)[0];
      stackCard.left += offsetX;
      stackCard.top += offsetY;
      nextCardStack.push(stackCard);
      
      const selectedCard = nextSelectedCards.find((selected) => cardEquals(selected, dropped));
      if (!selectedCard) throw Error('Dropped card was not selected');
      selectedCard.left = stackCard.left;
      selectedCard.top = stackCard.top;
    }

    setCardStack(nextCardStack);
  };

  const dropTextCard = (dragObject: TextCardDO, target: DropTargetMonitor) => {
    const card = dragObject.card;
    const offset = target.getSourceClientOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;

    const nextCardCollection = new CountedCollection(cardCollection);
    nextCardCollection.addOne(card);
    setCardCollection(nextCardCollection);

    const nextCardStack = [...cardStack];
    nextCardStack.push({
      card: card,
      copy: nextCardCollection.counts[card.id],
      left: offsetX,
      top: offsetY,
    });

    setCardStack(nextCardStack);
  }

  const addCollection = (adds: CountedCollection<Card>) => {
    const nextCardCollection = new CountedCollection(cardCollection);
    const nextCardStack = [...cardStack];

    for (const card of Object.values(adds.items)) {
      const copies = adds.counts[card.id];
      for (let i=1; i<=copies; i++) {
        nextCardCollection.addOne(card);
        nextCardStack.push({
          card: card,
          left: document.body.clientWidth / 2,
          top: document.body.clientHeight / 2,
          copy: nextCardCollection.counts[card.id],
        });
      }
    }

    setCardCollection(nextCardCollection);
    setCardStack(nextCardStack);
  };

  const selectArea = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragSelectBoxProps.isDragging) {
      const nextSelectedCards = [];
      const originX = dragSelectBoxProps.originX;
      const originY = dragSelectBoxProps.originY;
      const mouseX = event.pageX;
      const mouseY = event.pageY;

      for (const playmatCard of cardStack) {
        const {left, top} = playmatCard;
        const minY = top;
        const minX = left;
        const maxY = minY + 300; // card height
        const maxX = minX + 214; // card width

        const leftOrigin = minX > originX && originX < maxX
        const centerXOrigin = minX < originX && originX < maxX
        const rightOrigin = minX < originX && originX > maxX
        const aboveOrigin = minY > originY && originY < maxY
        const centerYOrigin = minY < originY && originY < maxY
        const belowOrigin = minY < originY && originY > maxY
        const leftMouse = minX > mouseX && mouseX < maxX
        const rightMouse = minX < mouseX && mouseX > maxX
        const aboveMouse = minY > mouseY && mouseY < maxY
        const belowMouse = minY < mouseY && mouseY > maxY

        // selection is based on where the mouse cannot be, given some point of origin
        const selected = ((leftOrigin && aboveOrigin && !leftMouse && !aboveMouse) || // upper left
          (leftOrigin && centerYOrigin && !leftMouse) || // left of center
          (leftOrigin && belowOrigin && !leftMouse && !belowMouse) || // bottom left
          (centerXOrigin && aboveOrigin && !aboveMouse) || // above center
          (centerXOrigin && belowOrigin && !belowMouse) || // below center
          (rightOrigin && aboveOrigin && !rightMouse && !aboveMouse) || // upper right
          (rightOrigin && centerYOrigin && !rightMouse) || // right of center
          (rightOrigin && belowOrigin && !rightMouse && !belowMouse)) // bottom right
          
        if (selected) {
          nextSelectedCards.push(playmatCard);
        }
      }

      setSelectedCards(nextSelectedCards);
      setDragSelectBoxProps({
        originX: 0,
        originY: 0,
        isDragging: false,
        zIndex: -1
      });
    }
  };

  const animate = () => {
    setIsAnimatingCards(true);
    setTimeout(() => {
      setIsAnimatingCards(false);
    }, 200);
  };

  const physicalCards = useMemo(() => {
    console.log('rendering cards');
    return cardStack.map((playmatCard, index) => (
      <PlaymatCard
        key={index}
        zIndex={index + 2}
        playmatCard={playmatCard}
        isDraggingSelection={isDraggingSelection}
        setIsDraggingSelection={setIsDraggingSelection}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        animate={animate}
        isAnimated={isAnimatingCards}>
      </PlaymatCard>
    ))
  }, [cardStack, selectedCards, isDraggingSelection, isAnimatingCards]);

  const flipSelected = () => {
    console.log(selectedCards);
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isFlipped = !selectedCard.isFlipped;
      return selectedCard;
    });
    setSelectedCards(nextSelectedCards);
  };

  const cloneSelected = () => {
    const nextCardCollection = new CountedCollection(cardCollection);
    const nextCardStack = [...cardStack];

    for (const physicalCard of selectedCards) {
      const card = physicalCard.card;
      nextCardCollection.addOne(card);
      nextCardStack.push({
        ...physicalCard,
        top: physicalCard.top + 25,
        left: physicalCard.left + 25,
        copy: nextCardCollection.counts[card.id]
      });
    }

    setCardCollection(nextCardCollection);
    setCardStack(nextCardStack);
  };

  return <>
    <Deckbox addCollection={addCollection} />
    <div
      ref={drop}
      id="playmat"
      className="playmat"
      style={playmatStyle}
      onMouseUp={selectArea}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.button === 0) {
          setDragSelectBoxProps({
            originX: event.pageX,
            originY: event.pageY,
            isDragging: true,
            zIndex: cardStack.length + 3,
          });
        }
      }}
    >
      <DragSelectBox {...dragSelectBoxProps} />
      <ContextMenu id="playmat-menu">
        <ContextOption label="Flip" onClick={flipSelected} />
        <ContextOption label="Clone" onClick={cloneSelected} />
        <ContextOption label="Move to">
          <ContextOption label="Graveyard" onClick={cloneSelected} />
          <ContextOption label="Exile" onClick={cloneSelected} />
        </ContextOption>
      </ContextMenu>
      {physicalCards}
    </div>
  </>;
}

export default Playmat;