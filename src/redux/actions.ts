import { Dispatch } from "redux";
import { Coordinate } from "../lib/type/Spatial";
import { RootState } from ".";

export enum ReducerActionType {
  SHOW_CONTEXT_MENU = "SHOW_CONTEXT_MENU",
  HIDE_CONTEXT_MENUS = "HIDE_CONTEXT_MENUS",
  SET_IS_DRAGGING = "SET_IS_DRAGGING",
  SET_ORIGIN = "SET_ORIGIN",
  SET_LOCATION = "SET_LOCATION",
  SET_SIZE = "SET_SIZE",
  SET_CARD_COORDINATES = "SET_CARD_COORDINATES",
};

export type ReducerAction = {
  type: ReducerActionType;
  value?: Record<string, any>;
};

export const showContextMenuById = (id: string, left: number, top: number, zIndex: number) => ({
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

export const setOrigin = (coordinate: Coordinate) => ({
  type: ReducerActionType.SET_ORIGIN,
  value: coordinate,
});

export const setLocation = (coordinate: Coordinate) => ({
  type: ReducerActionType.SET_LOCATION,
  value: coordinate,
});

export const setSize = (size: number) => ({
  type: ReducerActionType.SET_SIZE,
  value: size
});

export const increaseCardSize = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const cardSize = getState().cardSizeReducer.size;
    dispatch(setSize(cardSize + 0.1));
  };
};

export const decreaseCardSize = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const cardSize = getState().cardSizeReducer.size;
    dispatch(setSize(cardSize - 0.1 > 0 ? cardSize - 0.1 : 0));
  };
};

export const setSelectedCards = (id: string, coordinate: Coordinate) => ({
  type: ReducerActionType.SET_CARD_COORDINATES,
  value: {
    id,
    coordinate
  }
});
