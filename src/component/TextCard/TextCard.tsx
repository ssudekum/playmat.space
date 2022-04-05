import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './TextCard.css';
import Card, { getCardImage } from '../../lib/type/Card';
import Tooltip from 'react-tooltip';
import Draggable from '../../lib/enum/Draggable';
import { getEmptyImage } from 'react-dnd-html5-backend'
import { createPortal } from 'react-dom';

type TextCardProps = {
  card: Card
};

const TextCard: React.FC<TextCardProps> = ({ card }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: Draggable.TEXT_CARDS,
    item: { type: Draggable.TEXT_CARDS, cards: [card] },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  const image = getCardImage(card);

  const tooltip = () => (
    createPortal(
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
      </Tooltip>,
      document.body
    )
  );

  const openLink = () => {
    let win = window.open(card.scryfall_uri, '_blank');
    if (win) {
      win.focus()
    }
  };

  return (
    <div 
      ref={drag}
      data-tip
      data-for={`card-preview-${card.id}`}
      className="card"
      onClick={openLink}
    >
      {card.name}
      {isDragging ? null : tooltip()}
    </div>
  );
}

export default TextCard;
