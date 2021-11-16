import React, { FC, useState, useEffect, useMemo, CSSProperties } from 'react'
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd'
import Card from '../../lib/Card'
import './Playmat.css'
import { Draggable } from '../../lib/Draggable'
import PhysicalCard, {CardPosition} from '../PhysicalCard/PhysicalCard'
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
  const [positionMap, setPositionMap] = useState<Record<string, CardPosition[]>>({});
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

  const shiftPositionMap = (cardId: string, instanceNumber: number): Record<string, CardPosition[]> => {
    const nextPositionMap = {...positionMap};
    const currentPhysicalSet = nextPositionMap[cardId];
    if (currentPhysicalSet.length === 1) {
      delete nextPositionMap[cardId];
    } else {
      currentPhysicalSet.splice(instanceNumber, 1);
    }
    return nextPositionMap;
  };

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const nextCards = new CountedCollection(cards);
        let nextPositionMap = {...positionMap};
        for (let card of Object.values(nextCards.items)) {
          const count = nextCards.counts[card.id];
          for (let i = 0; i < count; i++) {
            let cardElem = document.getElementById(`physical-card_${card.id}_${i}`);
            if (cardElem && cardElem.getAttribute('selected') === 'true') {
              nextPositionMap = shiftPositionMap(card.id, i);
              nextCards.subtractOne(card);
            }
          }
        }

        setCards(nextCards);
        setPositionMap(nextPositionMap);
      }
    }

    document.addEventListener('keydown', eventListener);
    return () => {
      document.removeEventListener('keydown', eventListener);
    };
  }, [cards]);

  const addCards = (adds: CountedCollection<Card>) => {
    const nextCards = new CountedCollection(cards);
    nextCards.addCollection(adds);
    const nextPositionMap = {...positionMap};
    let currentZIndex = zIndex;
    for (let card of Object.values(adds.items)) {
      if (!nextPositionMap[card.id]) {
        nextPositionMap[card.id] = [];
      }
      
      const count = nextCards.counts[card.id];
      const currentPhysicalSet = nextPositionMap[card.id];
      for (let i = 0; i < count; i++) {
        currentZIndex++;
        const instanceNumber = currentPhysicalSet.length;
        currentPhysicalSet[instanceNumber] = {
          zIndex: currentZIndex,
          top: document.body.clientHeight / 2,
          left: document.body.clientWidth / 2,
        };
      }
    }

    setCards(nextCards);
    setPositionMap(nextPositionMap);
  };

  const dropCard = (id: string, card: Card, target: DropTargetMonitor) => {
    const offset = target.getSourceClientOffset();
    if (offset) {
      let instanceNumber;
      const nextPositionMap = {...positionMap};

      if (id) {
        instanceNumber = Number(id.split("_")[2]);
      } else {
        const nextCards = new CountedCollection(cards);
        nextCards.addOne(card);
        setCards(nextCards);
        if (!nextPositionMap[card.id]) {
          nextPositionMap[card.id] = [];
        }
        instanceNumber = nextPositionMap[card.id].length;
      }

      const nextZ = zIndex + 1;
      const currentPhysicalSet = nextPositionMap[card.id];
      currentPhysicalSet[instanceNumber] = {
        zIndex: nextZ,
        top: offset.y,
        left: offset.x
      };

      console.log(nextPositionMap);
      
      setZIndex(nextZ);
      setPositionMap(nextPositionMap);
    }
  }

  const selectArea = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

      for (let card of Object.values(cards.items)) {
        const count = cards.counts[card.id]
        for (let i = 0; i < count; i++) {
          const cardElem = playmatElem.querySelector(`#physical-card_${card.id}_${i}`);
          const cardPosition = positionMap[card.id][i];
          
          if (cardElem && cardPosition) {
            console.log(cardPosition);
            const minY = cardPosition.top;
            const minX = cardPosition.left;
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
            console.log(selected);
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

  const physicalCards = useMemo(() => {
    return cards.items.map((card) => {
      const elements = [];
      const count = cards.counts[card.id];
      const positions = positionMap[card.id];
      if (positions?.length) {
        for (let i = 0; i < count; i++) {
          const physicalCardId = `physical-card_${card.id}_${i}`;
          const currentPosition = positions[i];
          if (currentPosition) {
            elements.push(
              <PhysicalCard
                card={card}
                id={physicalCardId}
                key={physicalCardId}
                position={currentPosition}
                onDoubleClick={() => {
                  const nextZ = zIndex + 1;
                  const nextPositionMap = {...positionMap};
                  setZIndex(nextZ);
                  nextPositionMap[card.id][i].zIndex = nextZ;
                  setPositionMap(nextPositionMap);
                }}>
              </PhysicalCard>
            );
          }
        }
      }

      return elements
    });
  }, [cards, positionMap]);

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
        zIndex: zIndex + 1
      })}
    >
      <DragSelectBox {...dragSelectBoxProps} />
      {physicalCards}
    </div>
  </>;
}

export default Playmat;