import React, { CSSProperties, FC } from 'react'
import { XYCoord, useDragLayer } from 'react-dnd'
import Card, { getCardImage } from '../../lib/type/Card';
import PhysicalCard from '../../lib/type/PhysicalCard';
import Draggable from '../../lib/enum/Draggable';
import SingleCardDragPreview from './SingleCardDragPreview';
import MultiCardDragPreview from './MultiCardDragPreview';
import ZoneDragPreview from './ZoneDragPreview';
import { Position } from '../../lib/type/Spatial';

export type DragObjectWithType = {
  type: Draggable;
}

export type CardsDO = DragObjectWithType & {
  cards: Card[]
};

export type PhysicalCardsDO = DragObjectWithType & {
  cards: PhysicalCard[]
  anchor: PhysicalCard
};

export type ZoneDO = DragObjectWithType & {
  cards: PhysicalCard[],
  label: string,
  position: Position,
};

export const isZoneDO = (dropped: DragObjectWithType): dropped is ZoneDO =>
  (dropped as ZoneDO).type === Draggable.ZONE;

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 998,
  left: 0,
  top: 0,
};

const getItemStyles = (
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
): CSSProperties => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
}

export const CustomDragLayer: FC = () => {
  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  const renderItem = () => {
    switch (itemType) {
      case Draggable.TEXT_CARDS:
        const textCardDO = item as CardsDO;
        return <SingleCardDragPreview src={getCardImage(textCardDO.cards[0])} />
      case Draggable.PHYSICAL_CARDS:
        const physcialCardsDO = item as PhysicalCardsDO;
        return <MultiCardDragPreview {...physcialCardsDO} />
      case Draggable.ZONE:
        const zoneDO = item as ZoneDO;
        return <ZoneDragPreview {...zoneDO} />
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }
  
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
}
