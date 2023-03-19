import { useCanvasCtx } from '@/store';
import { ActionListenerContainer } from '../Main.styled';


export const SphereHandler = () => {
  const ctx = useCanvasCtx();

  return (
    <>
      <ActionListenerContainer onClick={() => { console.log('clicked') }}></ActionListenerContainer>
    </>
  );
};
