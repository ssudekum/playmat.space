import React, { useState } from 'react';
import './Deck.css';
import Search from '../Search/Search';
import Card from '../../lib/Card';
import CardTable from '../CardTable/CardTable';
import CountedCollection from '../../lib/CountedCollection';

const Deck : React.FC = props => {
    const [cards, setCards] = useState<CountedCollection<Card>>(new CountedCollection());
    
    const onSelect = (card: Card) => {
        cards.add(card);
        setCards(new CountedCollection(cards));
    };

    return <div className="list-container">
        <Search onSelect={onSelect}></Search>
        <CardTable cards={cards}></CardTable>
    </div>
}

export default Deck;