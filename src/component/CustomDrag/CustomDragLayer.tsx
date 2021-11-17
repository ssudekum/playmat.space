import React, {CSSProperties, FC} from 'react'
import { XYCoord, useDragLayer, DragObjectWithType } from 'react-dnd'
import Card from '../../lib/Card';
import { Draggable } from '../../lib/Draggable';
import SingleCardDragPreview from './SingleCardDragPreview';
import MultiCardDragPreview from './MultiCardDragPreview';

export type SelectedCard = {
  id: string;
  image?: string;
  left: number;
  top: number;
};

export type PhysicalCardsDO = DragObjectWithType & {
  cards: SelectedCard[]
  anchor: SelectedCard
};

export type TextCardDO = DragObjectWithType & {
  card: Card
};

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 998,
  left: 0,
  top: 0
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
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
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
  }))

  const renderItem = () => {
    switch (itemType) {
      case Draggable.TEXT_CARD:
        const textCardDO = item as TextCardDO;
        return <SingleCardDragPreview src={textCardDO.card.image_uris ? textCardDO.card.image_uris.png : undefined} />
      case Draggable.PHYSICAL_CARDS:
        const physcialCardsDO = item as PhysicalCardsDO;
        return <MultiCardDragPreview {...physcialCardsDO} />
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
