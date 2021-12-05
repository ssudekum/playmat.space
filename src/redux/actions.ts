
export enum ReducerActionType {
  SHOW_CONTEXT_MENU = "SHOW_CONTEXT_MENU",
  HIDE_CONTEXT_MENUS = "HIDE_CONTEXT_MENUS",
  SET_IS_DRAGGING = "SET_IS_DRAGGING",
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
