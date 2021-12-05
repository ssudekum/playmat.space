import { combineReducers } from "redux";
import contextMenuReducer, { ContextMenuStore } from "./ContextMenuReducer";
import dragSelectReducer, { DragSelectStore } from "./DragSelectReducer";

export type RootState = {
  contextMenuReducer: ContextMenuStore
  dragSelectReducer: DragSelectStore
};

export default combineReducers({ contextMenuReducer, dragSelectReducer });
