import Card, {getCardImage as getImage} from "./Card";

type PhysicalCard = {
  card: Card;
  copy: number;
  left: number;
  top: number;
  isTapped?: boolean;
  isFlipped?: boolean;
};

export const cardEquals = (a: PhysicalCard, b: PhysicalCard) => 
  a.card.id === b.card.id && a.copy === b.copy;

export const getCardImage = (playmatCard: PhysicalCard) =>
  getImage(playmatCard.card, playmatCard.isFlipped);

export default PhysicalCard;
