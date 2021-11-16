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

let playmatStyle = {};
if (playmatImage) {
  playmatStyle = {
    backgroundImage: `url(${playmatImage})`
  }
}

const Playmat: FC = () => {
  const [zIndex, setZIndex] = useState(1);
  const [cards, setCards] = useState(new CountedCollection<Card>());
  const [positionMap, setPositionMap] = useState<Record<string, Partial<CSSStyleDeclaration>>>({});
  const [dragSelectBoxProps, setDragSelectBoxProps] = useState<DragSelectBoxProps>({
    originX: 0,
    originY: 0,
    isDragging: false,
    zIndex: zIndex + 1
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
        let cardsCopy = new CountedCollection(cards);
        for (let [, card] of Object.entries(cardsCopy.items)) {
          const count = cardsCopy.counts[card.id]
          for (let i = 1; i <= count; i++) {
            let cardElem = document.getElementById(`physical-card-${card.id}-${i}`);
            if (cardElem && cardElem.getAttribute('selected') === 'true') {
              cardsCopy.subtractOne(card);
            }
          }
        }

        setCards(cardsCopy);
      }
    }

    document.addEventListener('keydown', eventListener);
    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, []);

  const addCards = (adds: CountedCollection<Card>) => {
    let cardsCopy = new CountedCollection(cards);
    cardsCopy.addCollection(adds);
    setCards(cardsCopy);
  };

  const dropCard = (id: string, card: Card, target: DropTargetMonitor) => {
    const offset = target.getSourceClientOffset();
    console.log(offset);
    if (offset) {
      const top = `${offset.y}px`;
      const left = `${offset.x}px`;
      let ref = document.getElementById(id);

      if (!ref) {
        let cardsCopy = new CountedCollection(cards);
        cardsCopy.addOne(card);
        setCards(cardsCopy);
        ref = document.getElementById(`physical-card-${card.id}-${cards.counts[card.id]}`);
        if (!ref) {
          console.error("card error");
          return;
        }
      } else {
        setZIndex(zIndex + 1);
      }

      ref.style.zIndex = zIndex.toString();
      ref.style.top = top;
      ref.style.left = left;
    }
  }

  const onMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (dragSelectBoxProps.isDragging) {
      const playmatElem = document.getElementById('playmat');
      if (!playmatElem) {
        console.error("Error: could not locate Playmat element")
        return
      }

      const originX = dragSelectBoxProps.originX
      const originY = dragSelectBoxProps.originY
      const mouseX = event.pageX
      const mouseY = event.pageY

      for (let [, card] of Object.entries(cards.items)) {
        const count = cards.counts[card.id]
        for (let i = 1; i <= count; i++) {
          let cardElem: HTMLElement | null = playmatElem.querySelector(`#physical-card-${card.id}-${i}`);
          if (cardElem) {
            const minY = Number(cardElem.style.top.replace('px', ''))
            const minX = Number(cardElem.style.left.replace('px', ''))
            const maxY = minY + 300
            const maxX = minX + 214

            let leftOrigin = minX > originX && originX < maxX
            let centerXOrigin = minX < originX && originX < maxX
            let rightOrigin = minX < originX && originX > maxX
            let aboveOrigin = minY > originY && originY < maxY
            let centerYOrigin = minY < originY && originY < maxY
            let belowOrigin = minY < originY && originY > maxY
            let leftMouse = minX > mouseX && mouseX < maxX
            let rightMouse = minX < mouseX && mouseX > maxX
            let aboveMouse = minY > mouseY && mouseY < maxY
            let belowMouse = minY < mouseY && mouseY > maxY

            // selection is based on where the mouse cannot be, given some point of origin
            let selected = ((leftOrigin && aboveOrigin && !leftMouse && !aboveMouse) || // upper left
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
      }

      setDragSelectBoxProps({
        originX: 0,
        originY: 0,
        isDragging: false,
        zIndex: zIndex + 1
      });
    }
  }

  const getPhysicalCard = (card: Card, index: number) => (
    <PhysicalCard
      num={index}
      card={card}
      key={`${card.id}-${index}`}
      onDoubleClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        setZIndex(zIndex + 1);
        event.currentTarget.style.zIndex = (zIndex).toString();
      }}>
    </PhysicalCard>
  );

  const physicalCards = useMemo(() => {
    return cards.items.map((card) => {
      let elements = [];
      let count = cards.counts[card.id];
      for (let i = 1; i <= count; i++) {
        elements.push(getPhysicalCard(card, i));
      }

      return elements
    });
  }, [cards]);

  return <>
    <Deckbox addPlaymatCards={addCards} />
    <div 
      ref={drop} 
      id="playmat" 
      className="playmat" 
      style={playmatStyle}
      onMouseUp={onMouseUp}
      onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => setDragSelectBoxProps({
        originX: event.pageX,
        originY: event.pageY,
        isDragging: true,
        zIndex: zIndex + 1
      })}
    >
      <DragSelectBox {...dragSelectBoxProps} />
      {physicalCards}
    </div>
  </>;
}

export default Playmat;