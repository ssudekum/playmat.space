import React, { FC, useState } from 'react'
import Card from '../../lib/type/Card';
import CountedCollection from '../../lib/class/CountedCollection';
import Decklist from '../Decklist/Decklist';
import ImportModal from '../Modal/ImportModal/ImportModal';
import CardSearch from '../CardSearch/CardSearch';
import './Deckbox.css'
import CardLocation from '../../lib/enum/CardLocation';

type DeckboxProps = {
  addCards: (cards: CountedCollection<Card>, cardLocation: CardLocation) => void
};

const Deckbox: FC<DeckboxProps> = ({ addCards }) => {
  const [isDeckboxVisible, setIsDeckboxVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cards, setCards] = useState<CountedCollection<Card>>(new CountedCollection());

  const onSelect = (card: Card) => {
    cards.addOne(card);
    setCards(new CountedCollection(cards));
  };

  const onImport = (data: CountedCollection<Card>) => {
    cards.addCollection(data);
    setCards(new CountedCollection(cards));
  };

  return (
    <div className={`deckbox ${(isDeckboxVisible ? '' : 'hidden-deckbox')}`}>
      <i 
        className={`fas fa-caret-square-left collapsible ${isDeckboxVisible ? '' : 'hidden-icon'}`} 
        onClick={() => setIsDeckboxVisible(false)}>
      </i>

      <i 
        className={`fas fa-caret-square-right collapsible ${isDeckboxVisible ? 'hidden-icon' : ''}`} 
        onClick={() => setIsDeckboxVisible(true)}>
      </i>

      <div className={`deckbox-content ${(isDeckboxVisible ? '' : 'hidden-content')}`}>
        <div className="decklist-container">
          <CardSearch onSelect={onSelect} />

          <button
            className="button" 
            onClick={() => setIsModalVisible(true)}>
            Import List
          </button>

          <button
            className="button" 
            disabled={cards.getTotalCount() === 0 ? true : false} 
            onClick={() => addCards(cards, CardLocation.PLAYMAT)}
          >
            Add to Playmat
          </button>

          <Decklist cards={cards} />
          
          <ImportModal
            visible={isModalVisible} 
            setVisible={setIsModalVisible} 
            onImport={onImport}>
          </ImportModal>
        </div>
      </div>
    </div>
  );
};

export default Deckbox;
