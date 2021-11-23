import { combineReducers } from "redux";
import contextMenuReducer, { ContextMenuStore } from "./ContextMenuReducer";

export type RootState = {
  contextMenuReducer: ContextMenuStore
};

export default combineReducers({ contextMenuReducer });
