import { DropTargetMonitor } from "react-dnd";
import Card from "../type/Card";
import PhysicalCard, { cardEquals, isPhysicalCard } from "../type/PhysicalCard";
import CountedCollection from "./CountedCollection";
import { CardsDO, PhysicalCardsDO } from "../../component/DragPreview/CustomDragLayer";
import { CardContext } from "../hook/useCardContext";

export type CardDO = CardsDO | PhysicalCardsDO;

export default class CardDropHandler {
  locationId: string;
  context: CardContext;
  nextCardStack: PhysicalCard[] = [];
  nextSelectedCards: PhysicalCard[] = [];
  nextCardCollection: CountedCollection<Card> = new CountedCollection();

  constructor(locationId: string, context: CardContext) {
    this.context = context;
    this.locationId = locationId;
  }

  drop(dropped: CardDO, target: DropTargetMonitor) {
    this.nextCardStack = [...this.context.cardStack];
    this.nextSelectedCards = [...this.context.selectedCards];
    this.nextCardCollection = new CountedCollection(this.context.cardCollection);

    const newPhysicalCards: PhysicalCard[] = [];
    dropped.cards.forEach((card: Card | PhysicalCard) => this.dropCard(card, target, newPhysicalCards));
    if (newPhysicalCards.length) {
      this.nextSelectedCards = newPhysicalCards;
    }

    this.context.setCardState({
      cardStack: this.nextCardStack,
      selectedCards: this.nextSelectedCards,
      cardCollection: this.nextCardCollection,
    });
  }

  private dropCard(dropped: Card | PhysicalCard, target: DropTargetMonitor, newPhysicalCards: PhysicalCard[]) {
    let nextPhysicalCard: PhysicalCard;
    if (isPhysicalCard(dropped)) {
      const stackIndex = this.nextCardStack.findIndex((stackCard) => cardEquals(stackCard, dropped));
      const stackCard = this.nextCardStack.splice(stackIndex, 1)[0];
      const selectedIndex = this.nextSelectedCards.findIndex((selectedCard) => cardEquals(selectedCard, dropped));
      if (selectedIndex !== -1) {
        this.nextSelectedCards.splice(selectedIndex, 1);
      }

      nextPhysicalCard = this.updatePhysicalCard(stackCard, target);
      this.nextSelectedCards.push(nextPhysicalCard);
    } else {
      nextPhysicalCard = this.createPhysicalCard(dropped, target);
      newPhysicalCards.push(nextPhysicalCard)
    }
  
    this.nextCardStack.push(nextPhysicalCard);
  };

  private createPhysicalCard(card: Card, target: DropTargetMonitor): PhysicalCard {
    let offsetX = 0;
    let offsetY = 0;

    if (this.locationId === "playmat") {
      const offset = target.getSourceClientOffset();
      offsetX = offset?.x ?? document.body.clientWidth / 2;
      offsetY = offset?.y ?? document.body.clientHeight / 2;
      this.nextCardCollection.addOne(card);
    }

    return {
      card,
      copy: this.nextCardCollection.counts[card.id],
      locationId: this.locationId,
      coordinate: {
        x: offsetX,
        y: offsetY,
      }
    };
  }
  
  private updatePhysicalCard(
    card: PhysicalCard,
    target: DropTargetMonitor,
  ): PhysicalCard {
    let offsetX = 0;
    let offsetY = 0;
    let targetOffset;

    if (this.locationId === "playmat" && card.locationId === "playmat") {
      targetOffset = target.getDifferenceFromInitialOffset();
    } else if (this.locationId === "playmat") {
      targetOffset = target.getSourceClientOffset();
    }

    if (targetOffset) {
      offsetX = targetOffset?.x ?? document.body.clientWidth / 2;
      offsetY = targetOffset?.y ?? document.body.clientHeight / 2;
      offsetX += card.coordinate.x;
      offsetY += card.coordinate.y;
    }
  
    return {
      ...card,
      locationId: this.locationId,
      coordinate: {
        x: offsetX,
        y: offsetY,
      }
    };
  }
}
