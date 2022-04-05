import { combineReducers } from 'redux';
import cardSizeReducer, { CardSizeStore } from "./reducers/CardSizeReducer";
import contextMenuReducer, { ContextMenuStore } from "./reducers/ContextMenuReducer";
import dragSelectReducer, { DragSelectStore } from "./reducers/DragSelectReducer";

export type RootState = {
  cardSizeReducer: CardSizeStore
  contextMenuReducer: ContextMenuStore
  dragSelectReducer: DragSelectStore
};

export default combineReducers({
  cardSizeReducer,
  contextMenuReducer,
  dragSelectReducer,
});
