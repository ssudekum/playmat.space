import { ReducerAction, ReducerActionType } from "../actions";

export const BASE_CARD_HEIGHT = 300;
export const BASE_CARD_WIDTH = 214;
export type CardSizeStore = {
  size: number;
};

export default function (state: CardSizeStore = {
  size: 1,
}, {
  type,
  value,
}: ReducerAction) {
  switch (type) {
    case ReducerActionType.SET_SIZE:
      return {
        ...state,
        size: value,
      };
    default:
      return state;
  }
}
