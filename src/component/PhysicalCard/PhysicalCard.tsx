import React from 'react';
import { useEffect } from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd';
import './PhysicalCard.css';
import Card from '../../lib/Card';
import { ItemTypes } from '../../lib/ItemTypes';
import { getEmptyImage } from 'react-dnd-html5-backend'

interface PhysicalCardProps {
    card: Card,
    onDoubleClick: DoubleClickFunction
}

interface DoubleClickFunction {
    (event: React.MouseEvent<HTMLImageElement, MouseEvent>): void
}

const PhysicalCard : React.FC<PhysicalCardProps> = ({ card, onDoubleClick }) => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.CARD, card: card },
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    return <>
        <img 
            id={`physical-card-${card.id}`} 
            className={`physical-card ${isDragging ? 'hidden' : ''}`}
            ref={drag}
            src={card.image_uris ? card.image_uris.png : ''}
            onDoubleClick={onDoubleClick}
            onMouseDown={(e) => e.stopPropagation()}>
        </img>
    </>
}

export default PhysicalCard;