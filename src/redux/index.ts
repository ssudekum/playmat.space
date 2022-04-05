import { combineReducers } from 'redux';
import cardSizeReducer, { CardSizeStore } from "./reducers/CardSizeReducer";
import contextMenuReducer, { ContextMenuStore } from "./reducers/ContextMenuReducer";
import dragSelectReducer, { DragSelectStore } from "./reducers/DragSelectReducer";
import playmatReducer, { PlaymatStore } from "./reducers/PlaymatReducer";

export type RootState = {
  cardSizeReducer: CardSizeStore
  contextMenuReducer: ContextMenuStore
  dragSelectReducer: DragSelectStore
  playmatReducer: PlaymatStore
};

export default combineReducers({
  cardSizeReducer,
  contextMenuReducer,
  dragSelectReducer,
  playmatReducer,
});
