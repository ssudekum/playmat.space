import React, { useEffect, createContext, useReducer, Reducer, useCallback } from 'react'
import Card from '../type/Card';
import PhysicalCard, { cardEquals } from '../type/PhysicalCard';
import CountedCollection from '../class/CountedCollection';

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
  addCards: (cards: CountedCollection<Card>, locationId: string) => void,
  removeCards: (cards: PhysicalCard[]) => void,
  setCardState: React.Dispatch<Partial<CardState>>,
};

const notImplemented = (name: string) => console.log(`${name} not implemented`);

export const defaultCardContext = {
  ...defaultState,
  addCards: () => notImplemented("addCards"),
  removeCards: () => notImplemented("removeCards"),
  setCardState: () => notImplemented("setCardState"),
};

export const getCardContext = () => createContext<CardContext>(defaultCardContext);

const useCardContext = (): CardContext => {
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

  const addCards = (adds: CountedCollection<Card>, locationId: string) => {
    const nextCardCollection = new CountedCollection(cardCollection);
    const nextCardStack = [...cardStack];
    for (const card of Object.values(adds.items)) {
      const copies = adds.counts[card.id];
      for (let i=1; i<=copies; i++) {
        nextCardCollection.addOne(card);
        nextCardStack.push({
          card,
          copy: nextCardCollection.counts[card.id],
          locationId,
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

  const removeCards = useCallback((physicalCards: PhysicalCard[]) => {
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
  }, [cardStack, selectedCards, cardCollection, setState]);

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
  }, [selectedCards, removeCards]);

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

export default useCardContext;