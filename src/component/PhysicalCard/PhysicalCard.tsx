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
    }, [preview])

    const selectOnlyThis = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        event.currentTarget.setAttribute('selected', 'true') 
        const playmatElem = document.getElementById('playmat');
        if (!playmatElem) {
            console.error("Error: could not locate Playmat element")
            return
        }

        let cardElements : HTMLCollectionOf<Element> = playmatElem.getElementsByClassName('physical-card')
        for (let [, cardElem] of Object.entries(cardElements)) {
            if (cardElem && 
                cardElem.getAttribute('id') !== `physical-card-${card.id}` && 
                cardElem.getAttribute('selected') === 'true') {
                cardElem.setAttribute('selected', 'false')
            }
        }

        event.stopPropagation()
    }

    return <>
        <img 
            id={`physical-card-${card.id}`} 
            className={`physical-card ${isDragging ? 'hidden' : ''}`}
            ref={drag}
            alt={card.name}
            src={card.image_uris ? card.image_uris.png : ''}
            onDoubleClick={onDoubleClick}
            onMouseDown={selectOnlyThis}>
        </img>
    </>
}

export default PhysicalCard;