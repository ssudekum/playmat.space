import { Dispatch } from "redux";
import { RootState } from "./reducers";

export enum ReducerActionType {
  SHOW_CONTEXT_MENU = "SHOW_CONTEXT_MENU",
  HIDE_CONTEXT_MENUS = "HIDE_CONTEXT_MENUS",
  SET_IS_DRAGGING = "SET_IS_DRAGGING",
  SET_SIZE = "SET_SIZE",
};

export type ReducerAction = {
  type: ReducerActionType;
  value?: Record<string, any>;
};

export const showContextMenu = (id: string, left: number, top: number, zIndex: number) => ({
  type: ReducerActionType.SHOW_CONTEXT_MENU,
  value: {
    id,
    top,
    left,
    zIndex,
  }
});

export const hideContextMenus = () => ({
  type: ReducerActionType.HIDE_CONTEXT_MENUS,
});

export const setIsDragging = (isDragging: boolean) => ({
  type: ReducerActionType.SET_IS_DRAGGING,
  value: isDragging,
});

export const setSize = (size: number) => ({
  type: ReducerActionType.SET_SIZE,
  value: size
});

export const increaseCardSize = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const size = getState().cardSizeReducer.size;
    dispatch(setSize(size + 0.1));
  };
};

export const decreaseCardSize = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const size = getState().cardSizeReducer.size;
    dispatch(setSize(size - 0.1));
  };
};
