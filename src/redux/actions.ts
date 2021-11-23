import { ContextMenuAction } from "./reducers/ContextMenuReducer";

export const SHOW_CONTEXT_MENU = "SHOW_CONTEXT_MENU";
export const HIDE_CONTEXT_MENUS = "HIDE_CONTEXT_MENUS";

export const showMenu = (id: string, left: number, top: number, zIndex: number): ContextMenuAction => {
  return {
    type: SHOW_CONTEXT_MENU,
    value: {
      id,
      left,
      top,
      zIndex,
    }
  };
};

export const hideMenus = () => {
  return {
    type: HIDE_CONTEXT_MENUS,
  };
};
