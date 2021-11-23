import React, {CSSProperties, FC, memo} from 'react';
import '../PlaymatCard/PlaymatCard.css';

export type SingleCardDragPreviewProps = {
  src?: string,
  style?: CSSProperties
};

const SingleCardDragPreview: FC<SingleCardDragPreviewProps> = memo(({ src, style }) => (
  <img
    src={src}
    style={style}
    alt="card-preview"
    className='playmat-card-preview'>
  </img>
));

export default SingleCardDragPreview;
