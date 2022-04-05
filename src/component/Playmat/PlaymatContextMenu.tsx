import React, { FC, useContext } from "react";
import CountedCollection from "../../lib/class/CountedCollection";
import ContextMenu from "../ContextMenu/ContextMenu";
import ContextOption from "../ContextMenu/ContextOption";
import { PlaymatContext } from "./Playmat";

const PlaymatContextMenu: FC = () => {
  const {
    cardStack,
    selectedCards,
    cardCollection,
    setCardState,
  } = useContext(PlaymatContext);

  const flip = () => {
    let nextSelectedCards = [...selectedCards];
    nextSelectedCards = nextSelectedCards.map((selectedCard) => {
      selectedCard.isFlipped = !selectedCard.isFlipped;
      return selectedCard;
    });
    setCardState({
      selectedCards: nextSelectedCards
    });
  };

  const clone = () => {
    const nextCardCollection = new CountedCollection(cardCollection);
    const nextCardStack = [...cardStack];

    for (const physicalCard of selectedCards) {
      const card = physicalCard.card;
      nextCardCollection.addOne(card);
      nextCardStack.push({
        ...physicalCard,
        copy: nextCardCollection.counts[card.id],
        coordinate: {
          x: physicalCard.coordinate.x + 25,
          y: physicalCard.coordinate.y + 25,
        }
      });
    }

    setCardState({
      cardStack: nextCardStack,
      cardCollection: nextCardCollection,
    });
  };

  const moveToFront = () => {

  };

  const moveToBack = () => {
    
  };

  const moveToGraveyard = () => {
    
  };

  const moveToExile = () => {
    
  };

  const moveToTopOfLibrary = () => {
    
  };

  const moveXFromTopOfLibrary = () => {
    
  };

  const moveToBottomOfLibrary = () => {
    
  };

  return (
    <ContextMenu id="playmat-menu">
      <ContextOption label="Flip" onClick={flip} />
      <ContextOption label="Clone" onClick={clone} />
      <ContextOption label="Move to">
        <ContextOption label="Front" onClick={moveToFront} />
        <ContextOption label="Back" onClick={moveToBack} />
        <ContextOption label="Graveyard" onClick={moveToGraveyard} />
        <ContextOption label="Exile" onClick={moveToExile} />
        <ContextOption label="Top of Library" onClick={moveToTopOfLibrary} />
        <ContextOption label="X card(s) from the Top of Library" onClick={moveXFromTopOfLibrary} />
        <ContextOption label="Bottom of Library in random order" onClick={moveToBottomOfLibrary} />
      </ContextOption>
    </ContextMenu>
  )
};

export default PlaymatContextMenu;