import { ReducerAction, ReducerActionType } from "../actions";
import { Coordinate } from "../../lib/type/Spatial";

export type PlaymatStore = {
  coordinates: Record<string, Coordinate>;
};

const defaultStore: PlaymatStore = {
  coordinates: {}
};

export default function (state = defaultStore, {
  type,
  value,
}: ReducerAction) {
  switch (type) {
    case ReducerActionType.SET_CARD_COORDINATES:
      if (!value?.id) {
        throw new Error(`SET_CARD_COORDINATES missing ReducerAction value { id: string }`);
      };

      return {
        ...state,
        coordinates: {
          ...state.coordinates,
          [value?.id]: value?.coordinate
        }
      };
    default:
      return state;
  }
}
