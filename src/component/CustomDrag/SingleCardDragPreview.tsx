import React, { CSSProperties, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { BASE_VERTICAL_CARD_HEIGHT } from '../../redux/reducers/CardSizeReducer';
import '../Playmat/DraggableCard/DraggableCard.css';

export type SingleCardDragPreviewProps = {
  src?: string,
  style?: CSSProperties
};

const SingleCardDragPreview: FC<SingleCardDragPreviewProps> = ({ src, style }) => {
  const cardSize = useSelector((state: RootState) => state.cardSizeReducer.size);
  return (
    <img
      src={src}
      style={{
        ...style,
        height: `${BASE_VERTICAL_CARD_HEIGHT * cardSize}px`
      }}
      alt="card-preview"
      className='draggable-card-preview'>
    </img>
  );
};

export default SingleCardDragPreview;
