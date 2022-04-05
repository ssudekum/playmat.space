import React, { useEffect, createContext, useReducer, Reducer } from 'react'
import Card from '../../lib/type/Card';
import PhysicalCard, { cardEquals } from '../../lib/type/PhysicalCard';
import CountedCollection from '../../lib/class/CountedCollection';
import CardLocation from '../../lib/enum/CardLocation';

type CardState = {
  cardStack: PhysicalCard[],
  selectedCards: PhysicalCard[],
  cardCollection: CountedCollection<Card>,
  isAnimationAllowed?: boolean,
  isDraggingSelection?: boolean,
};

const defaultState = {
  cardStack: [],
  selectedCards: [],
  cardCollection: new CountedCollection<Card>(),
};

export type CardContext = CardState & {
  addCards: (cards: CountedCollection<Card>) => void,
  removeCards: (cards: PhysicalCard[]) => void,
  setCardState: React.Dispatch<Partial<CardState>>,
};

const notImplemented = (name: string) => console.log(`${name} not implemented`);

export const defaultContext = {
  ...defaultState,
  addCards: () => notImplemented("addCards"),
  removeCards: () => notImplemented("removeCards"),
  setCardState: () => notImplemented("setCardState"),
};

export const getCardContext = () => createContext<CardContext>(defaultContext);

const useCards = () => {
  const [state, setState] = useReducer<Reducer<CardState, Partial<CardState>>>(
    (state, newState) => ({...state, ...newState}), 
    defaultState
  );

  const {
    cardStack,
    selectedCards,
    cardCollection,
    isAnimationAllowed,
    isDraggingSelection,
  } = state;

  const addCards = (adds: CountedCollection<Card>, cardLocation: CardLocation) => {
    const nextCardCollection = new CountedCollection(cardCollection);
    const nextCardStack = [...cardStack];
    for (const card of Object.values(adds.items)) {
      const copies = adds.counts[card.id];
      for (let i=1; i<=copies; i++) {
        nextCardCollection.addOne(card);
        nextCardStack.push({
          card,
          currentLocation: cardLocation,
          copy: nextCardCollection.counts[card.id],
          coordinate: {
            x: document.body.clientWidth / 2,
            y: document.body.clientHeight / 2,
          }
        });
      }
    }

    setState({
      cardStack: nextCardStack,
      cardCollection: nextCardCollection,
    });
  };

  const removeCards = (physicalCards: PhysicalCard[]) => {
    const nextCardStack = [...cardStack];
    const nextSelectedCards = [...selectedCards];
    const nextCardCollection = new CountedCollection(cardCollection);

    for (const physicalCard of physicalCards) {
      const card = physicalCard.card;
      const stackIndex = nextCardStack.findIndex((current) => cardEquals(current, physicalCard));
      const selectedIndex = nextSelectedCards.findIndex((current) => cardEquals(current, physicalCard));
      nextCardStack.splice(stackIndex, 1);
      nextSelectedCards.splice(selectedIndex, 1);
      nextCardCollection.subtractOne(card);
    }

    setState({
      cardStack: nextCardStack,
      selectedCards: nextSelectedCards,
      cardCollection: nextCardCollection,
    });
  };

  useEffect(() => {
    const removeCardsHandler = (event: KeyboardEvent) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        removeCards(selectedCards);
      }
    };

    document.addEventListener('keydown', removeCardsHandler);
    return () => {
      document.removeEventListener('keydown', removeCardsHandler);
    };
  }, [cardStack, selectedCards, cardCollection]);

  return {
    cardStack,
    selectedCards,
    cardCollection,
    isAnimationAllowed,
    isDraggingSelection,
    addCards,
    removeCards,
    setCardState: setState
  };
}

export default useCards;