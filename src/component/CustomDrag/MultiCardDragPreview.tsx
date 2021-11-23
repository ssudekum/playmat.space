import React, {FC} from 'react'
import PlaymatCard, { getCardImage } from '../../lib/PlaymatCard';
import '../PhysicalCard/PhysicalCard.css'
import SingleCardDragPreview from './SingleCardDragPreview';

export type MultiCardDragPreviewProps = {
  selectedCards: PlaymatCard[],
  anchor: PlaymatCard
};

const MultiCardDragPreview: FC<MultiCardDragPreviewProps> = ({ selectedCards, anchor }) => {
  if (!selectedCards.length) return <></>;
  const relativeTapped = anchor.isTapped;
  let relativeLeft = anchor.left;
  let relativeTop = anchor.top;
  if (relativeTapped) {
    const elementId = `physical-card_${anchor.card.id}_${anchor.copy}`;
    const dimensions = document.getElementById(elementId)?.getBoundingClientRect();
    if (!dimensions) {
      throw Error(`Can't locate anchor card ${elementId} during drag`);
    }

    relativeLeft = relativeLeft - (dimensions.width - 214) / 2;
    relativeTop = relativeTop - (dimensions.height - 300) / 2;
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
