import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import PhysicalCard from '../../lib/type/PhysicalCard';
import { RootState } from '../../redux';
import { BASE_VERTICAL_CARD_HEIGHT, BASE_VERTICAL_CARD_WIDTH } from '../../redux/reducers/CardSizeReducer';
import '../Playmat/DraggableCard/DraggableCard.css';

export type ZoneDragPreviewProps = {
  cards: PhysicalCard[],
  label: string,
};

const ZoneDragPreview: FC<ZoneDragPreviewProps> = ({ cards, label }) => {
  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  return (
    <div
      className="zoneBox"
      style={{
        minHeight: BASE_VERTICAL_CARD_HEIGHT * cardSize + 50,
        minWidth: BASE_VERTICAL_CARD_WIDTH * cardSize + 20,
        top: -10,
        left: -10,
      }}
    >
      <div className="zoneLabel">{label}</div>
      <div className="zoneCards">{cards}</div>
    </div>
  );
};

export default ZoneDragPreview;
