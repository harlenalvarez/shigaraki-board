

export type Need<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;
export type Action<T = undefined, Ttype = string> = { type: Ttype, payload: T };
export type ReducerDispatch<T> = (value: T) => void
export type ReducerActions<TState> = { [key: string]: (state: TState, action: Action<any, any | undefined>) => TState }
export type CreateReducerFunction = <TState>(actions: ReducerActions<TState>) => (state: TState, action: Action<any, keyof typeof actions>) => TState

export type GetActionKeys<T> = T extends (actions: infer FirstArgument, ...args: any[]) => any ?
  FirstArgument extends {} ? FirstArgument : never
  : never

export type ActionDispatchType<T> = { [key in keyof T]: (
  payload?: T[key] extends (first: any, second: infer Second) => any ?
    Second extends { payload: infer Payload } ? Payload : never
    : never) => void
}


export const createReducer: CreateReducerFunction = <T>(actions: ReducerActions<T>) => (state: T, action: Action<any, keyof typeof actions>) => {
  return actions[action.type](state, action)
}

export const createActions = <GetActionKeys>(actions: GetActionKeys, dispatch: ReducerDispatch<any>) => {
  const dispatchActions = {};

  for (let key of Object.keys(actions as {})) {
    Object.defineProperty(dispatchActions, key, {
      value: (payload: unknown) => {
        dispatch({ type: key, payload });
      }
    });
  }
  return dispatchActions as {
    [key in keyof GetActionKeys]: (
      payload?: typeof actions[key] extends (first: any, second: infer Second) => any ?
        Second extends { payload: infer Payload } ? Payload : never
        : never) => void
  }
}

export const isType = <T>(obj: any, ...keys: Array<keyof T>): obj is T => {
  for (const key of keys) {
    if (obj[key] === null || obj[key] === undefined) return false;
  }
  return true;
};


