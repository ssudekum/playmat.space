import React, { FC, useEffect, useMemo } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { BASE_VERTICAL_CARD_HEIGHT, BASE_VERTICAL_CARD_WIDTH } from "../../redux/reducers/CardSizeReducer";
import Draggable from "../../lib/enum/Draggable";
import { getCopyId } from "../../lib/type/PhysicalCard";
import { Position } from '../../lib/type/Spatial';
import { CardDO } from "../../lib/class/CardDropHandler";
import DraggableCard from "../DraggableCard/DraggableCard";
import useCardContext, { defaultContext, getCardContext } from "../../lib/hook/useCardContext";
import "./Zone.css";
import { isPhysicalCardsDO } from "../DragPreview/CustomDragLayer";

export const ZoneCardContext = getCardContext();

export type ZoneProps = {
  label: string, // unique
  position: Position
};

const Zone: FC<ZoneProps> = ({ label, position }) => {
  const { context, handler }  = useCardContext(`${label.toLowerCase()}-zone`);
  const {
    cardStack,
    selectedCards,
    cardCollection,
    removeCards,
    setCardState,
  } = context;

  const cards = useMemo(() => (
    context.cardStack
      .map((card, index) => (
        <DraggableCard
          key={getCopyId(card)}
          cardContext={context}
          zIndex={index + 2}
          draggableCard={card}
        />
      ))
  ), [context]);

  const [,drop] = useDrop({
    accept: [Draggable.PHYSICAL_CARDS, Draggable.TEXT_CARDS],
    drop: (dropped: CardDO, monitor: DropTargetMonitor) => {
      if (!monitor.didDrop()) {
        handler.drop(dropped, monitor);
        return dropped;
      }
    },
  }, [handler]);

  const [{isDragging}, drag, preview] = useDrag({
    type: Draggable.ZONE,
    item: {
      type: Draggable.ZONE,
      cards,
      label,
      position,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  const classNames = [];
  if (isDragging) {
    classNames.push('hidden');
  }

  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  return (
    <ZoneCardContext.Provider value={{
      ...defaultContext,
      cardStack,
      selectedCards,
      cardCollection,
      removeCards,
      setCardState,
    }}>
      <div
        ref={drop}
        className={`zoneBox ${classNames.join(' ')}`}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          ...position,
          minHeight: BASE_VERTICAL_CARD_HEIGHT * cardSize + 50,
          minWidth: BASE_VERTICAL_CARD_WIDTH * cardSize + 20
        }}
      >
        <div
          ref={drag}
          className="zoneLabel">
          {label}
        </div>

        <div className="zoneCards">
          {cards}
        </div>
      </div>
    </ZoneCardContext.Provider>
  );
};

export default Zone;
