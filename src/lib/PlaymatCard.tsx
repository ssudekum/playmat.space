import Card, {getCardImage as getImage} from "./Card";

type PlaymatCard = {
  card: Card;
  copy: number;
  left: number;
  top: number;
  isTapped?: boolean;
  isFlipped?: boolean;
};

export const cardEquals = (a: PlaymatCard, b: PlaymatCard) => 
  a.card.id === b.card.id && a.copy === b.copy;

export const getCardImage = (playmatCard: PlaymatCard) =>
  getImage(playmatCard.card, playmatCard.isFlipped);

export default PlaymatCard;
