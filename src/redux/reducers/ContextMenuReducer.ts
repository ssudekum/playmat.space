import { SHOW_CONTEXT_MENU, HIDE_CONTEXT_MENUS } from "../actions";

export type ContextMenuData = {
  id: string;
  left: number;
  top: number;
  visible: boolean;
  zIndex: number;
};

export type ContextMenuStore = {
  [id: string]: ContextMenuData;
};

export type ContextMenuAction = {
  type: string;
  value?: any;
};

export default function (state: ContextMenuStore = {}, action: ContextMenuAction) {
  switch (action.type) {
    case SHOW_CONTEXT_MENU: 
      return {
        ...state,
        [action.value.id]: {
          ...action.value,
          visible: true,
        }
      };
    case HIDE_CONTEXT_MENUS: 
      return Object.values(state)
        .reduce((next: ContextMenuStore, contextMenu) => {
          contextMenu.visible = false;
          next[contextMenu.id] = contextMenu;
          return next;
        }, {});
    default:
      return state;
  }
}
