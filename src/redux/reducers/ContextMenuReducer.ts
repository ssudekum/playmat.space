import { ReducerActionType, ReducerAction } from "../actions";

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

export default function (state: ContextMenuStore = {}, { type, value }: ReducerAction) {
  switch (type) {
    case ReducerActionType.SHOW_CONTEXT_MENU: 
      if (!value?.id) {
        throw new Error(`SHOW_CONTEXT_MENU missing ReducerAction value { id: string }`);
      };

      return {
        ...state,
        [value?.id]: {
          ...value,
          visible: true,
        }
      };
    case ReducerActionType.HIDE_CONTEXT_MENUS: 
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
