import Card, {getCardImage as getImage} from "./Card";
import { Coordinate } from "./Spatial";

type PhysicalCard = {
  card: Card;
  copy: number;
  coordinate: Coordinate;
  sourceContextId?: string;
  currentContextId?: string;
  isTapped?: boolean;
  isFlipped?: boolean;
};

export const getCopyId = (physicalCard: PhysicalCard) => 
  `${physicalCard.card.id}-${physicalCard.copy}`;

export const isPhysicalCard = (card: Card | PhysicalCard): card is PhysicalCard =>
  (card as PhysicalCard).card !== undefined;

export const cardEquals = (a: PhysicalCard, b: PhysicalCard) => 
  a.card.id === b.card.id && a.copy === b.copy;

export const getCardImage = (physicalCard: PhysicalCard) =>
  getImage(physicalCard.card, physicalCard.isFlipped);

export default PhysicalCard;
