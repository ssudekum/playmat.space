import React, {FC} from 'react'
import { useSelector } from 'react-redux';
import PhysicalCard, { getCardImage } from '../../lib/PhysicalCard';
import { RootState } from '../../redux/reducers';
import { BASE_CARD_HEIGHT, BASE_CARD_WIDTH } from '../../redux/reducers/CardSizeReducer';
import '../PlaymatCard/PlaymatCard.css'
import SingleCardDragPreview from './SingleCardDragPreview';

export type MultiCardDragPreviewProps = {
  selectedCards: PhysicalCard[],
  anchor: PhysicalCard
};

const MultiCardDragPreview: FC<MultiCardDragPreviewProps> = ({ selectedCards, anchor }) => {
  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);

  if (!selectedCards.length) {
    return <></>;
  }

  const relativeTapped = anchor.isTapped;
  let relativeLeft = anchor.left;
  let relativeTop = anchor.top;
  if (relativeTapped) {
    const elementId = `playmat-card_${anchor.card.id}_${anchor.copy}`;
    const dimensions = document.getElementById(elementId)?.getBoundingClientRect();
    if (!dimensions) {
      throw Error(`Can't locate anchor card ${elementId} during drag`);
    }

    relativeLeft = relativeLeft - (dimensions.width - (BASE_CARD_WIDTH * cardSize)) / 2;
    relativeTop = relativeTop - (dimensions.height - (BASE_CARD_HEIGHT * cardSize)) / 2;
  }

  const previews = selectedCards.map((selected, i) => {
    return (
      <SingleCardDragPreview
        key={i}
        src={getCardImage(selected)}
        style={{
          left: selected.left - relativeLeft,
          top: selected.top - relativeTop,
          transform: selected.isTapped ? 'rotate(90deg)' : ''
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
