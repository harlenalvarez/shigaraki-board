import { MenuFab } from './MenuFab';
import { Hanlders } from './SelectionHandlers';

const MainActions = () => {
  const CurrentHandle = Hanlders.get('div');
  if (CurrentHandle == null) return null;
  return (
    <CurrentHandle />
  );
};

export const Main = () => {
  return (
    <>
      <MenuFab />
      <MainActions />
    </>
  );
};
