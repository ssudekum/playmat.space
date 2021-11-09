import React, { FC, useState } from 'react';
import './Deck.css';
import Search from '../Search/Search';
import Card from '../../lib/Card';
import CardTable from '../CardTable/CardTable';
import CountedCollection from '../../lib/CountedCollection';
import ImportModal from './ImportModal/ImportModal'

type DeckProps = {
  addPlaymatCards: (cards: CountedCollection<Card>) => void
};

const Deck: FC<DeckProps> = ({ addPlaymatCards }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<CountedCollection<Card>>(new CountedCollection());

  const onSelect = (card: Card) => {
    cards.addOne(card);
    setCards(new CountedCollection(cards));
  };

  const onImport = (data: CountedCollection<Card>) => {
    cards.addCollection(data)
    setCards(new CountedCollection(cards));
  }

  return <div className="list-container">
    <Search onSelect={onSelect}></Search>

    <button 
      className="button" 
      onClick={() => setIsModalVisible(true)}>
      Import List
    </button>

    <button 
      className="button" 
      disabled={cards.getTotalCount() === 0 ? true : false} 
      onClick={() => addPlaymatCards(cards)}>
      Add to Playmat
    </button>

    <CardTable cards={cards}></CardTable>
    <ImportModal 
      visible={isModalVisible} 
      setVisible={setIsModalVisible} 
      onImport={onImport}>
    </ImportModal>
  </div>
}

export default Deck;