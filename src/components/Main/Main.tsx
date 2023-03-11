import { MainContainer } from './Main.styled';
import { MenuFab } from './MenuFab';
import { Hanlders } from './SelectionHandlers';

const MainActions = () => {
  const CurrentHandle = Hanlders.get('box');
  if (CurrentHandle == null) return null;
  return (
    <CurrentHandle />
  );
};

export const Main = () => {
  console.log('Rendering main');
  // const length = useSyncExternalStore(renderedObjectsIntance.subscribe, renderedObjectsIntance.getSnapshot)
  // const [draw] = useRenderedObjectsDraw(renderedObjectsIntance)

  // console.log(length)
  // if (length) {
  //   draw();
  // }

  return (
    <MainContainer>
      <MenuFab />
    </MainContainer>
  );
};
