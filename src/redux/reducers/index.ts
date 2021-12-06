import { combineReducers } from 'redux';
import cardSizeReducer, { CardSizeStore } from "./CardSizeReducer";
import contextMenuReducer, { ContextMenuStore } from "./ContextMenuReducer";
import dragSelectReducer, { DragSelectStore } from "./DragSelectReducer";

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
