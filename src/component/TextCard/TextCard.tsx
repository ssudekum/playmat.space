import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './TextCard.css';
import Card from '../../lib/Card';
import Tooltip from 'react-tooltip';
import { Draggable } from '../../lib/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend'

type TextCardProps = {
  card: Card
};

const TextCard: React.FC<TextCardProps> = ({ card }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: Draggable.CARD, id: null, card: card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  const image = card.image_uris ? card.image_uris.png : "";
  
  const tooltip = () => (
    <Tooltip
      id={`card-preview-${card.id}`}
      className="preview-tooltip"
      place="right"
      type="light"
      effect="float"
    >
      {
        image 
          ? <img src={image} className='tooltip-img' alt="card-preview"></img> 
          : "Image Unavailable"
      }
    </Tooltip>
  );

  const openLink = () => {
    let win = window.open(card.scryfall_uri, '_blank');
    if (win) {
      win.focus()
    }
  };

  return (
    <td 
      ref={drag}
      data-tip
      data-for={`card-preview-${card.id}`}
      className="card"
      onClick={openLink}
    >
      {card.name}
      {isDragging ? null : tooltip()}
    </td>
  );
}

export default TextCard;
