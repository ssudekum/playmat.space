import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './TextCard.css';
import Card from '../../lib/Card';
import Tooltip from 'react-tooltip';
import { ItemTypes } from '../../lib/ItemTypes';
import { getEmptyImage } from 'react-dnd-html5-backend'

interface TextCardProps {
    card: Card
}

const TextCard : React.FC<TextCardProps> = ({ card }) => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.CARD, id: null, card: card },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [preview])

    const image = card.image_uris ? card.image_uris.png : "";

    return <td ref={drag} data-tip data-for={`card-preview-${card.id}`} className="card" onClick={() => {
        let win = window.open(card.scryfall_uri, '_blank');
         if (win) { 
             win.focus() 
        }
    }}>
        {card.name}
        {!isDragging 
            ? 
            <Tooltip
                id={`card-preview-${card.id}`}
                className="preview-tooltip"
                place="right"
                type="light"
                effect="float">
                {
                    image ? <img src={image} className='tooltip-img' alt="card-preview"></img> : "Image Unavailable"
                }
            </Tooltip> 
            : 
            null
        }
    </td>
}

export default TextCard;