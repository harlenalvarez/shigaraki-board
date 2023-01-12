import { createContext } from 'react';



export const DrawContext = createContext(null);
export const DrawContextDispatch = createContext(null);




export const DrawContextProvider = () => {
  return (
    <DrawContext.Provider value={null}>
      <DrawContextDispatch.Provider value={null}>

      </DrawContextDispatch.Provider>
    </DrawContext.Provider>
  )
}