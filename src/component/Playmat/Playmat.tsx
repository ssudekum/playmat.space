import React, { FC, useState, useEffect, useMemo } from 'react'
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd'
import Card from '../../lib/Card'
import './Playmat.css'
import { Draggable } from '../../lib/Draggable'
import PhysicalCard from '../PhysicalCard/PhysicalCard'
import { DragSelectBox, DragSelectBoxProps } from './DragSelectBox/DragSelectBox'
import playmatImage from '../../image/goyf-playmat.jpg'
import CountedCollection from '../../lib/CountedCollection';
import Deckbox from './Deckbox/Deckbox';

type DragObjectCard = DragObjectWithType & {
  id: string
  card: Card
};

export type PlaymatCard = {
  card: Card;
  copy: number;
  left: number;
  top: number;
};

let playmatStyle = {};
if (playmatImage) {
  playmatStyle = {
    backgroundImage: `url(${playmatImage})`
  }
}

const Playmat: FC = () => {
  const [cardStack, setCardStack] = useState<PlaymatCard[]>([]);
  const [cardCollection, setCardCollection] = useState(new CountedCollection<Card>());
  const [dragSelectBoxProps, setDragSelectBoxProps] = useState<DragSelectBoxProps>({
    originX: 0,
    originY: 0,
    isDragging: false,
    zIndex: -1,
  });

  const [, drop] = useDrop({
    accept: Draggable.CARD,
    drop: (dragObject: DragObjectCard, target) => {
      dropCard(dragObject.id, dragObject.card, target)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const selectedCards = Array.from(document.querySelectorAll('[selected=true]'));
        const selectedIds = selectedCards.map((el) => el.getAttribute('id'));
        const nextCardCollection = new CountedCollection(cardCollection);
        const nextCardStack = [...cardStack];

        for (const selectedId of selectedIds) {
          if (!selectedId) {
            console.error("Card missing id property");
            return;
          }

          const [,cardId,copy] = selectedId.split("_");
          const stackIndex = nextCardStack.findIndex((stackCard) => 
            stackCard.card.id === cardId && 
            stackCard.copy === Number(copy));
          const playmatCard = nextCardStack.splice(stackIndex, 1)[0];
          nextCardCollection.subtractOne(playmatCard.card)
        }

        setCardCollection(nextCardCollection);
        setCardStack(nextCardStack);
      }
    }

    document.addEventListener('keydown', eventListener);
    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, [cardCollection, cardStack]);

  const dropCard = (id: string, card: Card, target: DropTargetMonitor) => {
    let playmatCard: PlaymatCard;
    const nextCardStack = [...cardStack];
    const offset = target.getSourceClientOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;

    if (id) {
      const [,cardId,copy] = id.split("_");
      const stackIndex = nextCardStack.findIndex((stackCard) => 
        stackCard.card.id === cardId && 
        stackCard.copy === Number(copy));
      
      if (stackIndex === -1) {
        console.error(`Card {id: ${cardId}, copy: ${copy}} is missing from stack`);
        return;
      }
      
      playmatCard = nextCardStack.splice(stackIndex, 1)[0];
      playmatCard.left = offsetX;
      playmatCard.top = offsetY;
    } else {
      const nextCardCollection = new CountedCollection(cardCollection);
      nextCardCollection.addOne(card);
      setCardCollection(nextCardCollection);
      playmatCard = {
        card: card,
        copy: nextCardCollection.counts[card.id],
        left: offsetX,
        top: offsetY,
      };
    }

    nextCardStack.push(playmatCard);
    setCardStack(nextCardStack);
  };
  
  const addCards = (adds: CountedCollection<Card>) => {
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
          copy: nextCardCollection.counts[card.id]
        });
      }
    }

    setCardCollection(nextCardCollection);
    setCardStack(nextCardStack);
  };

  const selectArea = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragSelectBoxProps.isDragging) {
      const playmatElem = document.getElementById('playmat');
      if (!playmatElem) {
        console.error("Could not locate Playmat element");
        return;
      }

      const originX = dragSelectBoxProps.originX;
      const originY = dragSelectBoxProps.originY;
      const mouseX = event.pageX;
      const mouseY = event.pageY;

      for (const playmatCard of cardStack) {
        const {card, copy, left, top} = playmatCard;
        const cardElem = playmatElem.querySelector(`#physical-card_${card.id}_${copy}`);

        if (cardElem) {
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
            cardElem.setAttribute('selected', 'true');
          } else {
            cardElem.setAttribute('selected', 'false');
          }
        }
      }

      setDragSelectBoxProps({
        originX: 0,
        originY: 0,
        isDragging: false,
        zIndex: -1
      });
    }
  }

  const physicalCards = useMemo(() => {
    console.log('updating via ' + JSON.stringify(cardStack));
    return cardStack.map((playmatCard, index) => {
      const {card, copy, left, top} = playmatCard;
      const physicalCardId = `physical-card_${card.id}_${copy}`;
      return (
        <PhysicalCard
          card={card}
          id={physicalCardId}
          key={physicalCardId}
          position={{ left, top, zIndex: index  }}
          onDoubleClick={() => {
            // turn sideways or upright
          }}>
        </PhysicalCard>
      );
    })
  }, [cardStack]);

  return <>
    <Deckbox addPlaymatCards={addCards} />
    <div 
      ref={drop} 
      id="playmat" 
      className="playmat" 
      style={playmatStyle}
      onMouseUp={selectArea}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => setDragSelectBoxProps({
        originX: event.pageX,
        originY: event.pageY,
        isDragging: true,
        zIndex: cardStack.length + 1,
      })}
    >
      <DragSelectBox {...dragSelectBoxProps} />
      {physicalCards}
    </div>
  </>;
}

export default Playmat;