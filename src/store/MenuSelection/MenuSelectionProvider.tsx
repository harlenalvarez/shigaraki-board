import { ActionDispatchType, createActions, createReducer } from '@/types';
import { createContext, useContext, useReducer } from 'react';
import { menuSelectionActions, menuSelectionInitialState } from './MenuSelectionContext';

export type MenuSelectionProviderProps = {
  children: React.ReactNode
};

export const MenuSelectionContext = createContext(menuSelectionInitialState);
const MenuSelectionActions = createContext<ActionDispatchType<typeof menuSelectionActions> | null>(null);
export const MenuSelectionProvider = ({ children }: MenuSelectionProviderProps) => {
  const [state, dispatch] = useReducer(createReducer(menuSelectionActions), menuSelectionInitialState);
  const actions = createActions(menuSelectionActions, dispatch);

  return (
    <MenuSelectionContext.Provider value={state}>
      <MenuSelectionActions.Provider value={actions}>
        {children}
      </MenuSelectionActions.Provider>
    </MenuSelectionContext.Provider>
  );
};

export const useMenuSelection = () => useContext(MenuSelectionContext);
export const useMenuSelectionActions = () => useContext(MenuSelectionActions);
