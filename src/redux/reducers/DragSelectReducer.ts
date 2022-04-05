import { Coordinate } from "../../lib/type/Spatial";
import { ReducerActionType } from "../actions";

export type DragSelectStore = {
  isDragging: boolean;
  origin: Coordinate;
  location: Coordinate;
};

export type DragSelectAction = {
  type: string
  value: any
};

const defaultStore = {
  isDragging: false,
  origin: {
    x: 0,
    y: 0,
  },
  location: {
    x: 0,
    y: 0,
  }
};

export default function (state: DragSelectStore = defaultStore, {
  type,
  value
}: DragSelectAction) {
  switch (type) {
    case ReducerActionType.SET_IS_DRAGGING:
      return {
        ...state,
        isDragging: value,
      };
    case ReducerActionType.SET_ORIGIN:
      return {
        ...state,
        origin: value
      };
    case ReducerActionType.SET_LOCATION:
      return {
        ...state,
        location: value
      };
    default:
      return state;
  }
}
