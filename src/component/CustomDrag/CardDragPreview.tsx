import React, { useEffect, useState, memo } from 'react'

export interface CardDragPreviewProps {
    src: string
}

export const CardDragPreview: React.FC<CardDragPreviewProps> = memo(
    ({ src }) => {
        return (
            <img className='physical-card' src={src}></img>
        )
    }
)
