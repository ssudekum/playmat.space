import { ReducerActionType } from "../actions";

export type DragSelectStore = {
  isDragging?: boolean;
};

export type DragSelectAction = {
  type: string
  value: any
};

export default function (state: DragSelectStore = {}, {
  type,
  value
}: DragSelectAction) {
  switch (type) {
    case ReducerActionType.SET_IS_DRAGGING:
      return {
        ...state,
        isDragging: value,
      };
    default:
      return state;
  }
}
