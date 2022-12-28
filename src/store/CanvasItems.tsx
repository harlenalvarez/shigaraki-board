import React, { createContext, useContext, useReducer } from 'react';
import { Action, CanvasComponent, isType } from '@/types';

type CanvasItemsState = {
  components: CanvasComponent[]
};

const initStatte: CanvasItemsState = {
  components: []
};

const CanvasItemsReducer = (state: CanvasItemsState, action: Action<Partial<CanvasItemsState> | CanvasComponent>) => {
  switch (action.type) {
    case 'AddItem': {
      if ((action.payload == null) || !isType<CanvasComponent>(action.payload, 'componentId', 'position')) { return state; }
      const cloned = [...state.components];
      cloned.push(action.payload);
      return { ...state, components: cloned };
    }
    default:
      return state;
  }
};

const useCanvasAction = (dispatch: React.Dispatch<Parameters<typeof CanvasItemsReducer>[1]>) => ({
  addItem: (item: CanvasComponent) => dispatch({ type: 'AddItem', payload: item })
});

const CanvasItemsContext = createContext(initStatte);
const CanvasItemsActions = createContext<ReturnType<typeof useCanvasAction>>({} as any);

export const CanvasItemsProvider = (props: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(CanvasItemsReducer, initStatte);
  const canvasActions = useCanvasAction(dispatch);
  return (
    <CanvasItemsActions.Provider value={canvasActions}>
      <CanvasItemsContext.Provider value={state}>
        {props.children}
      </CanvasItemsContext.Provider>
    </CanvasItemsActions.Provider>
  );
};

export const useCanvasItems = () => useContext(CanvasItemsContext);
export const useCanvasItemsActions = () => useContext(CanvasItemsActions);
