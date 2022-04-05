import { DropTargetMonitor } from "react-dnd";
import Card from "../type/Card";
import PhysicalCard, { cardEquals, isPhysicalCard } from "../type/PhysicalCard";
import CountedCollection from "./CountedCollection";
import { CardsDO, isPhysicalCardsDO, PhysicalCardsDO } from "../../component/DragPreview/CustomDragLayer";
import { CardContext } from "../hook/useCardContext";

export type CardDO = CardsDO | PhysicalCardsDO;

export default class CardDropHandler {
  context: CardContext;
  nextCardStack: PhysicalCard[];
  nextSelectedCards: PhysicalCard[];
  nextCardCollection: CountedCollection<Card>;

  constructor(context: CardContext) {
    this.context = context;
    this.nextCardStack = [...context.cardStack];
    this.nextSelectedCards = [...context.selectedCards];
    this.nextCardCollection = new CountedCollection(context.cardCollection);
  }

  drop(dropped: CardDO, target: DropTargetMonitor) {
    const newPhysicalCards: PhysicalCard[] = [];
    dropped.cards.forEach((card: Card | PhysicalCard) => this.dropCard(card, target, newPhysicalCards));
    
    if (newPhysicalCards.length) {
      this.nextSelectedCards = newPhysicalCards;
    }
    if (isPhysicalCardsDO(dropped) && dropped.sourceContextId !== this.context.contextId) {
      dropped.sourceContextRemoval(dropped.cards);
    }

    this.context.setCardState({
      cardStack: this.nextCardStack,
      selectedCards: this.nextSelectedCards,
      cardCollection: this.nextCardCollection,
    });
  }

  private dropCard(dropped: Card | PhysicalCard, target: DropTargetMonitor, newPhysicalCards: PhysicalCard[]) {
    let card: Card;
    let stackIndex = -1;
    let selectedIndex = -1;
    if (isPhysicalCard(dropped)) {
      stackIndex = this.nextCardStack.findIndex((stackCard) => cardEquals(stackCard, dropped));
      selectedIndex = this.nextSelectedCards.findIndex((selectedCard) => cardEquals(selectedCard, dropped));
      card = dropped.card;
    } else {
      card = dropped;
    }
  
    const isNewCard = stackIndex === -1;
    let nextPhysicalCard: PhysicalCard;
    if (isNewCard) {
      nextPhysicalCard = this.createPhysicalCard(card, target);
      newPhysicalCards.push(nextPhysicalCard)
    } else {
      nextPhysicalCard = this.updatePhysicalCard(
        stackIndex,
        selectedIndex,
        target
      );
      this.nextSelectedCards.push(nextPhysicalCard);
    }
  
    this.nextCardStack.push(nextPhysicalCard);
  };

  private createPhysicalCard(card: Card, target: DropTargetMonitor): PhysicalCard {
    let offsetX = 0;
    let offsetY = 0;
    if (this.context.contextId === 'playmat') {
      const offset = target.getSourceClientOffset();
      offsetX = offset?.x ?? document.body.clientWidth / 2;
      offsetY = offset?.y ?? document.body.clientHeight / 2;
      this.nextCardCollection.addOne(card);
    }

    return {
      card: card,
      copy: this.nextCardCollection.counts[card.id],
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
    let offsetX = 0;
    let offsetY = 0;
    if (this.context.contextId === 'playmat') {
      const offset = target.getDifferenceFromInitialOffset();
      offsetX = offset?.x ?? document.body.clientWidth / 2;
      offsetY = offset?.y ?? document.body.clientHeight / 2;
    }
    
    const stackCard = this.nextCardStack.splice(stackIndex, 1)[0];
    if (selectedIndex !== -1) {
      this.nextSelectedCards.splice(selectedIndex, 1);
    }
  
    return {
      ...stackCard,
      coordinate: {
        x: stackCard.coordinate.x + offsetX,
        y: stackCard.coordinate.y + offsetY,
      }
    };
  }
}
