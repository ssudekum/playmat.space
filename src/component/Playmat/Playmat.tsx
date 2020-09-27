import React, { useState } from 'react';
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd';
import Card from '../../lib/Card';
import './Playmat.css';
import { ItemTypes } from '../../lib/ItemTypes';
import PhysicalCard from '../PhysicalCard/PhysicalCard';
import { DragSelectBox, DragSelectBoxProps } from './DragSelectBox/DragSelectBox'

interface DragObjectCard extends DragObjectWithType {
    card: Card
}

const Playmat : React.FC = () => {
    const [zIndex, setZIndex] = useState<number>(1);
    const [cards, setCards] = useState<Card[]>([]);
    const [dragSelectBoxProps, setDragSelectBoxProps] = useState<DragSelectBoxProps>({ 
        originX: 0, 
        originY: 0, 
        isDragging: false,
        zIndex: zIndex + 1
    });

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.CARD,
        canDrop: () => true,
        drop: (dragObject: DragObjectCard, target) => {
            addCard(dragObject.card, target);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    const addCard = (card: Card, target: DropTargetMonitor) => {
        let cardIdx = cards.findIndex(c => c.id === card.id);
        if (cardIdx === -1) {
            setCards([ ...cards, card]);
        }
        
        const offset = target.getSourceClientOffset();
        const ref = document.getElementById(`physical-card-${card.id}`);
        if (ref && offset) {
            const top = offset.y
            const left = offset.x
            setZIndex(zIndex + 1)
            ref.setAttribute('style', `
                top: ${top}px; 
                left: ${left}px; 
                z-index: ${zIndex}`);
        }
    }

    return (
        <div ref={drop} className="playmat" 
        onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => setDragSelectBoxProps({
            originX: event.pageX,
            originY: event.pageY,
            isDragging: true,
            zIndex: zIndex + 1
        })} 
        onMouseUp={() => setDragSelectBoxProps({
            originX: 0,
            originY: 0,
            isDragging: false,
            zIndex: zIndex + 1
        })}>
            <DragSelectBox {...dragSelectBoxProps}></DragSelectBox>
            {
                cards.map((card, idx) => 
                    <PhysicalCard 
                        card={card}
                        onDoubleClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => { 
                            setZIndex(zIndex + 1)
                            event.currentTarget.style.zIndex = (zIndex).toString() 
                        }}
                        key={`playmat-card-${card.id}`}>
                    </PhysicalCard>
                )
            }
        </div>
    );
}

export default Playmat;