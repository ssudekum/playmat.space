import React, {FC} from 'react'
import '../PhysicalCard/PhysicalCard.css'
import { SelectedCard } from './CustomDragLayer';
import SingleCardDragPreview from './SingleCardDragPreview';

export type MultiCardDragPreviewProps = {
  cards: SelectedCard[],
  anchor: SelectedCard
};

const MultiCardDragPreview: FC<MultiCardDragPreviewProps> = ({ cards, anchor }) => {
  if (!cards.length) return <></>;

  const relativeLeft = anchor.left;
  const relativeTop = anchor.top;
  const previews = cards.map((card, i) => {
    return (
      <SingleCardDragPreview
        key={i}
        src={card.image}
        style={{
          left: card.left - relativeLeft,
          top: card.top - relativeTop,
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
