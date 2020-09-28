import React, { memo } from 'react'

export interface CardDragPreviewProps {
    src: string
}

export const CardDragPreview: React.FC<CardDragPreviewProps> = memo(
    ({ src }) => {
        return (
            <img alt="card-preview" className='physical-card' src={src}></img>
        )
    }
)
