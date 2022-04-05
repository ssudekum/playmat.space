import { DropTargetMonitor } from "react-dnd";
import Card from "../../lib/type/Card";
import PhysicalCard, { cardEquals, isPhysicalCard } from "../../lib/type/PhysicalCard";
import CountedCollection from "../../lib/class/CountedCollection";
import { CardsDO, PhysicalCardsDO } from "../CustomDrag/CustomDragLayer";
import CardLocation from "../../lib/enum/CardLocation";

export type CardDO = CardsDO | PhysicalCardsDO;

export default class CardDropHandler {
  newCards: PhysicalCard[] = [];
  cardStack: PhysicalCard[];
  selectedCards: PhysicalCard[];
  cardCollection: CountedCollection<Card>;
  cardLocation: CardLocation;

  constructor(
    cardStack: PhysicalCard[],
    selectedCards: PhysicalCard[],
    cardCollection: CountedCollection<Card>,
    cardLocation: CardLocation,
  ) {
    this.cardStack = [...cardStack];
    this.selectedCards = [...selectedCards];
    this.cardCollection = new CountedCollection(cardCollection);
    this.cardLocation = cardLocation;
  }

  drop(dropped: CardDO, target: DropTargetMonitor) {
    let physicalCards = dropped.cards;
    this.newCards = [];
    for (const card of physicalCards) {
      this.dropCard(card, target);
    }
    if (this.newCards.length) {
      this.selectedCards = this.newCards;
    }
  }

  private dropCard(dropped: Card | PhysicalCard, target: DropTargetMonitor) {
    let card: Card;
    let stackIndex = -1;
    let selectedIndex = -1;
    if (isPhysicalCard(dropped)) {
      if (dropped.currentLocation) {
        // we already assigned this card a drop location through an alternative drop handler
        return;
      }

      stackIndex = this.cardStack.findIndex((stackCard) => cardEquals(stackCard, dropped));
      selectedIndex = this.selectedCards.findIndex((selectedCard) => cardEquals(selectedCard, dropped));
      card = dropped.card;
    } else {
      card = dropped;
    }
  
    const isNewCard = stackIndex === -1;
    let nextPhysicalCard: PhysicalCard;
    if (isNewCard) {
      nextPhysicalCard = this.createPhysicalCard(card, target);
      this.newCards.push(nextPhysicalCard)
    } else {
      nextPhysicalCard = this.updatePhysicalCard(
        stackIndex,
        selectedIndex,
        target
      );
      this.selectedCards.push(nextPhysicalCard);
    }
  
    this.cardStack.push(nextPhysicalCard);
  };

  private createPhysicalCard(card: Card, target: DropTargetMonitor): PhysicalCard {
    const offset = target.getSourceClientOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;
    this.cardCollection.addOne(card);

    return {
      card: card,
      currentLocation: this.cardLocation,
      copy: this.cardCollection.counts[card.id],
      coordinate: {
        x: offsetX,
        y: offsetY,
      }
    };
  }
  
  private updatePhysicalCard(
    stackIndex: number,
    selectedIndex: number,
    target: DropTargetMonitor,
  ): PhysicalCard {
    const offset = target.getDifferenceFromInitialOffset();
    const offsetX = offset?.x ?? document.body.clientWidth / 2;
    const offsetY = offset?.y ?? document.body.clientHeight / 2;
    const stackCard = this.cardStack.splice(stackIndex, 1)[0];
    if (selectedIndex !== -1) {
      this.selectedCards.splice(selectedIndex, 1);
    }
  
    return {
      ...stackCard,
      currentLocation: this.cardLocation,
      coordinate: {
        x: stackCard.coordinate.x + offsetX,
        y: stackCard.coordinate.y + offsetY,
      }
    };
  }
}
