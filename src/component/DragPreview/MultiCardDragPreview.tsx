import React, {FC} from 'react'
import { useSelector } from 'react-redux';
import PhysicalCard, { getCardImage } from '../../lib/type/PhysicalCard';
import { RootState } from '../../redux';
import { BASE_VERTICAL_CARD_HEIGHT, BASE_VERTICAL_CARD_WIDTH } from '../../redux/reducers/CardSizeReducer';
import SingleCardDragPreview from './SingleCardDragPreview';
import '../DraggableCard/DraggableCard.css';

export type MultiCardDragPreviewProps = {
  cards: PhysicalCard[],
  anchor: PhysicalCard
};

const MultiCardDragPreview: FC<MultiCardDragPreviewProps> = ({ cards, anchor }) => {
  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  const relativeTapped = anchor.isTapped;
  let relativeTop = anchor.coordinate.y;
  let relativeLeft = anchor.coordinate.x;
  if (relativeTapped) {
    relativeLeft = relativeLeft - (
      (BASE_VERTICAL_CARD_HEIGHT * cardSize) -
      (BASE_VERTICAL_CARD_WIDTH * cardSize)
    ) / 2;
    relativeTop = relativeTop - (
      (BASE_VERTICAL_CARD_WIDTH * cardSize) -
      (BASE_VERTICAL_CARD_HEIGHT * cardSize)
    ) / 2;
  }

  const previews = cards.map((card, i) => {
    return (
      <SingleCardDragPreview
        key={i}
        src={getCardImage(card)}
        style={{
          top: card.coordinate.y - relativeTop,
          left: card.coordinate.x - relativeLeft,
          transform: card.isTapped ? 'rotate(90deg)' : ''
        }}>
      </SingleCardDragPreview>
    );
  });

  return (
    <>
      {previews}
    </>
  );
};

export default MultiCardDragPreview;
