import React, { memo } from 'react'
import '../PhysicalCard/PhysicalCard.css'

export interface CardDragPreviewProps {
    src: string
}

export const CardDragPreview: React.FC<CardDragPreviewProps> = memo(
    ({ src }) => {
        return (
            <img alt="card-preview" className='physical-card-preview' src={src}></img>
        )
    }
)
