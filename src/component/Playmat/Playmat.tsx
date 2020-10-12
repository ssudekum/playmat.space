import React, { useState, useEffect } from 'react';
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd';
import Card from '../../lib/Card';
import './Playmat.css';
import { ItemTypes } from '../../lib/ItemTypes';
import PhysicalCard from '../PhysicalCard/PhysicalCard';
import { DragSelectBox, DragSelectBoxProps } from './DragSelectBox/DragSelectBox'
import './Toolbox.css'
import Deck from '../Deck/Deck';
import playmatImage from '../../image/goyf-playmat.jpg'
import CountedCollection from '../../lib/CountedCollection';

interface DragObjectCard extends DragObjectWithType {
    card: Card
}

const Playmat : React.FC = () => {
    const [toolboxIsVisible, setToolboxIsVisible] = useState(true);
    const [zIndex, setZIndex] = useState<number>(1)
    const [cards, setCards] = useState<Card[]>([])
    const [dragSelectBoxProps, setDragSelectBoxProps] = useState<DragSelectBoxProps>({ 
        originX: 0, 
        originY: 0, 
        isDragging: false,
        zIndex: zIndex + 1
    })

    const [,drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (dragObject: DragObjectCard, target) => {
            dropCard(dragObject.card, target)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    useEffect(() => {
        const eventListener = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                const playmatElem = document.getElementById('playmat');
                if (!playmatElem) {
                    console.error("Error: could not locate Playmat element")
                    return
                }

                let cardsCopy = [...cards]
                for (let [, card] of Object.entries(cardsCopy)) {
                    let cardElem : HTMLElement | null = playmatElem.querySelector(`#physical-card-${card.id}`)
                    if (cardElem && cardElem.getAttribute('selected') === 'true') {
                        cardsCopy.splice(cardsCopy.indexOf(card), 1)
                    }
                }
                
                setCards(cardsCopy)
            }
        }

        document.addEventListener('keydown', eventListener);
        return function cleanup() {
            document.removeEventListener('keydown', eventListener);
        };
    }, [cards])

    const addCards = (adds: CountedCollection<Card>) => {
        let totalAdds: Card[] = []
        for (let i = 0; i < adds.items.length; i++) {
            let card = adds.items[i]
            for (let j = 0; j < adds.counts[card.id]; j++) {
                totalAdds.push({ ...card })
            }
        }

        setCards([ ...cards, ...totalAdds])
    }

    const dropCard = (card: Card, target: DropTargetMonitor) => {
        let cardIdx = cards.findIndex(c => c.id === card.id)
        if (cardIdx === -1) {
            setCards([ ...cards, card])
        }
        
        const offset = target.getSourceClientOffset()
        const ref = document.getElementById(`physical-card-${card.id}`)
        if (ref && offset) {
            const top = offset.y
            const left = offset.x
            setZIndex(zIndex + 1)
            ref.setAttribute('style', `
                top: ${top}px; 
                left: ${left}px; 
                z-index: ${zIndex}`)
        }
    }

    const onMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (dragSelectBoxProps.isDragging) {
            const playmatElem = document.getElementById('playmat');
            if (!playmatElem) {
                console.error("Error: could not locate Playmat element")
                return
            } 

            const originX = dragSelectBoxProps.originX
            const originY = dragSelectBoxProps.originY
            const mouseX = event.pageX
            const mouseY = event.pageY

            for (let [, card] of Object.entries(cards)) {
                let cardElem : HTMLElement | null = playmatElem.querySelector(`#physical-card-${card.id}`);
                if (cardElem) {
                    const minY = Number(cardElem.style.top.replace('px', ''))
                    const minX = Number(cardElem.style.left.replace('px', ''))
                    const maxY = minY + 300
                    const maxX = minX + 214

                    let leftOrigin = minX > originX && originX < maxX
                    let centerXOrigin = minX < originX && originX < maxX
                    let rightOrigin = minX < originX && originX > maxX
                    let aboveOrigin = minY > originY && originY < maxY
                    let centerYOrigin = minY < originY && originY < maxY
                    let belowOrigin = minY < originY && originY > maxY
                    let leftMouse = minX > mouseX && mouseX < maxX
                    let rightMouse = minX < mouseX && mouseX > maxX
                    let aboveMouse = minY > mouseY && mouseY < maxY
                    let belowMouse = minY < mouseY && mouseY > maxY

                    // selection is based on where the mouse cannot be, given some point of origin
                    let selected = ((leftOrigin && aboveOrigin && !leftMouse && !aboveMouse) || // upper left
                        (leftOrigin && centerYOrigin && !leftMouse) || // left of center
                        (leftOrigin && belowOrigin && !leftMouse && !belowMouse) || // bottom left
                        (centerXOrigin && aboveOrigin && !aboveMouse) || // above center
                        (centerXOrigin && belowOrigin && !belowMouse) || // below center
                        (rightOrigin && aboveOrigin && !rightMouse && !aboveMouse) || // upper right
                        (rightOrigin && centerYOrigin && !rightMouse) || // right of center
                        (rightOrigin && belowOrigin && !rightMouse && !belowMouse)) // bottom right

                    if (selected) {
                        cardElem.setAttribute('selected', 'true');
                    } else {
                        cardElem.setAttribute('selected', 'false');
                    }
                }
            }

            setDragSelectBoxProps({
                originX: 0,
                originY: 0,
                isDragging: false,
                zIndex: zIndex + 1
            })
        }
    }

    let playmatStyle = {};
    /*(if (playmatImage) {
        playmatStyle = {
            backgroundImage: `url(${playmatImage})`
        }
    }*/

    return <>
        <div className={`toolbox ${(toolboxIsVisible ? '' : 'hidden-toolbox')}`}>
            <i className={`fas fa-caret-square-left collapsible ${toolboxIsVisible ? '' : 'hidden-icon'}`} onClick={() => setToolboxIsVisible(false)}></i>
            <i className={`fas fa-caret-square-right collapsible ${toolboxIsVisible ? 'hidden-icon' : ''}`} onClick={() => setToolboxIsVisible(true)}></i>
            <div className={`toolbox-content ${(toolboxIsVisible ? '' : 'hidden-content')}`}>
                <Deck addPlaymatCards={addCards}></Deck>
            </div>
        </div>

        <div ref={drop} id="playmat" className="playmat" style={playmatStyle}
            onMouseUp={onMouseUp}
            onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => setDragSelectBoxProps({
                originX: event.pageX,
                originY: event.pageY,
                isDragging: true,
                zIndex: zIndex + 1
            })}>
            <DragSelectBox {...dragSelectBoxProps}></DragSelectBox>
            {
                cards.map((card) => 
                    <PhysicalCard 
                        card={card}
                        key={card.id}
                        onDoubleClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => { 
                            setZIndex(zIndex + 1)
                            event.currentTarget.style.zIndex = (zIndex).toString() 
                        }}>
                    </PhysicalCard>
                )
            }
        </div>
    </>;
}

export default Playmat;