import React, { memo } from 'react'
import '../PhysicalCard/PhysicalCard.css'

export type CardDragPreviewProps = {
  src: string
};

const CardDragPreview: React.FC<CardDragPreviewProps> = memo(({ src }) => (
  <img 
    alt="card-preview" 
    className='physical-card-preview' 
    src={src}>
  </img>
));

export default CardDragPreview;
