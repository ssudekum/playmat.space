import React, { CSSProperties, FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { BASE_CARD_HEIGHT } from '../../redux/reducers/CardSizeReducer';
import '../PlaymatCard/PlaymatCard.css';

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
        height: `${BASE_CARD_HEIGHT * cardSize}px`
      }}
      alt="card-preview"
      className='playmat-card-preview'>
    </img>
  );
};

export default SingleCardDragPreview;
