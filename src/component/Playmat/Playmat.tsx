import React, { FC, useState, useMemo, CSSProperties } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import {
  BASE_VERTICAL_CARD_HEIGHT,
  BASE_VERTICAL_CARD_WIDTH,
} from '../../redux/reducers/CardSizeReducer';
import Draggable from '../../lib/enum/Draggable';
import Deckbox from '../Deckbox/Deckbox';
import DraggableCard from '../DraggableCard/DraggableCard';
import Zone, { ZoneProps } from '../Zone/Zone';
import { isZoneDO, ZoneDO } from '../DragPreview/CustomDragLayer';
import useCardContext, { defaultContext, getCardContext } from '../../lib/hook/useCardContext';
import CardDropHandler, { CardDO } from "../../lib/class/CardDropHandler";
import DragSelect, { isSelected } from '../DragSelect/DragSelect';
import useDragSelect from '../DragSelect/useDragSelect';
import PlaymatContextMenu from './PlaymatContextMenu';
import playmatImage from '../../image/goyf-playmat.jpg'
import './Playmat.css';

let playmatStyle: CSSProperties = {
  userSelect: 'none'
};

if (playmatImage) {
  playmatStyle = {
    userSelect: 'none',
    backgroundImage: `url(${playmatImage})`
  }
}

export const PlaymatContext = getCardContext();

const Playmat: FC = () => {
  const playmatContext = useCardContext("playmat");
  const {
    cardStack,
    selectedCards,
    cardCollection,
    isAnimationAllowed,
    isDraggingSelection,
    addCards,
    setCardState,
  } = playmatContext;
  const [onMouseDown, onMouseMove] = useDragSelect();
  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  const [zoneData, setZoneData] = useState<ZoneProps[]>([
    {
      label: "Deck",
      position: { bottom: 400, right: 50 }
    },
    {
      label: "Graveyard",
      position: { bottom: 25, right: 50 }
    },
    {
      label: "Exile",
      position: { bottom: 25, left: 50 }
    }
  ]);

  const selectCards = (originX: number, originY: number, mouseX: number, mouseY: number) => {
    const nextSelectedCards = [];
    for (const draggableCard of cardStack) {
      const {x: minX, y: minY} = draggableCard.coordinate;
      const maxY = minY + (BASE_VERTICAL_CARD_HEIGHT * cardSize);
      const maxX = minX + (BASE_VERTICAL_CARD_WIDTH * cardSize);
      const selected = isSelected(minX, minY, maxX, maxY, originX, originY, mouseX, mouseY)
      if (selected) {
        nextSelectedCards.push(draggableCard);
      }
    }

    setCardState({
      selectedCards: nextSelectedCards
    });
  };
  
  const dropZone = (dropped: ZoneDO, target: DropTargetMonitor) => {
    const nextZoneData = [...zoneData];
    const offset = target.getSourceClientOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;
    const zoneIndex = nextZoneData.findIndex((zone) => zone.label === dropped.label);
    if (zoneIndex === -1) {
      throw Error(`Zone is missing from playmat`);
    }
    
    const zone = nextZoneData.splice(zoneIndex, 1)[0];
    zone.position.top = offsetY - 10;
    zone.position.left = offsetX - 10;
    zone.position.bottom = undefined;
    zone.position.right = undefined;
    nextZoneData.push(zone);
    setZoneData(nextZoneData);
  };

  const cards = useMemo(() => (
    playmatContext.cardStack.map((physicalCard, index) => (
      <DraggableCard
        key={`${physicalCard.card.id}-${physicalCard.copy}`}
        cardContext={playmatContext}
        zIndex={index + 2}
        draggableCard={physicalCard}
      />
    ))
  ), [playmatContext]);

  const zones = useMemo(() => (
    zoneData.map((zone) => (
      <Zone
        key={zone.label}
        {...zone}>
      </Zone>
    ))
  ), [zoneData]);

  const [,drop] = useDrop({
    accept: [Draggable.PHYSICAL_CARDS, Draggable.TEXT_CARDS, Draggable.ZONE],
    drop: (dropped: CardDO | ZoneDO, monitor: DropTargetMonitor) => {
      if (!monitor.didDrop()) {
        if (isZoneDO(dropped)) {
          dropZone(dropped, monitor);
        } else {
          const handler = new CardDropHandler(playmatContext);
          handler.drop(dropped, monitor);
        }
        return dropped;
      }
    },
  }, [playmatContext]);

  return (<>
    <Deckbox addCards={addCards}/>
    <PlaymatContext.Provider value={{
      ...defaultContext,
      cardStack,
      selectedCards,
      cardCollection,
      isAnimationAllowed,
      isDraggingSelection,
      setCardState,
    }}>
      <div
        ref={drop}
        id="playmat"
        className="playmat"
        style={playmatStyle}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        <PlaymatContextMenu />
        <DragSelect zIndex={cardStack.length + 3} onSelect={selectCards} />
        {cards}
        {zones}
      </div>
    </PlaymatContext.Provider>
  </>);
}

export default Playmat;