import { createContext, useContext, useState } from 'react';

export const CanvasContext = createContext<CanvasRenderingContext2D | null | undefined>(null);
export const SetCanvasContext = createContext<React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | null | undefined>>>(() => { });

export type CanvasCtxProviderProps = {
  children: React.ReactNode
};

export const CanvasCtxProvider = ({ children }: CanvasCtxProviderProps) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null);

  const handleSet = (ctx: React.SetStateAction<CanvasRenderingContext2D | null | undefined>) => {
    setCtx(ctx);
  };

  return (
    <CanvasContext.Provider value={ctx}>
      <SetCanvasContext.Provider value={handleSet}>
        {children}
      </SetCanvasContext.Provider>
    </CanvasContext.Provider>
  );
};

export const useCanvasCtx = () => useContext(CanvasContext);
export const useSetCanvasCtx = () => useContext(SetCanvasContext);
